import hashlib
import logging
import os
import re
from contextlib import asynccontextmanager
from hmac import compare_digest
from uuid import UUID, uuid4

import httpx
from fastapi import Depends, FastAPI, Header, HTTPException, Request, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from psycopg import Error
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool, PoolTimeout
from pydantic import BaseModel, Field, field_validator
from pypdf.errors import PyPdfError
from starlette.concurrency import run_in_threadpool

from .ingestion import chunk_pages, extract
from .provider import Provider, ProviderError

logger = logging.getLogger("rag")
MAX_UPLOAD = 2 * 1024 * 1024
bearer = HTTPBearer(auto_error=False)


@asynccontextmanager
async def lifespan(app: FastAPI):
    raw_keys = os.environ["RAG_API_KEYS"].split(",")
    keys = [entry.split("=", 1) for entry in raw_keys]
    if any(len(pair) != 2 or not re.fullmatch(r"[a-zA-Z0-9_-]{1,64}", pair[0])
           or len(pair[1]) < 32 for pair in keys):
        raise ValueError("Set RAG_API_KEYS to tenant=secret pairs with 32+ character secrets.")
    if len({secret for _, secret in keys}) != len(keys):
        raise ValueError("Each API key must be unique.")
    app.state.keys = [(tenant, hashlib.sha256(secret.encode()).digest()) for tenant, secret in keys]
    threshold = float(os.getenv("RAG_MIN_SIMILARITY", "0.30"))
    if not 0 <= threshold <= 1:
        raise ValueError("RAG_MIN_SIMILARITY must be between 0 and 1.")
    app.state.threshold = threshold
    with ConnectionPool(
        os.environ["DATABASE_URL"], min_size=1, max_size=8, timeout=3,
        kwargs={"row_factory": dict_row, "options": "-c statement_timeout=5000"},
        open=False,
    ) as pool, httpx.Client(
        base_url="https://api.openai.com/v1/",
        headers={"Authorization": "Bearer " + os.environ["OPENAI_API_KEY"]},
        timeout=httpx.Timeout(30, connect=5),
    ) as client:
        pool.wait(timeout=15)
        app.state.pool = pool
        app.state.provider = Provider(client, os.getenv("RAG_CHAT_MODEL", "gpt-4.1-mini"))
        yield


app = FastAPI(title="Document RAG", lifespan=lifespan)


def tenant(request: Request, credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
    if credentials:
        digest = hashlib.sha256(credentials.credentials.encode()).digest()
        match = None
        for name, expected in request.app.state.keys:
            if compare_digest(digest, expected):
                match = name
        if match is not None:
            return match
    raise HTTPException(401, "Invalid API key.", headers={"WWW-Authenticate": "Bearer"})


@app.exception_handler(ProviderError)
@app.exception_handler(PoolTimeout)
@app.exception_handler(Error)
async def dependency_error(request: Request, exc: Exception):
    logger.warning("Dependency error (%s)", type(exc).__name__)
    return Response('{"detail":"A service dependency failed. Retry later."}',
                    status_code=503, media_type="application/json")


@app.get("/health/live")
def live():
    return {"status": "ok"}


@app.get("/health/ready")
def ready(request: Request):
    with request.app.state.pool.connection() as conn:
        conn.execute("SELECT 1 FROM chunks LIMIT 1")
    return {"status": "ready"}


@app.get("/v1/documents")
def documents(request: Request, offset: int = 0, scope: str = Depends(tenant)):
    if not 0 <= offset <= 100_000:
        raise HTTPException(422, "Invalid offset.")
    with request.app.state.pool.connection() as conn:
        return conn.execute(
            """SELECT id, filename, created_at FROM documents WHERE tenant = %s
               ORDER BY created_at DESC, id LIMIT 50 OFFSET %s""", (scope, offset),
        ).fetchall()


def ingest(state, scope: str, filename: str, data: bytes) -> dict:
    digest = hashlib.sha256(data).hexdigest()
    lookup = "SELECT id FROM documents WHERE tenant = %s AND sha256 = %s"
    with state.pool.connection() as conn:
        existing = conn.execute(lookup, (scope, digest)).fetchone()
        if existing:
            return {"id": existing["id"], "deduplicated": True}
    try:
        chunks = chunk_pages(extract(filename, data))
    except (ValueError, PyPdfError, RecursionError) as exc:
        raise HTTPException(422, "Unsupported or unreadable document, or document exceeds limits.") from exc

    vectors = []
    for start in range(0, len(chunks), 32):
        vectors.extend(state.provider.embed([content for _, content in chunks[start:start + 32]]))

    with state.pool.connection() as conn:
        # Retry once if a concurrent delete removes the winning insert before our lookup.
        for _ in range(2):
            inserted = conn.execute(
                """INSERT INTO documents (id, tenant, filename, sha256) VALUES (%s, %s, %s, %s)
                   ON CONFLICT (tenant, sha256) DO NOTHING RETURNING id""",
                (uuid4(), scope, filename, digest),
            ).fetchone()
            if inserted:
                doc_id = inserted["id"]
                with conn.cursor() as cursor:
                    cursor.executemany(
                        """INSERT INTO chunks (document_id, ordinal, page, content, embedding)
                           VALUES (%s, %s, %s, %s, %s::vector)""",
                        [(doc_id, i, page, content, vector)
                         for i, ((page, content), vector) in enumerate(zip(chunks, vectors, strict=True))],
                    )
                return {"id": doc_id, "deduplicated": False}
            existing = conn.execute(lookup, (scope, digest)).fetchone()
            if existing:
                return {"id": existing["id"], "deduplicated": True}
    raise HTTPException(409, "Document changed concurrently. Retry the upload.")


@app.post("/v1/documents", status_code=201)
async def upload(
    request: Request, response: Response,
    filename: str = Header(alias="X-Filename", min_length=1, max_length=200),
    scope: str = Depends(tenant),
):
    if any(ord(char) < 32 or char in "/\\\x7f" for char in filename):
        raise HTTPException(422, "Provide a plain filename.")
    data = bytearray()
    async for part in request.stream():
        if len(data) + len(part) > MAX_UPLOAD:
            raise HTTPException(413, "Upload exceeds 2 MiB.")
        data.extend(part)
    result = await run_in_threadpool(ingest, request.app.state, scope, filename, bytes(data))
    if result["deduplicated"]:
        response.status_code = 200
    return result


@app.delete("/v1/documents/{document_id}", status_code=204)
def delete(document_id: UUID, request: Request, scope: str = Depends(tenant)):
    with request.app.state.pool.connection() as conn:
        deleted = conn.execute(
            "DELETE FROM documents WHERE id = %s AND tenant = %s RETURNING id",
            (document_id, scope),
        ).fetchone()
        if deleted is None:
            raise HTTPException(404, "Document not found.")
    return Response(status_code=204)


class Query(BaseModel):
    question: str = Field(min_length=1, max_length=2000)

    @field_validator("question")
    @classmethod
    def require_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Question must contain text.")
        return value.strip()


@app.post("/v1/query")
def query(payload: Query, request: Request, scope: str = Depends(tenant)):
    state = request.app.state
    vector, = state.provider.embed([payload.question])
    with state.pool.connection() as conn:
        candidates = conn.execute(
            """SELECT d.id AS document_id, d.filename, c.ordinal, c.page, c.content,
                      c.embedding <=> %s::vector AS distance
               FROM chunks c JOIN documents d ON d.id = c.document_id
               WHERE d.tenant = %s ORDER BY distance, d.id, c.ordinal LIMIT 8""",
            (vector, scope),
        ).fetchall()
    evidence = [row for row in candidates if 1 - row["distance"] >= state.threshold]
    abstention = {"status": "insufficient_evidence", "answer": None, "citations": []}
    if not evidence:
        return abstention
    result = state.provider.answer(payload.question, [row["content"] for row in evidence])
    if not result.answer.strip() or not result.citations:
        return abstention
    citations = []
    for index in dict.fromkeys(result.citations):
        source = evidence[index - 1].copy()
        source.pop("distance")
        citations.append({"id": index, **source})
    return {"status": "answered", "answer": result.answer, "citations": citations}

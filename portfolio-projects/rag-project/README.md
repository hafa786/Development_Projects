# Document RAG

FastAPI service for asking questions over private, tenant-scoped document collections. It extracts text from PDFs, Markdown and UTF-8 text files, stores passages in PostgreSQL with pgvector, and returns answers with passage citations.

## Run locally

Requirements are Docker Compose v2 and an OpenAI API key. Copy the settings template.

```sh
cp .env.example .env
openssl rand -hex 32
openssl rand -hex 32
```

Set `POSTGRES_PASSWORD` to the first generated secret, `RAG_API_KEYS=demo=<second-generated-secret>`, and `OPENAI_API_KEY` to your provider key. Use comma-separated tenant/key pairs for multiple tenants. Multiple unique keys can share the same tenant name during rotation. Each key grants full document and query access to its tenant.

```sh
docker compose up --build -d
curl -fsS http://127.0.0.1:8000/health/ready
```

Interactive API documentation is at http://127.0.0.1:8000/docs. The database is private to the Compose network. On first startup, PostgreSQL applies `schema.sql` to the new data volume.

## Upload and query

```sh
read -rs RAG_TOKEN
printf 'The office closes at 17:00 on weekdays.\n' > office.txt

curl -fsS http://127.0.0.1:8000/v1/documents \
  -H "Authorization: Bearer $RAG_TOKEN" \
  -H 'X-Filename: office.txt' \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @office.txt

curl -fsS http://127.0.0.1:8000/v1/query \
  -H "Authorization: Bearer $RAG_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"question":"When does the office close on weekdays?"}'
```

| Method and route | Behavior |
| --- | --- |
| POST /v1/documents | Ingests raw file bytes and returns the document ID. Identical bytes within a tenant return the existing ID. |
| GET /v1/documents?offset=0 | Lists up to 50 documents owned by the authenticated tenant. |
| DELETE /v1/documents/{id} | Deletes a tenant-owned document and its passages. |
| POST /v1/query | Returns an answer and cited passages, or an insufficient-evidence result. |
| GET /health/live | Checks API process responsiveness. |
| GET /health/ready | Checks database access and schema availability. |

Uploads are limited to 2 MiB, 100 PDF pages and 250 chunks. Scanned PDFs require OCR before upload. Document writes are atomic. OpenAI receives document text for embeddings and receives questions and selected passages for generation. Citation IDs are checked against the retrieved passages. Grounding still depends on model behavior.

Retrieval uses an exact cosine search over the authenticated tenant's passages. The similarity threshold is configurable and should be calibrated with representative queries. Citations include the document ID, filename, PDF page when available, zero-based chunk ordinal, and source text. Retain original files separately if you need to re-embed or reparse them later.

## Verification

```sh
python -m pip install -r requirements.txt
python -m unittest discover -v
DATABASE_URL=postgresql://... python -m tests.smoke
```

The smoke test requires a disposable PostgreSQL database initialized with `schema.sql`. It stubs the model provider and checks upload, deduplication, citations, tenant isolation and deletion. GitHub Actions provisions pgvector, runs both test suites and builds the Docker image.

## Production deployment gates

- Put the API behind a TLS gateway with body and request timeouts, a 2 MiB request limit, and per-tenant rate and spend limits. Configure provider budgets and alert on dependency errors, latency and token usage.
- Use a dedicated, least-privilege application DB role and run schema changes separately with versioned migrations. Configure encrypted backups and rehearse a restore.
- Isolate PDF processing in a resource-limited worker before accepting uploads from untrusted users. Synchronous ingestion suits small files and controlled traffic. Use a durable ingestion queue for workloads that exceed the gateway timeout.
- Run a live-provider smoke test and evaluate answer accuracy, citation support and abstention on your documents. Load-test representative tenant sizes before selecting a vector indexing strategy.

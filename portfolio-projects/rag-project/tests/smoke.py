"""Run against a disposable PostgreSQL database initialized with schema.sql."""
import os
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.provider import Answer, Provider, vector_literal


def main():
    first, second = "a" * 40, "b" * 40
    os.environ.update(RAG_API_KEYS=f"first={first},second={second}", OPENAI_API_KEY="test")
    a = {"Authorization": f"Bearer {first}", "X-Filename": "policy.txt"}
    b = {"Authorization": f"Bearer {second}"}
    vector = vector_literal([1.0] + [0.0] * 1535)
    data = b"The office closes at 17:00."
    question = {"question": "When does the office close?"}
    with (
        patch.object(Provider, "embed", side_effect=lambda inputs: [vector] * len(inputs)),
        patch.object(Provider, "answer", return_value=Answer(answer="17:00", citations=[1])),
        TestClient(app) as client,
    ):
        assert client.get("/health/ready").status_code == 200
        assert client.post("/v1/query", json=question).status_code == 401
        assert client.post("/v1/documents", headers=a, content=b"x" * (2**21 + 1)).status_code == 413
        uploaded = client.post("/v1/documents", headers=a, content=data)
        assert uploaded.status_code == 201, uploaded.text
        doc_id = uploaded.json()["id"]
        repeated = client.post("/v1/documents", headers=a, content=data)
        assert repeated.status_code == 200 and repeated.json()["id"] == doc_id
        result = client.post("/v1/query", headers=a, json=question).json()
        assert result["answer"] == "17:00" and result["citations"][0]["document_id"] == doc_id
        assert client.get("/v1/documents", headers=b).json() == []
        assert client.post("/v1/query", headers=b, json=question).json()["status"] == "insufficient_evidence"
        path = f"/v1/documents/{doc_id}"
        assert client.delete(path, headers=b).status_code == 404
        assert client.delete(path, headers=a).status_code == 204
        assert client.post("/v1/query", headers=a, json=question).json()["status"] == "insufficient_evidence"


if __name__ == "__main__":
    main()

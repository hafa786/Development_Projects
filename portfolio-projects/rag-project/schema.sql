CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE documents (
    id uuid PRIMARY KEY,
    tenant text NOT NULL,
    filename text NOT NULL,
    sha256 text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant, sha256)
);
CREATE TABLE chunks (
    document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    ordinal integer NOT NULL,
    page integer,
    content text NOT NULL,
    embedding vector(1536) NOT NULL,
    PRIMARY KEY (document_id, ordinal)
);

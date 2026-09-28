# 📄 Multimodal Document Analyzer

A production-oriented **AI-powered multimodal document analysis platform** that allows users to upload PDFs and images, extract and analyze their content, and ask natural-language questions about uploaded documents.

The project is designed as a learning and portfolio project covering **Multimodal AI, RAG, Microservices, Event-Driven Architecture, Docker, Kubernetes, Kafka, PostgreSQL, Go, Java Spring Boot, Python, React, and TypeScript**.

---

## 🎯 Project Goal

The application allows users to:

1. Upload PDF documents and images.
2. Extract text from digital and scanned documents.
3. Detect and extract tables and structured information.
4. Understand images, diagrams, and charts.
5. Generate document summaries.
6. Ask natural-language questions about documents.
7. Search documents using semantic search.
8. Compare multiple documents.
9. Receive answers with source/page references.
10. Process large documents asynchronously.

Example questions:

```text
"What is the total amount on this invoice?"

"Summarize this report."

"What are the key risks mentioned in this document?"

"What does the diagram on page 7 explain?"

"Compare these two contracts."

"Find differences between document A and document B."

"Which document mentions Kubernetes?"

"Extract all financial figures from this report."
```

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Backend

### Java

- Java 21+
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- OAuth2 / JWT
- Kafka
- Flyway
- Testcontainers

### Go

- Go
- REST APIs
- File streaming
- Concurrent document processing
- Kafka integration

### Python

- Python 3
- FastAPI
- Pydantic
- SQLAlchemy
- PyMuPDF
- OCR
- LLM integration
- Embeddings
- RAG

## Database

- PostgreSQL
- pgvector
- JSONB

## Messaging

- Apache Kafka

## Infrastructure

- Docker
- Docker Compose
- Kubernetes
- Ingress
- Horizontal Pod Autoscaling

## Observability

- Prometheus
- Grafana
- OpenTelemetry
- Centralized logging

## Testing

- Pytest
- JUnit 5
- Mockito
- Go Testing
- Testcontainers
- Vitest
- React Testing Library
- Playwright

---

# 🏗 High-Level Architecture

```text
                     React + TypeScript
                            │
                            ▼
                    ┌───────────────┐
                    │ API Gateway   │
                    │ Spring Boot   │
                    └───────┬───────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
          ▼                 ▼                  ▼
 ┌────────────────┐ ┌───────────────┐ ┌────────────────┐
 │ Document API   │ │ Query / User  │ │ Metadata API   │
 │ Go             │ │ Spring Boot   │ │ Spring Boot    │
 └───────┬────────┘ └───────┬───────┘ └───────┬────────┘
         │                  │                  │
         └──────────────┬───┴──────────────────┘
                        │
                   PostgreSQL
                  + pgvector
                        │
                        ▼
                   Apache Kafka
                        │
              ┌─────────┴──────────┐
              ▼                    ▼
      ┌───────────────┐    ┌────────────────┐
      │ Document      │    │ AI / RAG       │
      │ Processor     │    │ Service        │
      │ Python        │    │ Python         │
      └───────┬───────┘    └───────┬────────┘
              │                    │
       PDF / OCR / Image      LLM + Embeddings
          Extraction          + Vector Search
              │                    │
              └─────────┬──────────┘
                        ▼
                    PostgreSQL
                     pgvector
```

---

# 🧩 Service Responsibilities

The project intentionally uses multiple backend technologies. Each technology has a specific responsibility rather than introducing multiple languages unnecessarily.

## Go — Document Service

The Go service is responsible for high-performance file operations.

Responsibilities:

```text
Document uploads
File validation
File streaming
Document storage
Checksums
Metadata
Downloads
Deletion
Kafka event publishing
```

Example endpoints:

```http
POST   /documents
GET    /documents
GET    /documents/{id}
GET    /documents/{id}/download
DELETE /documents/{id}
```

---

## Spring Boot — Core API

Spring Boot provides the main application and business layer.

Responsibilities:

```text
Authentication
Authorization
Users
Document metadata
Conversations
Business rules
API orchestration
Audit history
Security
Kafka integration
```

Spring technologies:

```text
Spring Boot
Spring Web
Spring Data JPA
Spring Security
OAuth2
JWT
Spring Kafka
Flyway
Testcontainers
```

---

## Python — AI Service

Python handles document intelligence and AI workloads.

Responsibilities:

```text
PDF parsing
OCR
Image understanding
Table extraction
Document classification
Chunking
Embeddings
Vector retrieval
Semantic search
RAG
Summarization
Structured extraction
LLM integration
```

---

# 🚀 Development Roadmap

The application will be developed incrementally.

```text
Phase 1  → MVP
Phase 2  → Multimodal AI
Phase 3  → RAG
Phase 4  → Microservices
Phase 5  → Kafka
Phase 6  → Advanced Document Intelligence
Phase 7  → Security
Phase 8  → Kubernetes
Phase 9  → Testing & Observability
Phase 10 → CI/CD & Production
```

---

# Phase 1 — MVP

The first phase focuses on building a complete working vertical workflow before introducing microservices.

## Features

Users can:

- Upload PDF files
- Upload PNG/JPG images
- View uploaded documents
- Extract text from PDFs
- Extract text from images using OCR
- View processing status
- View extracted text
- Ask basic questions
- Receive answers with page references
- Delete documents

## Architecture

```text
Upload Document
       │
       ▼
React + TypeScript
       │
       ▼
FastAPI
       │
       ├── Validate
       ├── Store
       ├── Extract
       └── Analyze
       │
       ▼
PostgreSQL
       │
       ▼
Question
       │
       ▼
Document Search
       │
       ▼
Answer
```

## Phase 1 Stack

```text
React
TypeScript
FastAPI
Python
PostgreSQL
PyMuPDF
OCR
Docker
Docker Compose
```

## Initial APIs

```http
POST   /api/v1/documents

GET    /api/v1/documents

GET    /api/v1/documents/{id}

DELETE /api/v1/documents/{id}

GET    /api/v1/documents/{id}/content

POST   /api/v1/documents/{id}/questions
```

Example request:

```json
{
  "question": "What are the main risks mentioned in this document?"
}
```

Example response:

```json
{
  "answer": "The document identifies three primary risks...",
  "sources": [
    {
      "page": 4,
      "text": "Relevant source content..."
    }
  ]
}
```

---

# Phase 2 — Multimodal AI

Phase 2 expands the application beyond normal PDF text extraction.

The system will understand:

- Scanned PDFs
- Screenshots
- Invoices
- Receipts
- Forms
- Reports
- Tables
- Charts
- Diagrams
- Images

## Processing Pipeline

```text
                    Document
                        │
              ┌─────────┴─────────┐
              │                   │
             PDF                Image
              │                   │
              ▼                   ▼
        Text Extraction          OCR
              │                   │
              └─────────┬─────────┘
                        ▼
                 Layout Analysis
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
         Text         Tables       Images
           │            │            │
           └────────────┼────────────┘
                        ▼
                   AI Analysis
```

---

# Phase 3 — RAG

Phase 3 introduces **Retrieval-Augmented Generation**.

Instead of sending entire documents to an LLM, documents are divided into smaller chunks and indexed using embeddings.

## RAG Pipeline

```text
Document
   │
   ▼
Extract
   │
   ▼
Clean
   │
   ▼
Chunk
   │
   ▼
Generate Embeddings
   │
   ▼
PostgreSQL + pgvector


Question
   │
   ▼
Generate Query Embedding
   │
   ▼
Vector Similarity Search
   │
   ▼
Top Relevant Chunks
   │
   ▼
LLM
   │
   ▼
Grounded Answer
   │
   ▼
Source Citations
```

## Database Tables

Possible tables include:

```text
users
documents
document_pages
document_chunks
conversations
messages
processing_jobs
audit_logs
```

Example `document_chunks` structure:

```text
id
document_id
page_number
content
embedding
metadata
created_at
```

The embedding column can use:

```sql
vector(1536)
```

through PostgreSQL's `pgvector` extension.

---

# Phase 4 — Microservices

After the MVP and RAG pipeline work correctly, the application will be separated into services.

```text
React
   │
   ▼
Spring Boot API
   │
   ├──────────────► PostgreSQL
   │
   ├──────────────► Go Document Service
   │
   └──────────────► Python AI Service
```

Services:

```text
Spring Boot
    ↓
Core business API

Go
    ↓
Document/file service

Python
    ↓
AI/document intelligence
```

This allows each language to solve the problems for which it is best suited.

---

# Phase 5 — Event-Driven Processing with Kafka

Large documents should not block HTTP requests while processing.

Kafka will provide asynchronous communication between services.

## Event Flow

```text
User Upload
     │
     ▼
Go Document Service
     │
     ▼
Kafka
     │
     ▼
document.uploaded
     │
     ▼
Python Document Worker
     │
     ├── Extract
     ├── OCR
     └── Parse
     │
     ▼
document.text.extracted
     │
     ▼
Embedding Worker
     │
     ▼
Generate Embeddings
     │
     ▼
pgvector
     │
     ▼
document.indexed
```

## Kafka Topics

```text
document.uploaded

document.processing.started

document.text.extracted

document.embedding.requested

document.indexed

document.processing.completed

document.processing.failed

document.deleted
```

Important Kafka concepts covered by the project:

- Producers
- Consumers
- Consumer groups
- Partitioning
- Event schemas
- Idempotency
- Retries
- Dead-letter topics
- Failure recovery
- Eventual consistency

---

# Phase 6 — Advanced Document Intelligence

Once the basic AI pipeline works, advanced capabilities will be introduced.

## Multi-document Q&A

Users can select multiple documents and ask:

```text
"Compare these two contracts."

"Find contradictions between these documents."

"Which documents mention Kubernetes?"

"Summarize all uploaded reports."
```

## Structured Extraction

For example, an uploaded invoice could produce:

```json
{
  "document_type": "invoice",
  "invoice_number": "INV-2026-1024",
  "supplier": "Example Oy",
  "date": "2026-09-20",
  "currency": "EUR",
  "subtotal": 4200,
  "vat": 1055,
  "total": 5255
}
```

Additional capabilities include:

- Document classification
- Invoice extraction
- Contract analysis
- Entity extraction
- Table extraction
- Chart understanding
- Image understanding
- Cross-document search
- Document comparison
- Automatic summaries

---

# Phase 7 — Security

Production-level authentication and authorization will be introduced.

```text
React
   │
   ▼
Login
   │
   ▼
JWT / OAuth2
   │
   ▼
Spring Security
   │
   ▼
Protected APIs
```

Possible roles:

```text
USER
ADMIN
```

Documents belong to individual users.

```text
User A
 ├── Document A1
 └── Document A2

User B
 ├── Document B1
 └── Document B2
```

Authorization rules must ensure that users cannot access another user's documents, chunks, conversations, or AI responses.

---

# Phase 8 — Kubernetes

Every application component will run as a Docker container.

## Docker Images

```text
document-analyzer-frontend

document-analyzer-api

document-service

document-ai-service
```

## Kubernetes Architecture

```text
                     Internet
                        │
                        ▼
                     Ingress
                        │
                        ▼
                  React Frontend
                        │
                        ▼
                Spring Boot API
                   /          \
                  /            \
                 ▼              ▼
        Go Document        Python AI
           Service           Service
                 \             /
                  \           /
                   ▼         ▼
                   PostgreSQL
                        │
                       Kafka
```

Kubernetes configuration:

```text
k8s/

├── namespace.yaml
│
├── frontend/
│   ├── deployment.yaml
│   └── service.yaml
│
├── api/
│   ├── deployment.yaml
│   └── service.yaml
│
├── document-service/
│
├── ai-service/
│
├── postgres/
│
├── kafka/
│
├── ingress/
│
├── configmaps/
│
└── secrets/
```

Additional Kubernetes concepts:

- Deployments
- Services
- ConfigMaps
- Secrets
- Ingress
- Persistent Volumes
- Liveness probes
- Readiness probes
- Resource limits
- Horizontal Pod Autoscaling
- Rolling deployments

---

# Phase 9 — Testing & Observability

## Python

```text
pytest
Integration tests
API tests
AI pipeline tests
```

## Go

```text
testing
httptest
Integration tests
```

## Spring Boot

```text
JUnit 5
Mockito
Spring Boot Test
Testcontainers
```

## React

```text
Vitest
React Testing Library
```

## End-to-End

```text
Playwright
```

---

# 📊 Observability

The production system will include:

```text
Prometheus
     │
     ▼
Application Metrics

Grafana
     │
     ▼
Dashboards

OpenTelemetry
     │
     ▼
Distributed Tracing

Centralized Logging
```

This allows a request to be traced across services:

```text
React
  │
  ▼
Spring Boot
  │
  ▼
Go
  │
  ▼
Kafka
  │
  ▼
Python AI
  │
  ▼
PostgreSQL
```

---

# Phase 10 — CI/CD & Production Deployment

The final phase introduces automated build, testing, and deployment.

Example pipeline:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Lint
   ├── Unit Tests
   ├── Integration Tests
   └── Security Checks
   │
   ▼
Build Docker Images
   │
   ▼
Container Registry
   │
   ▼
Kubernetes Deployment
   │
   ▼
Production
```

---

# 📁 Final Project Structure

```text
multimodal-document-analyzer/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── Dockerfile
│   └── package.json
│
├── services/
│
│   ├── api-gateway/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── pom.xml
│   │
│   ├── document-service/
│   │   ├── cmd/
│   │   ├── internal/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── go.mod
│   │
│   └── ai-service/
│       ├── app/
│       ├── tests/
│       ├── Dockerfile
│       └── requirements.txt
│
├── workers/
│   ├── document-processor/
│   └── embedding-worker/
│
├── database/
│   └── migrations/
│
├── kafka/
│   └── config/
│
├── k8s/
│
├── docker/
│
├── scripts/
│
├── tests/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── .env.example
├── Makefile
├── .gitignore
└── README.md
```

---

# 🗺 Development Order

The project should be developed incrementally.

### Phase 1 — MVP

```text
React + TypeScript
        ↓
FastAPI
        ↓
PostgreSQL
        ↓
PDF/Image Upload
        ↓
Text Extraction
        ↓
Basic Q&A
        ↓
Docker Compose
```

### Phase 2 — Multimodal AI

```text
OCR
 ↓
Image Understanding
 ↓
Table Extraction
 ↓
Structured Extraction
```

### Phase 3 — RAG

```text
Chunking
 ↓
Embeddings
 ↓
pgvector
 ↓
Semantic Search
 ↓
RAG
 ↓
Source Citations
```

### Phase 4 — Microservices

```text
Spring Boot
     +
Go Document Service
     +
Python AI Service
```

### Phase 5 — Event-Driven Architecture

```text
Kafka
 ↓
Async Processing
 ↓
Retries
 ↓
Dead Letter Topics
```

### Phase 6 — Advanced AI

```text
Multi-document RAG
Document Comparison
Summarization
Structured Extraction
Image Understanding
```

### Phase 7 — Security

```text
Spring Security
OAuth2
JWT
RBAC
Document Ownership
```

### Phase 8 — Kubernetes

```text
Docker Images
 ↓
Deployments
 ↓
Services
 ↓
Ingress
 ↓
Health Checks
 ↓
Autoscaling
```

### Phase 9 — Production Quality

```text
Unit Tests
Integration Tests
E2E Tests
Prometheus
Grafana
OpenTelemetry
```

### Phase 10 — Deployment

```text
GitHub Actions
 ↓
CI
 ↓
Docker Registry
 ↓
CD
 ↓
Kubernetes
 ↓
Production
```

---

# 🎓 Concepts Covered

Building this project provides hands-on experience with:

- Multimodal AI
- Large Language Models
- Retrieval-Augmented Generation
- Embeddings
- Vector databases
- Semantic search
- OCR
- Document processing
- Prompt engineering
- REST API design
- Microservices
- Event-driven architecture
- Apache Kafka
- PostgreSQL
- pgvector
- Go
- Java
- Spring Boot
- Python
- FastAPI
- React
- TypeScript
- Docker
- Docker Compose
- Kubernetes
- OAuth2
- JWT
- Distributed systems
- Observability
- Automated testing
- CI/CD

---

# 🔮 Future Improvements

Possible future features include:

- Drag-and-drop document upload
- Document folders/workspaces
- Streaming AI responses
- Chat history
- Hybrid keyword + vector search
- Reranking
- Document tags
- Automatic document classification
- Duplicate document detection
- Document versioning
- S3-compatible object storage
- Redis caching
- WebSocket processing updates
- Multi-tenant architecture
- Rate limiting
- AI usage tracking
- Cost monitoring
- Export analysis to PDF/JSON/CSV
- Additional LLM providers

---

# 📌 Development Philosophy

The project deliberately starts simple.

Instead of building Kafka, Kubernetes, Go, Spring Boot, Python, PostgreSQL, and multiple AI services immediately, the first objective is to create a **working end-to-end document analysis application**.

Once the MVP works, the architecture will gradually evolve:

```text
Working MVP
    ↓
Multimodal AI
    ↓
RAG
    ↓
Microservices
    ↓
Kafka
    ↓
Security
    ↓
Kubernetes
    ↓
Observability
    ↓
CI/CD
    ↓
Production System
```

This approach ensures that every development phase produces a working system while progressively introducing more advanced software engineering and AI concepts.

---

# 📄 License

This project is intended for educational, portfolio, and experimental purposes.

A license such as **MIT** can be added before public distribution.
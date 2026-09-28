# ResumeMatch AI — Phase 2

A full-stack Resume + Job Matching System built with FastAPI and Next.js. Phase 2 preserves the explainable keyword matcher from Phase 1 and adds structured LLM extraction, embedding-based semantic similarity, and grounded AI recommendations.

## Phase 1 feature:
- FastAPI backend — /api/analyze accepts a PDF/DOCX resume plus a job description.
- Resume parser — extract text from PDF using pypdf and DOCX using python-docx.
- Skill extractor — detect a curated set of technical skills in both texts.
- Matching engine — calculate a transparent keyword/skill match score and return matched + missing skills.
- Next.js + TypeScript UI — drag-and-drop resume upload, job-description textarea, Analyze button, and results dashboard.
- Docker — separate frontend/backend containers with docker-compose.yml.

## Phase 2 features

- Upload PDF or DOCX resumes (max 5 MB)
- Paste a job description
- Structured LLM extraction into typed Pydantic models
  - resume headline, skills, experience and education
  - job title, required/preferred skills, experience and responsibilities
- Deterministic required-skill coverage
- Embedding cosine similarity between resume and job description
- Weighted overall score: 65% structured skill coverage + 35% semantic similarity
- AI explanation, strengths, gaps and recommendations
- Guardrail prompt: never invent candidate experience
- Automatic Phase 1 fallback when no OpenAI API key is configured
- FastAPI + Next.js/TypeScript + Docker Compose
- Unit tests that run without an API key

## Architecture

```text
PDF/DOCX Resume ──> Text Parser ─────────────┐
                                              │
Job Description ──────────────────────────────┤
                                              v
                                  ┌──────────────────────┐
                                  │ Structured LLM      │
                                  │ Resume + Job models │
                                  └──────────┬───────────┘
                                             │
                       ┌─────────────────────┼─────────────────────┐
                       v                     v                     v
                Skill coverage        Embeddings / cosine    AI explanation
                       │                     │                 + recommendations
                       └──────────┬──────────┘
                                  v
                         Weighted match score
                         65% skills + 35% semantic
```

## Run with Docker

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Add your API key to `.env`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-luna
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

3. Start the app:

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- API docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

Without `OPENAI_API_KEY`, the application still runs and returns the Phase 1 deterministic analysis.

## Run locally

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## API

`POST /api/analyze` as `multipart/form-data`:

- `resume`: PDF or DOCX
- `job_description`: text

The response includes `overall_score`, `keyword_score`, `semantic_score`, matched/missing skills, structured profiles, explanation, strengths, gaps, and recommendations.

## Tests

```bash
cd backend
pytest -q
```

Tests deliberately do not require an OpenAI API key.

## Important scoring note

The overall percentage is a product heuristic, not a hiring probability. Semantic similarity measures textual/meaning similarity; it does not prove candidate qualification. Keep the component scores visible so users can understand why a result was produced.

## Phase 3 ideas

PostgreSQL persistence, authentication, analysis history, multiple resumes/jobs, saved reports, and background processing.

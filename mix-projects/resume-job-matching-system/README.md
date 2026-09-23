# Resume + Job Matching System — Phase 1 MVP

A deterministic full-stack MVP that compares a PDF/DOCX resume with a pasted job description. It extracts known technical skills, shows matched and missing skills, and calculates an explainable match score.

## Stack
- Backend: Python, FastAPI, pypdf, python-docx
- Frontend: Next.js, React, TypeScript
- Deployment: Docker + Docker Compose
- Tests: pytest

## Matching formula
`match_score = matched_job_skills / detected_job_skills * 100`

This Phase 1 score is intentionally deterministic. It does not claim semantic equivalence or infer experience that is not present in the resume.

## Run with Docker
Prerequisite: Docker Desktop / Docker Engine with Compose.

```bash
git clone <your-repository-url>
cd resume-job-matcher
docker compose up --build
```

Open:
- Frontend: `http://localhost:3000`
- API docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

Stop with:
```bash
docker compose down
```

## Run locally
### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Run tests:
```bash
cd backend
pytest -q
```

### Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

## API
`POST /api/analyze` using `multipart/form-data`:
- `resume`: PDF or DOCX, max 5 MB
- `job_description`: text

Example response:
```json
{
  "match_score": 75,
  "matched_skills": ["Java", "Spring Boot", "Docker"],
  "missing_skills": ["Kafka"],
  "resume_skills": ["Java", "Spring Boot", "Docker"],
  "job_skills": ["Java", "Spring Boot", "Docker", "Kafka"],
  "summary": "Matched 3 of 4 detected job skills."
}
```

## Project structure
```text
resume-job-matcher/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── parser.py
│   │   ├── matcher.py
│   │   └── skills.py
│   ├── tests/test_matcher.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Current limitations
- Scanned/image-only PDFs are not OCR'd.
- Skill detection uses a curated dictionary rather than an LLM.
- The score measures detected required-skill coverage only.
- No authentication or database in Phase 1.

## Phase 2 ideas
Add structured LLM extraction, semantic embeddings, experience/education analysis, richer recommendations, and safeguards that never recommend inventing skills or experience.

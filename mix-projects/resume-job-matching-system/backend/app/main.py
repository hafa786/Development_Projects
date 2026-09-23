from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from .parser import extract_text
from .matcher import analyze

app = FastAPI(title="Resume + Job Matcher API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/analyze")
async def analyze_resume(resume: UploadFile = File(...), job_description: str = Form(...)):
    if not job_description.strip():
        raise HTTPException(400, "Job description is required.")
    if not resume.filename:
        raise HTTPException(400, "Resume filename is missing.")
    content = await resume.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(413, "Resume must be 5 MB or smaller.")
    try:
        text = extract_text(resume.filename, content)
    except ValueError as exc:
        raise HTTPException(415, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(400, "Could not read the resume.") from exc
    if not text.strip():
        raise HTTPException(422, "No readable text found in the resume.")
    return analyze(text, job_description)

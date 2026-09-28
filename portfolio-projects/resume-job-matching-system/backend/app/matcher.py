import re
from .skills import SKILLS


def _contains(text: str, alias: str) -> bool:
    return re.search(r"(?<![A-Za-z0-9])" + re.escape(alias.lower()) + r"(?![A-Za-z0-9])", text.lower()) is not None


def extract_skills(text: str) -> list[str]:
    return [skill for skill, aliases in SKILLS.items() if any(_contains(text, a) for a in aliases)]


def analyze(resume_text: str, job_text: str) -> dict:
    resume = extract_skills(resume_text)
    job = extract_skills(job_text)
    matched = [s for s in job if s in resume]
    missing = [s for s in job if s not in resume]
    score = round(len(matched) / len(job) * 100) if job else 0
    return {
        "match_score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "resume_skills": resume,
        "job_skills": job,
        "summary": f"Matched {len(matched)} of {len(job)} detected job skills." if job else "No known skills were detected in the job description.",
    }

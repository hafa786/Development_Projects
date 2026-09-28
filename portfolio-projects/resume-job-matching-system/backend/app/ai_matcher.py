from .ai_service import AIService
from .matcher import analyze as deterministic_analyze


def _norm(value: str) -> str:
    return " ".join(value.lower().replace(".", " ").replace("-", " ").split())


def analyze_with_ai(resume_text: str, job_text: str) -> dict:
    baseline = deterministic_analyze(resume_text, job_text)
    ai = AIService()
    if not ai.enabled:
        return {
            **baseline,
            "ai_enabled": False,
            "semantic_score": None,
            "keyword_score": baseline["match_score"],
            "overall_score": baseline["match_score"],
            "ai_explanation": "AI features are disabled. Add OPENAI_API_KEY to enable structured extraction, embeddings and recommendations.",
            "strengths": [], "gaps": [], "recommendations": [],
            "resume_profile": None, "job_profile": None,
        }

    resume_profile = ai.extract_resume(resume_text)
    job_profile = ai.extract_job(job_text)
    semantic_score = ai.semantic_similarity(resume_text, job_text)

    resume_map = {_norm(s): s for s in resume_profile.skills}
    required = job_profile.required_skills or baseline["job_skills"]
    matched = [s for s in required if _norm(s) in resume_map]
    missing = [s for s in required if _norm(s) not in resume_map]
    keyword_score = round(len(matched) / len(required) * 100) if required else baseline["match_score"]
    overall_score = round(keyword_score * 0.65 + semantic_score * 0.35)
    advice = ai.advice(resume_profile, job_profile, matched, missing, semantic_score)

    return {
        "match_score": overall_score,
        "overall_score": overall_score,
        "keyword_score": keyword_score,
        "semantic_score": semantic_score,
        "matched_skills": matched,
        "missing_skills": missing,
        "resume_skills": resume_profile.skills,
        "job_skills": required,
        "summary": f"AI-enhanced score combines {keyword_score}% structured skill coverage with {semantic_score}% semantic similarity.",
        "ai_enabled": True,
        "ai_explanation": advice.explanation,
        "strengths": advice.strengths,
        "gaps": advice.gaps,
        "recommendations": advice.recommendations,
        "resume_profile": resume_profile.model_dump(),
        "job_profile": job_profile.model_dump(),
    }

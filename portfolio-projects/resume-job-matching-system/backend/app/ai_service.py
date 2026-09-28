import math
import os
from .ai_models import ResumeProfile, JobProfile, AIAdvice


class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.model = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")
        self.embedding_model = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
        if self.api_key:
            from openai import OpenAI
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None

    @property
    def enabled(self) -> bool:
        return self.client is not None

    def _parse(self, schema, system: str, text: str):
        response = self.client.responses.parse(
            model=self.model,
            input=[
                {"role": "system", "content": system},
                {"role": "user", "content": text[:30000]},
            ],
            text_format=schema,
        )
        return response.output_parsed

    def extract_resume(self, text: str) -> ResumeProfile:
        return self._parse(
            ResumeProfile,
            "Extract only facts explicitly supported by this resume. Do not infer missing skills or experience. Normalize technology names.",
            text,
        )

    def extract_job(self, text: str) -> JobProfile:
        return self._parse(
            JobProfile,
            "Extract the job requirements. Separate required from preferred skills. Do not invent requirements. Normalize technology names.",
            text,
        )

    def semantic_similarity(self, resume_text: str, job_text: str) -> float:
        result = self.client.embeddings.create(
            model=self.embedding_model,
            input=[resume_text[:20000], job_text[:20000]],
        )
        a, b = result.data[0].embedding, result.data[1].embedding
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        cosine = dot / (norm_a * norm_b) if norm_a and norm_b else 0.0
        # Convert cosine to a display-friendly bounded percentage.
        return round(max(0.0, min(1.0, cosine)) * 100, 1)

    def advice(self, resume: ResumeProfile, job: JobProfile, matched: list[str], missing: list[str], semantic_score: float) -> AIAdvice:
        evidence = f"""RESUME PROFILE:\n{resume.model_dump_json()}\n\nJOB PROFILE:\n{job.model_dump_json()}\n\nMATCHED SKILLS: {matched}\nMISSING SKILLS: {missing}\nSEMANTIC SCORE: {semantic_score}\n"""
        return self._parse(
            AIAdvice,
            "You are a resume matching analyst. Explain the evidence concisely. Never claim the candidate has a skill not present in the resume profile. Recommendations may suggest emphasizing existing evidence or learning missing skills, but never fabricating experience.",
            evidence,
        )

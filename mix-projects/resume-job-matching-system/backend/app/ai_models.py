from pydantic import BaseModel, Field


class ExperienceItem(BaseModel):
    title: str = ""
    company: str = ""
    years: float | None = None
    highlights: list[str] = Field(default_factory=list)


class ResumeProfile(BaseModel):
    headline: str = ""
    years_experience: float | None = None
    skills: list[str] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    education: list[str] = Field(default_factory=list)


class JobProfile(BaseModel):
    title: str = ""
    seniority: str = ""
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    minimum_years_experience: float | None = None
    responsibilities: list[str] = Field(default_factory=list)


class AIAdvice(BaseModel):
    explanation: str
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)

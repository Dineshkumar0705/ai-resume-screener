from pydantic import BaseModel, Field
from typing import List, Optional, Literal


# ======================================================
# REQUEST SCHEMAS
# ======================================================

class AnalyzeRequest(BaseModel):
    """
    Schema representing analysis input.
    NOTE:
    This is NOT used directly in /analyze because
    that endpoint uses multipart/form-data (PDF uploads).
    Kept for documentation & future JSON-based APIs.
    """
    job_description: str = Field(
        ...,
        min_length=10,
        description="Job description text provided by recruiter"
    )


# ======================================================
# CANDIDATE EVALUATION SCHEMA
# ======================================================

class CandidateEvaluation(BaseModel):
    candidate_name: str = Field(
        ...,
        description="Resume file name or candidate identifier"
    )

    final_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Final normalized match score (0–100)"
    )

    verdict: Literal[
        "Strong Match",
        "Moderate Match",
        "Weak Match",
        "Poor Match",
        "Needs Review"
    ] = Field(
        ...,
        description="Overall evaluation label"
    )

    strengths: List[str] = Field(
        default_factory=list,
        description="Matched skills, tools, or strengths"
    )

    gaps: List[str] = Field(
        default_factory=list,
        description="Missing or weak skills"
    )

    explanation: str = Field(
        ...,
        description="Recruiter-friendly explanation of the evaluation"
    )

    # 🔮 Optional future extensions (SAFE to ignore now)
    experience_match: Optional[bool] = Field(
        default=None,
        description="Whether experience requirements were satisfied"
    )

    project_relevance: Optional[str] = Field(
        default=None,
        description="High-level relevance of projects to the role"
    )


# ======================================================
# API RESPONSE SCHEMA
# ======================================================

class AnalyzeResponse(BaseModel):
    total_candidates: int = Field(
        ...,
        ge=0,
        description="Total number of resumes analyzed"
    )

    results: List[CandidateEvaluation] = Field(
        ...,
        description="List of evaluated candidates"
    )


# ======================================================
# ERROR RESPONSE SCHEMA
# ======================================================

class ErrorResponse(BaseModel):
    message: str = Field(
        ...,
        description="High-level error message"
    )

    detail: Optional[str] = Field(
        default=None,
        description="Optional detailed error explanation"
    )
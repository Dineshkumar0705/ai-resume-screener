from fastapi import APIRouter, UploadFile, File, Form
from typing import List

from app.services.resume_parser import extract_text_from_pdf
from app.services.llm_explainer import evaluate_candidate
from app.services.scoring_engine import calculate_final_score

router = APIRouter()


@router.post("/analyze")
async def analyze_resumes(
    job_description: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    """
    Analyze multiple resumes against a job description
    using Gemini LLM + deterministic scoring engine.
    """

    job_description = job_description.strip()
    results = []

    for resume in resumes:
        candidate_name = resume.filename or "Unknown Candidate"

        # ✅ FIX: pass UploadFile, not resume.file
        resume_text = extract_text_from_pdf(resume)

        # 🔒 Hard safety fallback
        if not resume_text or not resume_text.strip():
            results.append({
                "candidate_name": candidate_name,
                "final_score": 0,
                "verdict": "Poor Match",
                "strengths": [],
                "gaps": [],
                "explanation": "Resume text could not be extracted from the PDF."
            })
            continue

        # 2️⃣ LLM Evaluation (Gemini or fallback)
        gemini_result = evaluate_candidate(
            job_description=job_description,
            resume_text=resume_text
        )

        # 🔒 Normalize LLM output (VERY IMPORTANT)
        normalized_llm = {
            "match_score": int(
                max(0, min(100, gemini_result.get("match_score", 0)))
            ),
            "strengths": (
                gemini_result.get("strengths")
                if isinstance(gemini_result.get("strengths"), list)
                else []
            ),
            "gaps": (
                gemini_result.get("gaps")
                if isinstance(gemini_result.get("gaps"), list)
                else []
            ),
            "summary": (
                gemini_result.get("summary")
                if isinstance(gemini_result.get("summary"), str)
                else "LLM-based evaluation completed."
            )
        }

        # 3️⃣ Deterministic scoring engine (final authority)
        final_result = calculate_final_score(
            gemini_result=normalized_llm,
            resume_text=resume_text,
            job_description=job_description
        )

        # 🔒 Final response safety
        results.append({
            "candidate_name": candidate_name,
            "final_score": int(final_result.get("final_score", 0)),
            "verdict": final_result.get("verdict", "Needs Review"),
            "strengths": final_result.get("strengths", []),
            "gaps": final_result.get("gaps", []),
            "explanation": final_result.get(
                "explanation",
                "Candidate evaluated successfully."
            )
        })

    return {
        "total_candidates": len(resumes),
        "results": results
    }
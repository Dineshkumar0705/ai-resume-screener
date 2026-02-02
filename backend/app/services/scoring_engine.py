from typing import Dict, List


# -------------------------------
# Helper: clamp score to 0–100
# -------------------------------
def clamp_score(score: float) -> int:
    if score < 0:
        return 0
    if score > 100:
        return 100
    return int(score)


# -------------------------------
# Helper: confidence label
# -------------------------------
def confidence_label(score: int) -> str:
    if score >= 80:
        return "Strong Match"
    elif score >= 60:
        return "Moderate Match"
    elif score >= 40:
        return "Weak Match"
    else:
        return "Poor Match"


# -------------------------------
# Core Scoring Engine
# -------------------------------
def calculate_final_score(
    gemini_result: Dict,
    resume_text: str,
    job_description: str
) -> Dict:
    """
    Takes Gemini evaluation and produces a stable, explainable score
    """

    base_score = gemini_result.get("match_score", 0)
    strengths: List[str] = gemini_result.get("strengths", [])
    gaps: List[str] = gemini_result.get("gaps", [])

    # -------------------------------
    # Adjustments (transparent logic)
    # -------------------------------
    bonus = min(len(strengths) * 2, 10)      # max +10
    penalty = min(len(gaps) * 3, 15)         # max -15

    adjusted_score = base_score + bonus - penalty
    final_score = clamp_score(adjusted_score)

    verdict = confidence_label(final_score)

    return {
        "final_score": final_score,
        "verdict": verdict,
        "strengths": strengths,
        "gaps": gaps,
        "explanation": gemini_result.get(
            "summary",
            "Candidate evaluated based on resume and job description."
        )
    }
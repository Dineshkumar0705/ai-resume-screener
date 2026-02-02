import json
import os
import re
from typing import Dict, Set

# -------------------------------------------------
# Optional Gemini (safe)
# -------------------------------------------------
try:
    from google import genai
except ImportError:
    genai = None


# -------------------------------------------------
# Gemini Client (optional)
# -------------------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if genai and GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception:
        client = None


# -------------------------------------------------
# Skill & Model Dictionaries
# -------------------------------------------------
SKILLS: Set[str] = {
    "python", "java", "sql",
    "ai", "ml", "machine learning",
    "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn",
    "pandas", "numpy",
    "fastapi", "flask", "api", "rest",
    "docker", "aws", "git", "linux"
}

MODELS: Set[str] = {
    "cnn", "rnn", "lstm", "transformer",
    "bert", "gpt", "yolo", "resnet"
}

EXPERIENCE_WORDS: Set[str] = {
    "experience", "years", "worked", "company",
    "organization", "role", "intern", "internship"
}


# -------------------------------------------------
# Helper Functions
# -------------------------------------------------
def extract_terms(text: str, dictionary: Set[str]) -> Set[str]:
    text = text.lower()
    found = set()

    for term in dictionary:
        if term in text:
            found.add(term)

    return found


def jd_requires_experience(jd: str) -> bool:
    jd = jd.lower()
    return any(word in jd for word in ["experience", "years", "senior", "worked"])


def resume_has_experience(resume: str) -> bool:
    resume = resume.lower()
    return any(word in resume for word in EXPERIENCE_WORDS)


def extract_years(resume: str) -> int:
    matches = re.findall(r"(\d+)\s*\+?\s*year", resume.lower())
    return max(map(int, matches)) if matches else 0


# -------------------------------------------------
# ATS-Style Deterministic Evaluation
# -------------------------------------------------
def _fallback_evaluation(job_description: str, resume_text: str) -> Dict:
    jd_skills = extract_terms(job_description, SKILLS | MODELS)
    resume_skills = extract_terms(resume_text, SKILLS | MODELS)

    matched_skills = sorted(jd_skills & resume_skills)
    missing_skills = sorted(jd_skills - resume_skills)

    # ---------- EXPERIENCE GATE ----------
    if jd_requires_experience(job_description):
        if not resume_has_experience(resume_text):
            return {
                "match_score": 0,
                "strengths": [],
                "gaps": list(jd_skills),
                "summary": (
                    "Candidate does not meet the required experience criteria "
                    "mentioned in the job description."
                )
            }

    # ---------- SKILL SCORE ----------
    skill_score = (
        int(len(matched_skills) / len(jd_skills) * 100)
        if jd_skills else 0
    )

    # ---------- PROJECT SCORE (implicit via tools/models) ----------
    project_score = 20 if resume_skills else 0

    # ---------- EXPERIENCE DEPTH ----------
    years = extract_years(resume_text)
    if jd_requires_experience(job_description):
        if years >= 3:
            exp_score = 25
        elif years >= 1:
            exp_score = 15
        else:
            exp_score = 5
    else:
        exp_score = 5 if resume_has_experience(resume_text) else 0

    # ---------- FINAL SCORE ----------
    final_score = min(skill_score * 0.5 + project_score + exp_score, 100)
    final_score = int(final_score)

    # ---------- FINAL SUMMARY ----------
    if final_score >= 70:
        verdict = "Suitable candidate with minor improvements required."
    elif final_score >= 40:
        verdict = "Partially suitable but requires skill and project improvement."
    else:
        verdict = "Currently not suitable for this role."

    summary = (
        f"{verdict} "
        f"Matched skills: {', '.join(matched_skills) or 'None'}. "
        f"Missing skills: {', '.join(missing_skills) or 'None'}."
    )

    return {
        "match_score": final_score,
        "strengths": matched_skills,
        "gaps": missing_skills,
        "summary": summary
    }


# -------------------------------------------------
# Main API Function
# -------------------------------------------------
def evaluate_candidate(job_description: str, resume_text: str) -> Dict:
    """
    Experience-first → skills → projects → years → explanation.
    Gemini optional, deterministic always works.
    """

    # Gemini can be plugged later — deterministic is default
    return _fallback_evaluation(job_description, resume_text)
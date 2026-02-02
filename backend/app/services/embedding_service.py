import os
from typing import List
import numpy as np

# ---------------------------------------------
# Optional Gemini Import (SAFE)
# ---------------------------------------------
try:
    import google.generativeai as genai
except ImportError:
    genai = None


# ---------------------------------------------
# Gemini Embedding Configuration
# ---------------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL = "models/embedding-001"

client_ready = False

if genai and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        client_ready = True
    except Exception as e:
        print("[Embedding] Gemini config failed:", e)
        client_ready = False


# ---------------------------------------------
# Generate embedding for text (SAFE)
# ---------------------------------------------
def get_embedding(text: str) -> List[float]:
    """
    Convert text into embedding using Gemini.
    NEVER crashes – returns empty list on failure.
    """

    if not client_ready:
        return []

    if not text or not text.strip():
        return []

    try:
        response = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="semantic_similarity"
        )

        embedding = response.get("embedding", [])
        return embedding if isinstance(embedding, list) else []

    except Exception as e:
        print("[Embedding] Failed to generate embedding:", e)
        return []


# ---------------------------------------------
# Cosine similarity (SAFE)
# ---------------------------------------------
def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Compute cosine similarity safely.
    Returns value between 0.0 and 1.0
    """

    if not vec1 or not vec2:
        return 0.0

    try:
        v1 = np.array(vec1, dtype=float)
        v2 = np.array(vec2, dtype=float)

        denom = np.linalg.norm(v1) * np.linalg.norm(v2)
        if denom == 0:
            return 0.0

        return float(np.dot(v1, v2) / denom)

    except Exception as e:
        print("[Embedding] Cosine similarity error:", e)
        return 0.0


# ---------------------------------------------
# Resume vs JD similarity score (0–100)
# ---------------------------------------------
def resume_jd_similarity_score(
    resume_text: str,
    job_description: str
) -> int:
    """
    Semantic similarity score using embeddings.
    SAFE fallback → returns 0 if embedding unavailable.
    """

    resume_embedding = get_embedding(resume_text)
    jd_embedding = get_embedding(job_description)

    similarity = cosine_similarity(resume_embedding, jd_embedding)

    score = int(similarity * 100)
    return max(0, min(score, 100))
import os
import shutil
import uuid
from fastapi import UploadFile
from typing import Optional

# ===============================
# Base upload directory
# ===============================
UPLOAD_DIR = "tmp/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ===============================
# Save uploaded file safely
# ===============================
def save_upload_file(upload_file: UploadFile) -> Optional[str]:
    """
    Save an uploaded file to disk safely and return file path.
    Returns None if file is invalid.
    """

    if not upload_file or not upload_file.filename:
        return None

    # Only allow PDFs (basic safety)
    if not upload_file.filename.lower().endswith(".pdf"):
        return None

    unique_name = f"{uuid.uuid4().hex}_{upload_file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)

        return file_path

    except Exception as e:
        print(f"[File Save Error] {e}")
        return None


# ===============================
# Cleanup temp file
# ===============================
def delete_file(file_path: str) -> None:
    """
    Delete a temporary file if it exists.
    """
    try:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"[File Delete Error] {e}")
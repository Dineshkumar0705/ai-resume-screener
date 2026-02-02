import pdfplumber
from typing import Optional
from fastapi import UploadFile

from app.utils.file_handler import save_upload_file, delete_file


def extract_text_from_pdf(upload_file: UploadFile) -> Optional[str]:
    """
    Extract text from an uploaded PDF resume safely.

    Flow:
    UploadFile -> temp file -> pdfplumber -> text -> cleanup

    Returns:
    - Extracted text (str) if successful
    - None if extraction fails
    """

    # ---------------------------
    # Save PDF temporarily
    # ---------------------------
    file_path = save_upload_file(upload_file)

    if not file_path:
        print("[Resume Parser] Invalid or unsupported file")
        return None

    text_chunks = []

    try:
        with pdfplumber.open(file_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text_chunks.append(page_text)
                except Exception as e:
                    print(
                        f"[Resume Parser] Failed reading page {page_num}: {e}"
                    )

        full_text = "\n".join(text_chunks).strip()

        if not full_text:
            print("[Resume Parser] PDF parsed but no text found")
            return None

        return full_text

    except Exception as e:
        print(f"[Resume Parser] PDF parsing error: {e}")
        return None

    finally:
        # ---------------------------
        # Always cleanup temp file
        # ---------------------------
        delete_file(file_path)
from functools import lru_cache
from typing import List, Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ===============================
    # APP SETTINGS
    # ===============================
    APP_NAME: str = Field(
        default="AI Resume Screener",
        description="Application name"
    )
    APP_ENV: str = Field(
        default="development",
        description="Environment: development | production"
    )
    DEBUG: bool = Field(
        default=True,
        description="Enable debug mode"
    )

    # ===============================
    # SERVER
    # ===============================
    HOST: str = Field(default="127.0.0.1")
    PORT: int = Field(default=8000)

    # ===============================
    # CORS (Frontend Integration)
    # ===============================
    CORS_ORIGINS: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        description="Allowed frontend origins"
    )

    # ===============================
    # GEMINI / LLM
    # ===============================
    GEMINI_API_KEY: Optional[str] = Field(
        default=None,
        description="Google Gemini API key"
    )

    # ===============================
    # FILE UPLOAD LIMITS
    # ===============================
    MAX_FILE_SIZE_MB: int = Field(default=5)
    ALLOWED_RESUME_TYPES: List[str] = Field(
        default_factory=lambda: ["application/pdf"]
    )

    # ===============================
    # SCORING ENGINE
    # ===============================
    STRONG_MATCH_THRESHOLD: int = Field(default=70)
    MODERATE_MATCH_THRESHOLD: int = Field(default=40)

    # ===============================
    # PYDANTIC v2 CONFIG
    # ===============================
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


# ===============================
# Singleton Settings Loader
# ===============================
@lru_cache
def get_settings() -> Settings:
    """
    Cached settings object.
    Safe to import anywhere in the app.
    """
    return Settings()
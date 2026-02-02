from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import get_settings

# ===============================
# Load settings (Singleton)
# ===============================
settings = get_settings()

# ===============================
# FastAPI App
# ===============================
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered resume screening system for recruiters",
    version="1.0.0",
    debug=settings.DEBUG,
)

# ===============================
# CORS (Frontend Integration)
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# API Routes
# ===============================
app.include_router(
    router,
    tags=["Resume Analysis"]
)

# ===============================
# Health Check
# ===============================
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "Backend running successfully 🚀",
        "app": settings.APP_NAME,
        "env": settings.APP_ENV,
    }
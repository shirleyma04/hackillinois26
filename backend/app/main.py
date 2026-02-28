# SHARED - Main FastAPI application

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import transform

app = FastAPI(
    title="Crash Out - Message Transformer API",
    description="Transform angry messages with AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    transform.router,
    prefix="/api/transform",
    tags=["text-transformation"]
)

# VOICE team will add routers here:
# from app.routers import tts, music
# app.include_router(tts.router, prefix="/api/tts", tags=["voice"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Crash Out API is running!",
        "status": "healthy",
        "your_endpoint": "/api/transform"
    }

# SHARED - Main FastAPI application

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import transform, tts, voices, music
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Crash Out",
    description="Transform angry messages with AI",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve built frontend (commented out - only needed for production)
# frontend_path = os.path.join(os.path.dirname(__file__), "static")
# app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")


# TEXT backend
app.include_router(
    transform.router,
    prefix="/api/transform",
    tags=["text-transformation"]
)

# VOICE backend
app.include_router(tts.router, tags=["voice"])
app.include_router(voices.router, tags=["voice"])
app.include_router(music.router, tags=["voice"])

app.mount("/tts_output", StaticFiles(directory="app/tts_output"), name="tts_output")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Crash Out API is running!",
        "status": "healthy",
        "endpoints": {
            "text": "/api/transform",
            "voice": "/api/tts"
        }
    }

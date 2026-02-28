# SHARED - Main FastAPI application entry point

# main.py
from fastapi import FastAPI
from app.routers import tts,voices,music

app = FastAPI(title="ElevenLabs API")

# Include the TTS router
app.include_router(tts.router)
app.include_router(voices.router)
app.include_router(music.router)

# Simple root endpoint
@app.get("/")
async def root():
    return {"message": "TTS API is running!"}
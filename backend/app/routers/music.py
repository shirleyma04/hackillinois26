# routers/music.py

from fastapi import APIRouter
from app.models.schemas import MusicRequest, MusicResponse
from app.services.elevenlabs_service import (
    create_composition_plan,
    generate_music_from_plan,
)
import uuid
import os

router = APIRouter(prefix="/music", tags=["Music"])

OUTPUT_DIR = "app/generated_music"
os.makedirs(OUTPUT_DIR, exist_ok=True)


@router.post("/generate", response_model=MusicResponse)
def generate_music(request: MusicRequest):
    """
    Generate music using ElevenLabs composition plan.
    """

    # 1️⃣ Create composition plan
    plan = create_composition_plan(
        prompt=request.prompt,
        duration_ms=request.duration_ms,
    )

    # 2️⃣ Generate music from plan
    audio_bytes = generate_music_from_plan(plan)

    # 3️⃣ Save file
    filename = f"{uuid.uuid4()}.mp3"
    file_path = os.path.join(OUTPUT_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(audio_bytes)

    return {"file_path": file_path}
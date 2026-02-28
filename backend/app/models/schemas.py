# app/models/schemas.py

from pydantic import BaseModel, Field
from typing import Union, List, Literal


# =========================
# TTS MODELS
# =========================

class TTSRequest(BaseModel):
    text: Union[str, List[str]]  # single string or list of paragraphs
    voice_id: str = "JBFqnCBsd6RMkjVDRZzb"
    model_id: str = "eleven_multilingual_v2"
    output_format: str = "mp3_44100_128"


class TTSResponse(BaseModel):
    file_path: str


# =========================
# TRANSFORM MODELS
# =========================

class TransformRequest(BaseModel):
    message: str
    angry_at: Literal["partner", "family", "friend", "coworker", "stranger"]
    tone: Literal["professional", "intimidating", "shakespearean", "condescending", "disappointed"]
    kindness_scale: int = Field(ge=1, le=5)
    format: Literal["email", "text", "social_media", "review", "custom"]
    profanity_check: Literal["check", "censored", "none"] = "check"


class TransformResponse(BaseModel):
    original_message: str
    transformed_message: str
    profanity_detected: bool = False
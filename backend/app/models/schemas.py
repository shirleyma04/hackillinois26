# app/models/schemas.py

from pydantic import BaseModel, Field
from typing import Union, List, Literal, Optional


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
#   VOICE SEARCH MODELS
# =========================

class VoiceSearchRequest(BaseModel):
    page_size: int = Field(default=10, le=100)
    page: int = 0

    category: Optional[Literal["professional", "famous", "high_quality"]] = None
    gender: Optional[str] = None
    age: Optional[str] = None
    accent: Optional[str] = None
    language: Optional[str] = None
    locale: Optional[str] = None
    search: Optional[str] = None
    use_cases: Optional[str] = None
    descriptives: Optional[str] = None

    featured: bool = False
    min_notice_period_days: Optional[int] = None
    include_custom_rates: bool = True
    include_live_moderated: bool = True
    reader_app_enabled: bool = False
    owner_id: Optional[str] = None
    sort: Optional[str] = None

class Voice(BaseModel):
    voice_id: str
    name: str
    gender: Optional[str]
    accent: Optional[str]
    age: Optional[str]
    category: Optional[str]
    language: Optional[str]
    description: Optional[str]
    preview_url: Optional[str]
    featured: Optional[bool]


class VoiceSearchResponse(BaseModel):
    voices: List[Voice]
    has_more: bool
    page: int


# =========================
# VOICE CLONING MODELS
# =========================

class VoiceCloneRequest(BaseModel):
    name: str
    file_paths: List[str]  # paths to audio files on server

class VoiceCloneResponse(BaseModel):
    voice_id: str
    name: str


# =========================
# VOICE DESIGN MODELS
# =========================

class VoiceDesignRequest(BaseModel):
    voice_description: str
    text: str
    model_id: str = "eleven_multilingual_ttv_v2"


class VoicePreview(BaseModel):
    generated_voice_id: str
    audio_base64: str  # returned for preview playback


class VoiceDesignResponse(BaseModel):
    previews: List[VoicePreview]


class VoiceCreateFromPreviewRequest(BaseModel):
    voice_name: str
    voice_description: str
    generated_voice_id: str


class VoiceCreateResponse(BaseModel):
    voice_id: str
    name: str

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
# SHARED - Pydantic models for request/response
from pydantic import BaseModel, Field
from typing import Literal, Optional

class TransformRequest(BaseModel):
    message: str
    angry_at: Literal["partner", "family", "friend", "coworker", "stranger"]
    tone: Literal["professional", "intimidating", "shakespearean", "condescending", "disappointed"]
    kindness_scale: int = Field(ge=1, le=5)
    format: Literal["email", "text", "social_media", "review", "custom"]
    profanity_check: Literal["censored", "none"] = "censored"

class TransformResponse(BaseModel):
    original_message: str
    transformed_message: str
    profanity_detected: bool = False
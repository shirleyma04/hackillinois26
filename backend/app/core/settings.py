# SHARED - Environment settings (API keys, etc.)

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # TEXT team - OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4-turbo"

    # VOICE team - ElevenLabs
    elevenlabs_api_key: Optional[str] = None

    # General
    environment: str = "development"
    debug: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False

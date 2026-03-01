# SHARED - Application configuration
  from app.core.settings import Settings
  from pydantic_settings import BaseSettings, SettingsConfigDict


  # Create single instance of settings
  # settings = Settings()

  class Settings(BaseSettings):
      openai_api_key: str
      elevenlabs_api_key: str
      openai_model: str

      model_config = SettingsConfigDict(
          env_file=".env",
          env_file_encoding="utf-8",
          extra="ignore"
      )

  settings = Settings()

  # Configuration constants
  MAX_MESSAGE_LENGTH = 5000
  ALLOWED_MESSAGE_FORMATS = ["email", "text", "social_media", "review"]
  ALLOWED_TONES = ["professional", "intimidating", "shakespearean", "condescending", "disappointed"]
  KINDNESS_SCALE_MIN = 1
  KINDNESS_SCALE_MAX = 5


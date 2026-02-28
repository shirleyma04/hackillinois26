# SHARED - Application configuration

from app.core.settings import Settings

# Create single instance of settings
settings = Settings()

# Configuration constants
MAX_MESSAGE_LENGTH = 5000
ALLOWED_MESSAGE_FORMATS = ["email", "text", "social_media", "review"]
ALLOWED_TONES = ["professional", "intimidating", "shakespearean", "condescending", "disappointed"]
KINDNESS_SCALE_MIN = 1
KINDNESS_SCALE_MAX = 5

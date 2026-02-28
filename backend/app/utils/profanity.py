# SHARED - Profanity detection utilities

from better_profanity import profanity

profanity.load_censor_words()

def check_profanity(text: str) -> bool:
    """Check if text contains profanity."""
    return profanity.contains_profanity(text)

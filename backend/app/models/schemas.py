# app/models/schemas.py
from typing import Union, List
from pydantic import BaseModel

# Request model for TTS
class TTSRequest(BaseModel):
    text: Union[str, List[str]]  # single string or list of paragraphs
    voice_id: str = "JBFqnCBsd6RMkjVDRZzb"           # default voice
    model_id: str = "eleven_multilingual_v2"         # default model
    output_format: str = "mp3_44100_128"             # default format

# Response model for TTS
class TTSResponse(BaseModel):
    file_path: str
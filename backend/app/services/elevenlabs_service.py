# app/services/elevenlabs_service.py
import os
import uuid
from io import BytesIO
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings
from typing import Optional
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

# Initialize ElevenLabs client
elevenlabs = ElevenLabs(api_key=ELEVENLABS_API_KEY)


def stitched_tts(
        paragraphs: list[str], 
        voice_id: str, 
        model_id: str = "eleven_multilingual_v2",
        output_format: str = "mp3_44100_128", 
        voice_settings: Optional[VoiceSettings] = None
    ) -> str:
    """
    Generate a stitched TTS audio file from multiple paragraphs.
    Maintains prosody across paragraphs using request stitching.

    Args:
        paragraphs (list[str]): List of text paragraphs to convert
        voice_id (str): ElevenLabs voice ID
        model_id (str, optional): Model to use. Defaults to "eleven_multilingual_v2".
        output_format (str, optional): Output audio format. Defaults to "mp3_44100_128".
        voice_settings (VoiceSettings | None, optional): Optional voice customization.

    Returns:
        str: Path to the generated MP3 file in app/output/
    """
    if voice_settings is None:
        voice_settings = VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
            speed=1.0,
        )

    request_ids = []
    audio_buffers = []

    for paragraph in paragraphs:
        # Use request stitching to maintain prosody across chunks
        with elevenlabs.text_to_speech.with_raw_response.convert(
            text=paragraph,
            voice_id=voice_id,
            model_id=model_id,
            previous_request_ids=request_ids,
            voice_settings=voice_settings
        ) as response:
            # Save the request ID for stitching
            request_ids.append(response._response.headers.get("request-id"))

            # Combine all chunks from this paragraph
            audio_data = b''.join(chunk for chunk in response.data if chunk)
            audio_buffers.append(BytesIO(audio_data))

    # Combine all paragraph buffers into one audio stream
    combined_stream = BytesIO(b''.join(buffer.getvalue() for buffer in audio_buffers))

    # Generate a unique filename and save it to app/output/
    os.makedirs("app/output", exist_ok=True)
    save_file_path = f"app/output/{uuid.uuid4()}.mp3"
    with open(save_file_path, "wb") as f:
        f.write(combined_stream.getbuffer())

    print(f"{save_file_path}: Stitched audio file generated successfully!")
    return save_file_path
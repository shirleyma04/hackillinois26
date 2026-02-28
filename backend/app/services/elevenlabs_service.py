# app/services/elevenlabs_service.py
import os
import uuid
from io import BytesIO
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from app.models.schemas import VoiceSearchRequest
import requests
import base64

# Load API key from .env
load_dotenv()
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
BASE_URL = "https://api.elevenlabs.io/v1/shared-voices"

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

def search_shared_voices(params: VoiceSearchRequest) -> Dict[str, Any]:
    """
    Calls ElevenLabs shared voices API and returns results.
    """

    query_params = {k: v for k, v in params.dict().items() if v is not None}

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }

    response = requests.get(BASE_URL, headers=headers, params=query_params)

    if response.status_code != 200:
        raise Exception(f"Voice search failed: {response.text}")

    return response.json()

def clone_voice(name: str, file_paths: list[str]) -> Dict[str, Any]:
    """
    Create an Instant Voice Clone using ElevenLabs API.

    Args:
        name: Name for the cloned voice
        file_paths: List of local audio file paths

    Returns:
        Dict containing voice_id and metadata
    """
    try:
        audio_files = []

        for path in file_paths:
            with open(path, "rb") as f:
                audio_files.append(BytesIO(f.read()))

        voice = elevenlabs.voices.ivc.create(
            name=name,
            files=audio_files
        )

        return {
            "voice_id": voice.voice_id,
            "name": name
        }

    except Exception as e:
        raise Exception(f"Voice cloning failed: {str(e)}")
    
def design_voice(
    voice_description: str,
    text: str,
    model_id: str = "eleven_multilingual_ttv_v2"
) -> Dict[str, Any]:
    """
    Generate voice previews from a text prompt.
    """
    try:
        result = elevenlabs.text_to_voice.design(
            model_id=model_id,
            voice_description=voice_description,
            text=text,
        )

        previews = [
            {
                "generated_voice_id": preview.generated_voice_id,
                "audio_base64": preview.audio_base_64,
            }
            for preview in result.previews
        ]

        return {"previews": previews}

    except Exception as e:
        raise Exception(f"Voice design failed: {str(e)}")


def create_voice_from_preview(
    voice_name: str,
    voice_description: str,
    generated_voice_id: str,
) -> Dict[str, Any]:
    """
    Create a new voice from a generated preview.
    """
    try:
        voice = elevenlabs.text_to_voice.create(
            voice_name=voice_name,
            voice_description=voice_description,
            generated_voice_id=generated_voice_id,
        )

        return {
            "voice_id": voice.voice_id,
            "name": voice_name,
        }

    except Exception as e:
        raise Exception(f"Voice creation failed: {str(e)}")

def create_composition_plan(prompt: str, duration_ms: int = 10000):
    """
    Generate a composition plan from a prompt.
    """
    plan = elevenlabs.music.composition_plan.create(
        prompt=prompt,
        music_length_ms=duration_ms,
    )
    return plan


def generate_music_from_plan(composition_plan):
    """
    Generate music audio bytes from a composition plan.
    """
    audio_stream = elevenlabs.music.compose(
        composition_plan=composition_plan,
    )

    audio_bytes = b"".join(audio_stream)
    return audio_bytes
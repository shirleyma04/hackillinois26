from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    VoiceSearchRequest, 
    VoiceSearchResponse, 
    Voice, 
    VoiceCloneRequest, 
    VoiceCloneResponse,
    VoiceDesignRequest,
    VoiceDesignResponse,
    VoiceCreateFromPreviewRequest,
    VoiceCreateResponse
)
from app.services.elevenlabs_service import (
    search_shared_voices, 
    clone_voice,
    design_voice,
    create_voice_from_preview
)

router = APIRouter(prefix="/voices", tags=["Voices"])


@router.post("/search", response_model=VoiceSearchResponse)
async def search_voices(request: VoiceSearchRequest):
    """
    Search shared voices from ElevenLabs.
    Returns 10 voices per request by default.
    """
    try:
        data = search_shared_voices(request)

        voices = [
            Voice(
                voice_id=v["voice_id"],
                name=v["name"],
                gender=v.get("gender"),
                accent=v.get("accent"),
                age=v.get("age"),
                category=v.get("category"),
                language=v.get("language"),
                description=v.get("description"),
                preview_url=v.get("preview_url"),
                featured=v.get("featured"),
            )
            for v in data.get("voices", [])
        ]

        return VoiceSearchResponse(
            voices=voices,
            has_more=data.get("has_more", False),
            page=request.page,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/clone", response_model=VoiceCloneResponse)
async def clone_voice_endpoint(request: VoiceCloneRequest):
    """
    Clone a voice using provided audio samples.
    """
    try:
        result = clone_voice(
            name=request.name,
            file_paths=request.file_paths
        )
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/design", response_model=VoiceDesignResponse)
async def design_voice_endpoint(request: VoiceDesignRequest):
    """
    Generate voice previews from a description prompt.
    """
    try:
        result = design_voice(
            voice_description=request.voice_description,
            text=request.text,
            model_id=request.model_id,
        )
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/design/create", response_model=VoiceCreateResponse)
async def create_voice_from_preview_endpoint(request: VoiceCreateFromPreviewRequest):
    """
    Create a permanent voice from a selected preview.
    """
    try:
        result = create_voice_from_preview(
            voice_name=request.voice_name,
            voice_description=request.voice_description,
            generated_voice_id=request.generated_voice_id,
        )
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
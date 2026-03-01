import os, uuid
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Optional
from io import BytesIO
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
    create_voice_from_preview,
)

router = APIRouter(prefix="/voices", tags=["Voices"])

UPLOAD_DIR = "app/tmp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
    
# @router.post("/clone", response_model=VoiceCloneResponse)
# async def clone_voice_endpoint(request: VoiceCloneRequest):
#     """
#     Clone a voice using provided audio samples.
#     """
#     try:
#         result = clone_voice(
#             name=request.name,
#             file_paths=request.file_paths
#         )
#         return result

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@router.post("/clone")
async def clone_voice_endpoint(
    name: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    file_paths: Optional[List[str]] = Form(None),
):
    """
    Clone voice from uploaded files OR file paths.
    """

    try:
        paths = []

        # ✅ Case 1: files uploaded from frontend
        if files:
            for file in files:
                ext = file.filename.split(".")[-1]
                temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.{ext}")

                with open(temp_path, "wb") as f:
                    f.write(await file.read())

                paths.append(temp_path)

        # ✅ Case 2: file paths (existing behavior)
        elif file_paths:
            paths = file_paths

        else:
            raise HTTPException(status_code=400, detail="No audio provided")

        # ✅ Call your service
        result = clone_voice(name=name, file_paths=paths)

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
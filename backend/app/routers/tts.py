# app/routers/tts.py
from fastapi import APIRouter, HTTPException
from app.models.schemas import TTSRequest, TTSResponse
from app.services.elevenlabs_service import stitched_tts

router = APIRouter(prefix="/tts", tags=["Text-to-Speech"])

# @router.post("/", response_model=TTSResponse)
# async def create_tts(request: TTSRequest):
#     """
#     Generate stitched TTS from multiple paragraphs and save audio to a file.
#     """
#     try:
#         # Accept both single string or list of paragraphs
#         paragraphs = request.text if isinstance(request.text, list) else [request.text]
#         output_file = stitched_tts(
#             paragraphs,
#             voice_id=request.voice_id,
#             model_id=request.model_id,
#             output_format=request.output_format
#         )
#         return TTSResponse(file_path=f"tts_output/{output_file_name}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=TTSResponse)
async def create_tts(request: TTSRequest):
    try:
        paragraphs = request.text if isinstance(request.text, list) else [request.text]

        output_file = stitched_tts(
            paragraphs,
            voice_id=request.voice_id,
            model_id=request.model_id,
            output_format=request.output_format
        )

        print("DEBUG output_file:", output_file)

        if not output_file:
            raise HTTPException(status_code=500, detail="No file returned from TTS")

        # extract filename only
        import os
        filename = os.path.basename(output_file)

        return TTSResponse(file_path=f"tts_output/{filename}")

    except Exception as e:
        print("TTS ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
# TEXT - Text transformation endpoint

from fastapi import APIRouter, HTTPException
from app.models.schemas import TransformRequest, TransformResponse
from app.services.openai_service import OpenAIService
from app.utils.profanity import check_profanity

router = APIRouter()
openai_service = OpenAIService()

@router.post("/", response_model=TransformResponse)
async def transform_message(request: TransformRequest):
    """Transform an angry message based on user preferences."""
    try:
        profanity_detected = check_profanity(request.message)

        transformed = await openai_service.transform_message(
            message=request.message,
            angry_at=request.angry_at,
            format=request.format,
            tone=request.tone,
            kindness_scale=request.kindness_scale,
            profanity_check=request.profanity_check
        )

        return TransformResponse(
            original_message=request.message,
            transformed_message=transformed,
            profanity_detected=profanity_detected
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Transformation failed: {str(e)}"
        )

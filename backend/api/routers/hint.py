from fastapi import APIRouter, HTTPException
from api.models import HintRequest, HintResponse
from api.services.game_service import GameService
from api.services.session_service import SessionService

router = APIRouter()
session_service = SessionService()
game_service = GameService(session_service)

@router.post("/hint", response_model=HintResponse)
async def get_hint(request: HintRequest):
    """Get AI-powered hint for current level"""
    try:
        # Validate request
        if not request.session_id:
            raise HTTPException(status_code=400, detail="Session ID is required")
        
        if request.level not in [1, 2]:
            raise HTTPException(status_code=400, detail="Level must be 1 or 2")
        
        if request.objective not in [1, 2]:
            raise HTTPException(status_code=400, detail="Objective must be 1 or 2")
        
        # Get hint through game service
        response = await game_service.get_hint(
            session_id=request.session_id,
            level=request.level,
            objective=request.objective,
            code=request.code
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
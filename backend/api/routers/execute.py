from fastapi import APIRouter, HTTPException
from api.models import ExecuteRequest, ExecuteResponse
from api.services.game_service import GameService
from api.services.session_service import SessionService

router = APIRouter()
session_service = SessionService()
game_service = GameService(session_service)

@router.post("/execute", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest):
    """Execute user code and provide feedback"""
    try:
        # Validate request
        if not request.session_id:
            raise HTTPException(status_code=400, detail="Session ID is required")
        
        if request.level not in [1, 2]:
            raise HTTPException(status_code=400, detail="Level must be 1 or 2")
        
        if request.objective not in [1, 2]:
            raise HTTPException(status_code=400, detail="Objective must be 1 or 2")
        
        if not request.code or len(request.code) == 0:
            raise HTTPException(status_code=400, detail="Code is required")
        
        if request.lives < 0:
            raise HTTPException(status_code=400, detail="Lives cannot be negative")
        
        # Execute code through game service
        response = await game_service.execute_code(
            session_id=request.session_id,
            level=request.level,
            objective=request.objective,
            code=request.code,
            lives=request.lives
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
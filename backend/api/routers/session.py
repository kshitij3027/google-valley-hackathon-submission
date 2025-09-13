from fastapi import APIRouter, HTTPException
from api.models import SessionStartResponse
from api.services.session_service import SessionService

router = APIRouter()
session_service = SessionService()

@router.post("/session/start", response_model=SessionStartResponse)
async def start_session():
    """Initialize new game session"""
    try:
        session = session_service.create_session()
        return SessionStartResponse(
            session_id=session.session_id,
            level=session.current_level,
            objective=session.current_objective,
            lives=session.lives_remaining
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@router.post("/session/reset")
async def reset_session(session_id: str):
    """Reset current session progress"""
    try:
        session = session_service.reset_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {
            "success": True,
            "message": "Session reset successfully",
            "session_id": session.session_id,
            "level": session.current_level,
            "objective": session.current_objective,
            "lives": session.lives_remaining
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset session: {str(e)}")

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get session details"""
    try:
        session = session_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {
            "session_id": session.session_id,
            "current_level": session.current_level,
            "current_objective": session.current_objective,
            "lives_remaining": session.lives_remaining,
            "status": session.status,
            "created_at": session.created_at,
            "updated_at": session.updated_at,
            "attempts_count": len(session.attempts)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get session: {str(e)}")
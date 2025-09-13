import uuid
from datetime import datetime
from typing import Dict, Optional
from api.models import GameSession, GameAttempt

class SessionService:
    """Service for managing game sessions with in-memory storage"""
    
    def __init__(self):
        self._sessions: Dict[str, GameSession] = {}
        self._initialize_test_sessions()
    
    def create_session(self) -> GameSession:
        """Create a new game session"""
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        session = GameSession(
            session_id=session_id,
            current_level=1,
            current_objective=1,
            lives_remaining=3,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            status="active",
            attempts=[]
        )
        self._sessions[session_id] = session
        return session
    
    def get_session(self, session_id: str) -> Optional[GameSession]:
        """Get a session by ID"""
        return self._sessions.get(session_id)
    
    def update_session(self, session_id: str, **kwargs) -> Optional[GameSession]:
        """Update session properties"""
        session = self._sessions.get(session_id)
        if not session:
            return None
        
        # Update allowed fields
        for key, value in kwargs.items():
            if hasattr(session, key):
                setattr(session, key, value)
        
        session.updated_at = datetime.now()
        return session
    
    def add_attempt(self, session_id: str, level: int, objective: int, 
                   code_submitted: list, is_correct: bool, feedback: str = None) -> Optional[GameSession]:
        """Add an attempt to a session"""
        session = self._sessions.get(session_id)
        if not session:
            return None
        
        attempt = GameAttempt(
            attempt_id=f"att_{uuid.uuid4().hex[:6]}",
            level=level,
            objective=objective,
            code_submitted=code_submitted,
            is_correct=is_correct,
            feedback=feedback,
            attempted_at=datetime.now()
        )
        
        session.attempts.append(attempt)
        session.updated_at = datetime.now()
        return session
    
    def decrement_lives(self, session_id: str) -> Optional[GameSession]:
        """Decrement lives for a session"""
        session = self._sessions.get(session_id)
        if not session:
            return None
        
        session.lives_remaining = max(0, session.lives_remaining - 1)
        session.updated_at = datetime.now()
        
        if session.lives_remaining == 0:
            session.status = "game_over"
        
        return session
    
    def reset_session(self, session_id: str) -> Optional[GameSession]:
        """Reset a session to initial state"""
        session = self._sessions.get(session_id)
        if not session:
            return None
        
        session.current_level = 1
        session.current_objective = 1
        session.lives_remaining = 3
        session.status = "active"
        session.attempts = []
        session.updated_at = datetime.now()
        
        return session
    
    def advance_objective(self, session_id: str) -> Optional[GameSession]:
        """Advance to next objective or level"""
        session = self._sessions.get(session_id)
        if not session:
            return None
        
        # Level 1 has 2 objectives, Level 2 has 2 objectives
        if session.current_level == 1 and session.current_objective == 1:
            session.current_objective = 2
        elif session.current_level == 1 and session.current_objective == 2:
            session.current_level = 2
            session.current_objective = 1
            session.lives_remaining = 3  # Reset lives for new level
        elif session.current_level == 2 and session.current_objective == 1:
            session.current_objective = 2
        elif session.current_level == 2 and session.current_objective == 2:
            session.status = "completed"
        
        session.updated_at = datetime.now()
        return session
    
    def get_all_sessions(self) -> Dict[str, GameSession]:
        """Get all sessions (for debugging)"""
        return self._sessions.copy()
    
    def _initialize_test_sessions(self):
        """Initialize dummy test sessions for testing purposes"""
        # Create test session 1
        test_session_1 = GameSession(
            session_id="test_session_123",
            current_level=1,
            current_objective=1,
            lives_remaining=3,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            status="active",
            attempts=[]
        )
        self._sessions["test_session_123"] = test_session_1
        
        # Create test session 2
        test_session_2 = GameSession(
            session_id="test_session_456",
            current_level=1,
            current_objective=2,
            lives_remaining=2,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            status="active",
            attempts=[]
        )
        self._sessions["test_session_456"] = test_session_2
        
        # Create test session 3 (level 2)
        test_session_3 = GameSession(
            session_id="test_session_789",
            current_level=2,
            current_objective=1,
            lives_remaining=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            status="active",
            attempts=[]
        )
        self._sessions["test_session_789"] = test_session_3
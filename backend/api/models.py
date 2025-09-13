from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Request Models
class ExecuteRequest(BaseModel):
    session_id: str
    level: int
    objective: int
    code: List[str]
    lives: int

class HintRequest(BaseModel):
    session_id: str
    level: int
    objective: int
    code: Optional[List[str]] = None

# Response Models
class ExecuteResponse(BaseModel):
    success: bool
    status: str  # "success", "failure", or "incorrect"
    message: str
    feedback: Optional[str] = None
    lives_remaining: int
    game_over: bool

class LevelContext(BaseModel):
    level: int
    objective: int
    description: str

class HintResponse(BaseModel):
    success: bool
    hint: str
    level_context: dict  # Changed from LevelContext to dict to accept serialized data

class SessionStartResponse(BaseModel):
    session_id: str
    level: int
    objective: int
    lives: int

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str

# Internal Models
class GameAttempt(BaseModel):
    attempt_id: str
    level: int
    objective: int
    code_submitted: List[str]
    is_correct: bool
    feedback: Optional[str] = None
    attempted_at: datetime

class GameSession(BaseModel):
    session_id: str
    current_level: int
    current_objective: int
    lives_remaining: int
    created_at: datetime
    updated_at: datetime
    status: str  # "active", "completed", "game_over"
    attempts: List[GameAttempt] = []
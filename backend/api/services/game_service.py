from typing import List, Tuple
from api.services.game_context_reader import GameContextReader
from api.services.session_service import SessionService
from api.services.zypher_agent_service import ZypherAgentService
from api.models import ExecuteResponse, HintResponse, LevelContext

class GameService:
    """Main game service that orchestrates game logic"""
    
    def __init__(self, session_service: SessionService):
        self.session_service = session_service
        self.game_context = GameContextReader()
        self.zypher_agent = ZypherAgentService()
    
    def validate_code(self, user_code: List[str], level: int, objective: int) -> bool:
        """Validate user code against correct solution"""
        correct_solution = self.game_context.get_solution(level, objective)
        if not correct_solution:
            return False
        
        # Normalize code for comparison (remove whitespace, case insensitive)
        normalized_user = [code.strip().lower() for code in user_code]
        normalized_correct = [code.strip().lower() for code in correct_solution]
        
        return normalized_user == normalized_correct
    
    async def execute_code(self, session_id: str, level: int, objective: int, 
                          code: List[str], lives: int) -> ExecuteResponse:
        """Execute user code and return appropriate response"""
        
        # Validate session
        session = self.session_service.get_session(session_id)
        if not session:
            return ExecuteResponse(
                success=False,
                status="failure",
                message="Invalid session ID",
                lives_remaining=lives,
                game_over=True
            )
        
        # Validate level and objective
        if not self.game_context.validate_level_objective(level, objective):
            return ExecuteResponse(
                success=False,
                status="failure",
                message="Invalid level or objective",
                lives_remaining=lives,
                game_over=False
            )
        
        # Validate code
        is_correct = self.validate_code(code, level, objective)
        
        if is_correct:
            # Add successful attempt
            self.session_service.add_attempt(
                session_id, level, objective, code, True
            )
            
            # Advance to next objective/level
            self.session_service.advance_objective(session_id)
            
            return ExecuteResponse(
                success=True,
                status="success",
                message=f"Great job! You've completed Level {level}, Objective {objective}!",
                lives_remaining=lives,
                game_over=False
            )
        else:
            # Handle incorrect code
            if lives > 1:
                # Generate AI feedback
                correct_solution = self.game_context.get_solution(level, objective)
                feedback = await self.zypher_agent.generate_feedback(
                    level, objective, code, correct_solution
                )
                
                # Decrement lives and add attempt
                updated_session = self.session_service.decrement_lives(session_id)
                self.session_service.add_attempt(
                    session_id, level, objective, code, False, feedback
                )
                
                return ExecuteResponse(
                    success=False,
                    status="incorrect",
                    message="Not quite right, but keep trying!",
                    feedback=feedback,
                    lives_remaining=updated_session.lives_remaining if updated_session else 0,
                    game_over=False
                )
            else:
                # Game over
                self.session_service.update_session(session_id, status="game_over", lives_remaining=0)
                self.session_service.add_attempt(
                    session_id, level, objective, code, False, "Game Over"
                )
                
                return ExecuteResponse(
                    success=False,
                    status="failure",
                    message="Game Over! You've run out of lives. Try starting a new session.",
                    lives_remaining=0,
                    game_over=True
                )
    
    async def get_hint(self, session_id: str, level: int, objective: int, 
                      code: List[str] = None) -> HintResponse:
        """Get AI-powered hint for current level"""
        
        # Validate session
        session = self.session_service.get_session(session_id)
        if not session:
            level_context = LevelContext(
                level=level,
                objective=objective,
                description="Unknown"
            )
            return HintResponse(
                success=False,
                hint="Invalid session ID. Please start a new session.",
                level_context=level_context.model_dump()
            )
        
        # Validate level and objective
        if not self.game_context.validate_level_objective(level, objective):
            level_context = LevelContext(
                level=level,
                objective=objective,
                description="Unknown"
            )
            return HintResponse(
                success=False,
                hint="Invalid level or objective.",
                level_context=level_context.model_dump()
            )
        
        # Generate hint
        hint = await self.zypher_agent.generate_hint(level, objective, code)
        description = self.game_context.get_description(level, objective)
        
        level_context = LevelContext(
            level=level,
            objective=objective,
            description=description or "Unknown"
        )
        return HintResponse(
            success=True,
            hint=hint,
            level_context=level_context.model_dump()
        )
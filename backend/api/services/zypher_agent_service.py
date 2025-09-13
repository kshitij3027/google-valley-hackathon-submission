import os
from typing import List, Optional
from anthropic import Anthropic
from api.services.game_context_reader import GameContextReader

class ZypherAgentService:
    """Service for AI-powered feedback and hints using Anthropic Claude"""
    
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.game_context = GameContextReader()
        
        # Agent instructions for feedback generation
        self.feedback_instructions = """
You are a helpful coding tutor for a Mario-style educational game. 
Analyze the user's code attempt and provide encouraging, specific feedback.
Focus on:
1. What they did correctly
2. What specific function they might be missing
3. Hints about the game mechanics
4. Encouraging tone suitable for learners
Keep responses concise and actionable.
"""
        
        # Agent instructions for hint generation
        self.hint_instructions = """
You are a helpful coding tutor providing hints for a Mario-style game.
Based on the current level, objective, and user's partial code:
1. Provide a gentle nudge in the right direction
2. Explain relevant game mechanics
3. Suggest the next logical step
4. Maintain an encouraging, educational tone
Do not give away the complete solution.
"""
    
    async def generate_feedback(self, level: int, objective: int, 
                              user_code: List[str], correct_solution: List[str]) -> str:
        """Generate AI feedback for incorrect code attempts"""
        try:
            level_context = self.game_context.get_level_context(level, objective)
            
            prompt = f"""
{self.feedback_instructions}

Level {level}, Objective {objective}: {level_context['description']}
User's code attempt: {user_code}
Correct solution: {correct_solution}
Available functions: {self.game_context.get_available_functions()}

Provide encouraging feedback explaining what the user did right and what they need to adjust.
"""
            
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=200,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return response.content[0].text.strip()
            
        except Exception as e:
            print(f"Error generating feedback: {e}")
            return "Great attempt! Try reviewing the available functions and think about what actions Mario needs to take to overcome this challenge."
    
    async def generate_hint(self, level: int, objective: int, 
                          user_code: Optional[List[str]] = None) -> str:
        """Generate AI hints for current level and objective"""
        try:
            level_context = self.game_context.get_level_context(level, objective)
            
            user_code_text = f"Current code attempt: {user_code}" if user_code else "No code submitted yet."
            
            prompt = f"""
{self.hint_instructions}

Level {level}, Objective {objective}: {level_context['description']}
{user_code_text}
Available functions: {self.game_context.get_available_functions()}

Provide a helpful hint without giving away the complete solution.
"""
            
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=150,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return response.content[0].text.strip()
            
        except Exception as e:
            print(f"Error generating hint: {e}")
            # Fallback hints based on level and objective
            return self._get_fallback_hint(level, objective)
    
    def _get_fallback_hint(self, level: int, objective: int) -> str:
        """Provide fallback hints when AI service is unavailable"""
        fallback_hints = {
            "1_1": "Think about what Mario needs to do when he encounters an obstacle. He needs to move forward, then jump over it, and finally land safely.",
            "1_2": "This challenge has two obstacles in a row. Mario will need to jump twice while in the air before landing.",
            "2_1": "Mario needs to activate something before he can cross. Look for a switch that needs to be toggled!",
            "2_2": "There's an enemy in Mario's path. He needs to use a projectile to defeat it before moving forward."
        }
        
        key = f"{level}_{objective}"
        return fallback_hints.get(key, "Think about what actions Mario needs to take to complete this challenge. Check the available functions for guidance!")
    
    def is_configured(self) -> bool:
        """Check if the Anthropic API key is configured"""
        return bool(os.getenv("ANTHROPIC_API_KEY"))
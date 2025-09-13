import os
from typing import Dict, List, Optional

class GameContextReader:
    """Service for reading game context and solutions from markdown file"""
    
    def __init__(self, context_file_path: str = "game_context.md"):
        self.context_file_path = context_file_path
        self._solutions = self._load_solutions()
        self._descriptions = self._load_descriptions()
    
    def _load_solutions(self) -> Dict[str, List[str]]:
        """Load predefined solutions for each level and objective"""
        return {
            "1_1": ["move_forward()", "jump()", "come_down()"],
            "1_2": ["move_forward()", "jump()", "jump()", "come_down()"],
            "2_1": ["move_forward()", "toggle_switch()", "move_forward()", "move_forward()"],
            "2_2": ["move_forward()", "throw()", "move_forward()"]
        }
    
    def _load_descriptions(self) -> Dict[str, str]:
        """Load descriptions for each level and objective"""
        return {
            "1_1": "Jump over single obstacle",
            "1_2": "Multiple jumps over two obstacles", 
            "2_1": "Activate bridge lever",
            "2_2": "Defeat enemy"
        }
    
    def get_solution(self, level: int, objective: int) -> Optional[List[str]]:
        """Get the correct solution for a given level and objective"""
        key = f"{level}_{objective}"
        return self._solutions.get(key)
    
    def get_description(self, level: int, objective: int) -> Optional[str]:
        """Get the description for a given level and objective"""
        key = f"{level}_{objective}"
        return self._descriptions.get(key)
    
    def validate_level_objective(self, level: int, objective: int) -> bool:
        """Validate if the level and objective combination exists"""
        key = f"{level}_{objective}"
        return key in self._solutions
    
    def get_available_functions(self) -> List[str]:
        """Get list of available game functions"""
        return [
            "move_forward(steps=1)",
            "jump(height=1)", 
            "toggle_switch()",
            "throw()",
            "come_down()"
        ]
    
    def get_level_context(self, level: int, objective: int) -> Dict[str, any]:
        """Get complete context for a level and objective"""
        return {
            "level": level,
            "objective": objective,
            "description": self.get_description(level, objective),
            "solution": self.get_solution(level, objective)
        }
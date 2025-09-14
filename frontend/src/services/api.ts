import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interfaces matching backend models
export interface ExecuteRequest {
  session_id: string;
  level: number;
  objective: number;
  code: string[];
  lives: number;
}

export interface HintRequest {
  session_id: string;
  level: number;
  objective: number;
  code?: string[];
}

// Response interfaces matching backend models
export interface ExecuteResponse {
  success: boolean;
  status: string; // "success", "failure", or "incorrect"
  message: string;
  feedback?: string;
  lives_remaining: number;
  game_over: boolean;
}

export interface HintResponse {
  success: boolean;
  hint: string;
  level_context: any; // Changed to any to match backend dict type
}

// API functions
export const executeCode = async (request: ExecuteRequest): Promise<ExecuteResponse> => {
  try {
    const response = await api.post<ExecuteResponse>('/execute', request);
    return response.data;
  } catch (error) {
    console.error('Error executing code:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Return a mock response for development/demo purposes
      if (error.response.status >= 500) {
        return {
          success: false,
          status: 'failure',
          message: 'Server error occurred',
          lives_remaining: Math.max(0, request.lives - 1),
          game_over: request.lives <= 1
        };
      }
    }

    // Mock success for demo purposes - in production this would be a real API call
    const isCorrectSolution = checkSolutionMock(request.level, request.objective, request.code);

    return {
      success: isCorrectSolution,
      status: isCorrectSolution ? 'success' : 'incorrect',
      message: isCorrectSolution
        ? 'Great job! You solved the challenge!'
        : 'That solution didn\'t work. Try again!',
      feedback: isCorrectSolution
        ? undefined
        : 'Make sure you\'re using the right combination of functions.',
      lives_remaining: isCorrectSolution ? request.lives : Math.max(0, request.lives - 1),
      game_over: !isCorrectSolution && request.lives <= 1
    };
  }
};

export const getHint = async (request: HintRequest): Promise<HintResponse> => {
  try {
    const response = await api.post<HintResponse>('/hint', request);
    return response.data;
  } catch (error) {
    console.error('Error getting hint:', error);

    // Mock hint responses for demo purposes
    const hint = getHintMock(request.level, request.objective);

    return {
      success: true,
      hint,
      level_context: {
        level: request.level,
        objective: request.objective,
        description: `Level ${request.level}, Objective ${request.objective}`
      }
    };
  }
};

// Mock functions for demo purposes (replace with actual API calls in production)
const checkSolutionMock = (level: number, objective: number, code: string[]): boolean => {
  const codeString = code.join('\n').toLowerCase();

  if (level === 1) {
    if (objective === 1) {
      // Level 1, Objective 1: move_forward(), jump(), come_down()
      return codeString.includes('move_forward') &&
             codeString.includes('jump') &&
             codeString.includes('come_down');
    } else if (objective === 2) {
      // Level 1, Objective 2: move_forward(), jump(), jump(), come_down()
      const jumpMatches = (codeString.match(/jump/g) || []).length;
      return codeString.includes('move_forward') &&
             jumpMatches >= 2 &&
             codeString.includes('come_down');
    }
  } else if (level === 2) {
    if (objective === 1) {
      // Level 2, Objective 1: move_forward(), toggle_switch(), move_forward(), move_forward()
      const forwardMatches = (codeString.match(/move_forward/g) || []).length;
      return codeString.includes('toggle_switch') &&
             forwardMatches >= 3;
    } else if (objective === 2) {
      // Level 2, Objective 2: move_forward(), throw(), move_forward()
      const forwardMatches = (codeString.match(/move_forward/g) || []).length;
      return codeString.includes('throw') &&
             forwardMatches >= 2;
    }
  }

  return false;
};

const getHintMock = (level: number, objective: number): string => {
  if (level === 1) {
    if (objective === 1) {
      return "Try using move_forward() to get close to the obstacle, then jump() to go over it, and come_down() to land safely.";
    } else if (objective === 2) {
      return "This time you need to jump twice! Use move_forward(), then jump(), then jump() again to clear both obstacles, then come_down().";
    }
  } else if (level === 2) {
    if (objective === 1) {
      return "You need to activate the bridge! Use move_forward() to get to the switch, toggle_switch() to activate it, then move_forward() twice to cross.";
    } else if (objective === 2) {
      return "Time to defeat the enemy! Use move_forward() to get in range, then throw() to defeat the enemy, then move_forward() to continue.";
    }
  }

  return "Think about what actions you need to take to overcome this challenge!";
};

export default api;
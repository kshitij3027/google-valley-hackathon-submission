import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GameLevel from './GameLevel';
import ObjectivePopup from './ObjectivePopup';
import SuccessPopup from './SuccessPopup';
import { executeCode, getHint } from '../services/api';

const ScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Courier New', monospace;
`;

const GridBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 1;
`;

const GameUI = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid rgba(0, 255, 255, 0.3);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LivesContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Heart = styled.div<{ filled: boolean }>`
  width: 30px;
  height: 30px;
  background-color: ${props => props.filled ? '#ff4757' : 'rgba(255, 71, 87, 0.3)'};
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  filter: ${props => props.filled ? 'drop-shadow(0 0 8px #ff4757)' : 'none'};
`;

const LevelTitle = styled.h1`
  font-family: 'Courier New', monospace;
  font-size: 32px;
  color: #00ffff;
  margin: 0;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const PauseButton = styled.button`
  font-family: 'Courier New', monospace;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid white;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const GameArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

interface GameState {
  level: number;
  objective: number;
  lives: number;
}

interface GameScreenProps {
  gameState: GameState;
  onNavigate: (screen: 'title' | 'rules' | 'game', newGameState?: Partial<GameState>) => void;
  onGameStateChange: (newState: Partial<GameState>) => void;
}

interface PopupState {
  type: 'objective' | 'success' | null;
  isVisible: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  onNavigate,
  onGameStateChange
}) => {
  const [popupState, setPopupState] = useState<PopupState>({
    type: null,
    isVisible: false
  });

  // Show objective popup after 3 seconds as specified in PDF
  useEffect(() => {
    const timer = setTimeout(() => {
      setPopupState({ type: 'objective', isVisible: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [gameState.level, gameState.objective]);

  const [sessionId] = useState(() => 'session_' + Date.now());
  const [isLoading, setIsLoading] = useState(false);

  const getLevelTitle = (level: number) => {
    switch (level) {
      case 1:
        return 'level 1 - BABY STEPS';
      case 2:
        return 'level 2 - activation & terminations';
      default:
        return 'level 1 - BABY STEPS';
    }
  };

  const getObjectiveTitle = (level: number, objective: number) => {
    if (level === 1) {
      return objective === 1 ? 'Cross the first brick' : 'Cross both bricks';
    } else {
      return objective === 1 ? 'Activate the Bridge Lever' : 'Pick & throw the Projectile';
    }
  };

  const handleCodeExecution = async (code: string[]) => {
    console.log('GameScreen handleCodeExecution called', {
      code,
      gameState,
      sessionId,
      isLoading
    });

    setIsLoading(true);
    try {
      console.log('Calling executeCode API...');
      const response = await executeCode({
        session_id: sessionId,
        level: gameState.level,
        objective: gameState.objective,
        code,
        lives: gameState.lives
      });

      console.log('API response received:', response);
      console.log('Response details:', {
        success: response.success,
        status: response.status,
        message: response.message,
        lives_remaining: response.lives_remaining,
        game_over: response.game_over
      });

      if (response.success) {
        console.log('SUCCESS: Showing success popup');
        // Show success popup
        setPopupState({ type: 'success', isVisible: true });

        // After a delay, move to next objective/level
        setTimeout(() => {
          setPopupState({ type: null, isVisible: false });

          if (gameState.level === 1 && gameState.objective === 1) {
            // Move to level 1, objective 2
            onGameStateChange({ objective: 2 });
            setTimeout(() => {
              setPopupState({ type: 'objective', isVisible: true });
            }, 500);
          } else if (gameState.level === 1 && gameState.objective === 2) {
            // Move to level 2, objective 1
            onGameStateChange({ level: 2, objective: 1 });
            setTimeout(() => {
              setPopupState({ type: 'objective', isVisible: true });
            }, 500);
          } else if (gameState.level === 2 && gameState.objective === 1) {
            // Move to level 2, objective 2
            onGameStateChange({ objective: 2 });
            setTimeout(() => {
              setPopupState({ type: 'objective', isVisible: true });
            }, 500);
          } else {
            // Game completed - go back to title
            setTimeout(() => {
              onNavigate('title');
            }, 1000);
          }
        }, 2000);
      } else {
        // Handle failure - reduce lives
        const newLives = response.lives_remaining;
        onGameStateChange({ lives: newLives });

        if (response.game_over) {
          // Game over - go back to title
          setTimeout(() => {
            onNavigate('title');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error executing code:', error);
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const handleGetHint = async (code?: string[]) => {
    try {
      const response = await getHint({
        session_id: sessionId,
        level: gameState.level,
        objective: gameState.objective,
        code
      });

      return response.hint;
    } catch (error) {
      console.error('Error getting hint:', error);
      return 'Unable to get hint at this time.';
    }
  };

  return (
    <ScreenContainer>
      <GridBackground />

      <GameUI>
        <TopBar>
          <LeftSection>
            <LivesContainer>
              {[1, 2, 3].map((heartNum) => (
                <Heart key={heartNum} filled={heartNum <= gameState.lives} />
              ))}
            </LivesContainer>
            <LevelTitle>{getLevelTitle(gameState.level)}</LevelTitle>
          </LeftSection>

          <PauseButton onClick={() => onNavigate('title')}>
            ⏸
          </PauseButton>
        </TopBar>

        <GameArea>
          <GameLevel
            level={gameState.level}
            objective={gameState.objective}
          />
        </GameArea>
      </GameUI>

      {popupState.isVisible && popupState.type === 'objective' && (
        <ObjectivePopup
          level={gameState.level}
          objective={gameState.objective}
          title={getObjectiveTitle(gameState.level, gameState.objective)}
          onExecute={handleCodeExecution}
          onGetHint={handleGetHint}
          isLoading={isLoading}
        />
      )}

      {popupState.isVisible && popupState.type === 'success' && (
        <SuccessPopup />
      )}
    </ScreenContainer>
  );
};

export default GameScreen;
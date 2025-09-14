import React, { useState } from 'react';
import styled from 'styled-components';
import TitleScreen from './components/TitleScreen';
import RulesScreen from './components/RulesScreen';
import GameScreen from './components/GameScreen';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Courier New', monospace;
`;

type Screen = 'title' | 'rules' | 'game';

interface GameState {
  level: number;
  objective: number;
  lives: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    objective: 1,
    lives: 3
  });

  const handleScreenChange = (screen: Screen, newGameState?: Partial<GameState>) => {
    setCurrentScreen(screen);
    if (newGameState) {
      setGameState(prev => ({ ...prev, ...newGameState }));
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'title':
        return <TitleScreen onNavigate={handleScreenChange} />;
      case 'rules':
        return <RulesScreen onNavigate={handleScreenChange} />;
      case 'game':
        return <GameScreen
          gameState={gameState}
          onNavigate={handleScreenChange}
          onGameStateChange={(newState) => setGameState(prev => ({ ...prev, ...newState }))}
        />;
      default:
        return <TitleScreen onNavigate={handleScreenChange} />;
    }
  };

  return (
    <AppContainer>
      {renderCurrentScreen()}
    </AppContainer>
  );
}

export default App;

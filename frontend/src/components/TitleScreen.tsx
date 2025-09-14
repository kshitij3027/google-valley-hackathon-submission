import React from 'react';
import styled from 'styled-components';

const ScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
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

const FloatingPixel = styled.div<{ top: string; left: string; size: string; color: string; delay: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  background-color: ${props => props.color};
  animation: float ${props => `6s ease-in-out infinite ${props.delay}`};
  z-index: 2;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;

const ContentContainer = styled.div`
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Courier New', monospace;
  font-size: 72px;
  font-weight: bold;
  background: linear-gradient(45deg, #00ffff, #ffffff, #00ffff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
  animation: titleGlow 3s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);

  @keyframes titleGlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const Subtitle = styled.h2`
  font-family: 'Courier New', monospace;
  font-size: 28px;
  color: #7fff00;
  margin: 0 0 60px 0;
  font-weight: normal;
  text-shadow: 0 0 10px rgba(127, 255, 0, 0.3);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const MenuButton = styled.button<{ bgColor: string; hoverColor: string }>`
  font-family: 'Courier New', monospace;
  font-size: 32px;
  font-weight: bold;
  color: white;
  background: ${props => props.bgColor};
  border: 4px solid rgba(255, 255, 255, 0.8);
  padding: 15px 60px;
  cursor: pointer;
  border-radius: 8px;
  min-width: 280px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${props => props.hoverColor};
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    border-color: white;
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const PlayButton = styled(MenuButton)``;
const RulesButton = styled(MenuButton)``;
const ExitButton = styled(MenuButton)``;

interface TitleScreenProps {
  onNavigate: (screen: 'title' | 'rules' | 'game') => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onNavigate }) => {
  return (
    <ScreenContainer>
      <GridBackground />

      {/* Floating pixels for decoration */}
      <FloatingPixel top="15%" left="12%" size="8px" color="#00ffff" delay="0s" />
      <FloatingPixel top="25%" left="85%" size="6px" color="#00ffff" delay="1s" />
      <FloatingPixel top="70%" left="8%" size="10px" color="#00ffff" delay="2s" />
      <FloatingPixel top="80%" left="90%" size="6px" color="#00ffff" delay="0.5s" />
      <FloatingPixel top="45%" left="92%" size="8px" color="#00ffff" delay="1.5s" />
      <FloatingPixel top="60%" left="5%" size="6px" color="#00ffff" delay="3s" />

      <ContentContainer>
        <Title>Pixel Vs. Program</Title>
        <Subtitle>Learn to Code by Playing</Subtitle>

        <ButtonContainer>
          <PlayButton
            bgColor="linear-gradient(135deg, #e91e63, #ad1457)"
            hoverColor="linear-gradient(135deg, #f06292, #c2185b)"
            onClick={() => onNavigate('game')}
          >
            PLAY
          </PlayButton>

          <RulesButton
            bgColor="linear-gradient(135deg, #2196f3, #1565c0)"
            hoverColor="linear-gradient(135deg, #64b5f6, #1976d2)"
            onClick={() => onNavigate('rules')}
          >
            RULES
          </RulesButton>

          <ExitButton
            bgColor="linear-gradient(135deg, #4caf50, #2e7d32)"
            hoverColor="linear-gradient(135deg, #81c784, #388e3c)"
            onClick={() => window.close()}
          >
            EXIT
          </ExitButton>
        </ButtonContainer>
      </ContentContainer>
    </ScreenContainer>
  );
};

export default TitleScreen;
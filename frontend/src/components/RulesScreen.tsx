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
  padding: 40px;
  box-sizing: border-box;
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
  max-width: 1000px;
  width: 100%;
`;

const Title = styled.h1`
  font-family: 'Courier New', monospace;
  font-size: 72px;
  font-weight: bold;
  color: white;
  margin: 0 0 20px 0;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
`;

const Subtitle = styled.h2`
  font-family: 'Courier New', monospace;
  font-size: 28px;
  color: #7fff00;
  margin: 0 0 40px 0;
  font-weight: normal;
  text-shadow: 0 0 10px rgba(127, 255, 0, 0.3);
`;

const RulesContainer = styled.div`
  background: rgba(0, 255, 255, 0.1);
  border: 3px solid #00ffff;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
`;

const RulesList = styled.ol`
  font-family: 'Courier New', monospace;
  font-size: 18px;
  color: white;
  line-height: 1.8;
  margin: 0;
  padding-left: 30px;

  li {
    margin-bottom: 20px;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
`;

const TipContainer = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid rgba(0, 255, 255, 0.3);
`;

const TipText = styled.p`
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #00ffff;
  margin: 0;
  font-style: italic;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
`;

const BackButton = styled.button`
  font-family: 'Courier New', monospace;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  border: 4px solid rgba(255, 255, 255, 0.8);
  padding: 15px 40px;
  cursor: pointer;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  position: absolute;
  bottom: 40px;
  left: 40px;

  &:hover {
    background: linear-gradient(135deg, #81c784, #388e3c);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    border-color: white;
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const FooterText = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
`;

interface RulesScreenProps {
  onNavigate: (screen: 'title' | 'rules' | 'game') => void;
}

const RulesScreen: React.FC<RulesScreenProps> = ({ onNavigate }) => {
  return (
    <ScreenContainer>
      <GridBackground />

      {/* Floating pixels for decoration */}
      <FloatingPixel top="10%" left="15%" size="8px" color="#00ffff" delay="0s" />
      <FloatingPixel top="20%" left="85%" size="6px" color="#00ffff" delay="1s" />
      <FloatingPixel top="75%" left="10%" size="10px" color="#00ffff" delay="2s" />
      <FloatingPixel top="85%" left="88%" size="6px" color="#00ffff" delay="0.5s" />

      <ContentContainer>
        <Title>Rules</Title>
        <Subtitle>How to play and learn</Subtitle>

        <RulesContainer>
          <RulesList>
            <li>The world freezes at a challenge (pit, gate, enemy).</li>
            <li>Write a few lines of code to change the world.</li>
            <li>Press RUN to test; fix errors using hints.</li>
            <li>Concepts you'll use: Loops and Conditionals.</li>
            <li>Beat the level only by coding the solution.</li>
          </RulesList>

          <TipContainer>
            <TipText>Tip: Tap "AI Assist" for a scaffolded example.</TipText>
          </TipContainer>
        </RulesContainer>
      </ContentContainer>

      <BackButton onClick={() => onNavigate('title')}>
        BACK
      </BackButton>

      <FooterText>
        Built at SF AI Vibe Hackathon • Powered by Trae / TestSprite / CoreSpeed
      </FooterText>
    </ScreenContainer>
  );
};

export default RulesScreen;
import React from 'react';
import styled from 'styled-components';

const LevelContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const GameWorld = styled.div`
  flex: 1;
  position: relative;
  background: linear-gradient(180deg, #4a6fa5 0%, #2c5282 70%, #1a202c 100%);
  overflow: hidden;
`;

const Ground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #000000;
  border-top: 4px solid #00ffff;
`;

const FloatingPixels = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #00ffff;
  border-radius: 1px;
`;

const Robot = styled.div<{ position: number }>`
  position: absolute;
  bottom: 80px;
  left: ${props => props.position * 120 + 50}px;
  width: 60px;
  height: 80px;
  background: linear-gradient(135deg, #4fd1c7, #2dd4bf);
  border: 3px solid #14b8a6;
  border-radius: 8px;
  transition: left 0.5s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 20px;
    background: #00ffff;
    border-radius: 4px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 10px;
    width: 15px;
    height: 15px;
    background: #4fd1c7;
    border-radius: 2px;
    box-shadow: 25px 0 0 #4fd1c7;
  }
`;

const Obstacle = styled.div<{ position: number; height: number; type?: 'block' | 'spikes' }>`
  position: absolute;
  bottom: 80px;
  left: ${props => props.position * 120}px;
  width: 80px;
  height: ${props => props.height}px;
  background: ${props => props.type === 'spikes' ? 'linear-gradient(45deg, #ff6b6b, #ee5a5a)' : 'linear-gradient(135deg, #4299e1, #3182ce)'};
  border: 3px solid ${props => props.type === 'spikes' ? '#e53e3e' : '#2b6cb0'};
  border-radius: 4px;

  ${props => props.type === 'spikes' && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 15px;
      background: repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 8px,
        #e53e3e 8px,
        #e53e3e 16px
      );
      clip-path: polygon(0 100%, 10% 0%, 20% 100%, 30% 0%, 40% 100%, 50% 0%, 60% 100%, 70% 0%, 80% 100%, 90% 0%, 100% 100%);
    }
  `}
`;

const Bridge = styled.div<{ position: number; isActivated?: boolean }>`
  position: absolute;
  bottom: ${props => props.isActivated ? '80px' : '120px'};
  left: ${props => props.position * 120}px;
  width: 200px;
  height: 20px;
  background: linear-gradient(135deg, #4299e1, #3182ce);
  border: 2px solid #2b6cb0;
  transition: bottom 0.8s ease-in-out;
  border-radius: 4px;
`;

const Switch = styled.div<{ position: number; isActivated?: boolean }>`
  position: absolute;
  bottom: 80px;
  left: ${props => props.position * 120}px;
  width: 40px;
  height: 60px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border: 2px solid #2f855a;
  border-radius: 4px;

  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 30px;
    background: ${props => props.isActivated ? '#00ffff' : '#4fd1c7'};
    border-radius: 2px;
    transition: background 0.3s ease;
  }
`;

const Enemy = styled.div<{ position: number; isDefeated?: boolean }>`
  position: absolute;
  bottom: 80px;
  left: ${props => props.position * 120}px;
  width: 50px;
  height: 50px;
  background: ${props => props.isDefeated ? '#666' : 'linear-gradient(135deg, #ed8936, #dd6b20)'};
  border: 3px solid ${props => props.isDefeated ? '#333' : '#c05621'};
  border-radius: 50%;
  opacity: ${props => props.isDefeated ? 0.5 : 1};
  transition: all 0.5s ease;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    background: ${props => props.isDefeated ? '#333' : '#ffd700'};
    border-radius: 50%;
  }
`;

const Projectile = styled.div<{ position: number }>`
  position: absolute;
  bottom: 100px;
  left: ${props => props.position * 120}px;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #ffd700, #f6d55c);
  border: 2px solid #e6c200;
  border-radius: 50%;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 15px;
    height: 15px;
    background: #ffffff;
    border-radius: 50%;
  }
`;

interface GameLevelProps {
  level: number;
  objective: number;
}

const GameLevel: React.FC<GameLevelProps> = ({ level, objective }) => {
  const getRobotPosition = () => {
    if (level === 1) {
      if (objective === 1) return 0; // Start position
      return objective === 2 ? 2 : 0; // After first obstacle
    } else {
      if (objective === 1) return 0; // Start position for level 2
      return 6; // After bridge for level 2 objective 2
    }
  };

  const renderLevel1 = () => (
    <>
      <Robot position={getRobotPosition()} />

      {/* First obstacle - single block */}
      <Obstacle position={2} height={60} />

      {/* Second obstacle - double blocks with spikes */}
      <Obstacle position={5} height={60} />
      <Obstacle position={6.5} height={100} type="spikes" />

      {/* Floating pixels for atmosphere */}
      <FloatingPixels style={{ top: '20%', left: '15%' }} />
      <FloatingPixels style={{ top: '40%', left: '75%' }} />
      <FloatingPixels style={{ top: '60%', left: '25%' }} />
      <FloatingPixels style={{ top: '30%', left: '85%' }} />
    </>
  );

  const renderLevel2 = () => (
    <>
      <Robot position={getRobotPosition()} />

      {/* Bridge (activated only after objective 1) */}
      <Bridge position={2.5} isActivated={objective > 1} />

      {/* Switch */}
      <Switch position={1} isActivated={objective > 1} />

      {/* Enemy */}
      <Enemy position={7} isDefeated={objective > 1 && level === 2} />

      {/* Projectile */}
      <Projectile position={6} />

      {/* Floating pixels for atmosphere */}
      <FloatingPixels style={{ top: '15%', left: '10%' }} />
      <FloatingPixels style={{ top: '35%', left: '70%' }} />
      <FloatingPixels style={{ top: '55%', left: '90%' }} />
    </>
  );

  return (
    <LevelContainer>
      <GameWorld>
        {level === 1 ? renderLevel1() : renderLevel2()}
        <Ground />
      </GameWorld>
    </LevelContainer>
  );
};

export default GameLevel;
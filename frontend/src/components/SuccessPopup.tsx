import React from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border: 4px solid #ffffff;
  border-radius: 12px;
  padding: 60px 80px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: successPulse 2s ease-in-out infinite;
  text-align: center;

  @keyframes successPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
    }
  }
`;

const SuccessTitle = styled.h1`
  font-family: 'Courier New', monospace;
  font-size: 64px;
  font-weight: bold;
  color: #7fff00;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow:
    0 0 10px #7fff00,
    0 0 20px #7fff00,
    0 0 30px #7fff00,
    0 0 40px #7fff00;
  animation: glow 1.5s ease-in-out infinite alternate;

  @keyframes glow {
    from {
      text-shadow:
        0 0 10px #7fff00,
        0 0 20px #7fff00,
        0 0 30px #7fff00,
        0 0 40px #7fff00;
    }
    to {
      text-shadow:
        0 0 20px #7fff00,
        0 0 30px #7fff00,
        0 0 40px #7fff00,
        0 0 50px #7fff00,
        0 0 60px #7fff00;
    }
  }
`;

const SubMessage = styled.p`
  font-family: 'Courier New', monospace;
  font-size: 24px;
  color: white;
  margin: 20px 0 0 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

interface SuccessPopupProps {
  isLevelComplete?: boolean;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isLevelComplete = false }) => {
  return (
    <PopupOverlay>
      <PopupContainer>
        <SuccessTitle>SUCCESS</SuccessTitle>
        {isLevelComplete && (
          <SubMessage>Level Complete</SubMessage>
        )}
      </PopupContainer>
    </PopupOverlay>
  );
};

export default SuccessPopup;
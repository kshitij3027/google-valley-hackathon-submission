import React, { useState } from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div<{ isVisible: boolean }>`
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
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const PopupContainer = styled.div`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border: 4px solid #ffffff;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.5s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const PopupHeader = styled.h2`
  font-family: 'Courier New', monospace;
  font-size: 24px;
  color: white;
  margin: 0 0 20px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #ffffff, #e0e7ff, #ffffff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 2s ease-in-out infinite;

  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const InstructionsContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const InstructionsList = styled.ul`
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: white;
  line-height: 1.6;
  margin: 0;
  padding-left: 20px;

  li {
    margin-bottom: 8px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const CodeContainer = styled.div`
  margin-bottom: 20px;
`;

const CodeTextArea = styled.textarea`
  width: 100%;
  height: 120px;
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 6px;
  padding: 15px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #e2e8f0;
  resize: none;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }

  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
`;

const ActionButton = styled.button<{ variant: 'execute' | 'hint'; disabled?: boolean }>`
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: ${props =>
    props.variant === 'execute'
      ? 'linear-gradient(135deg, #6b7280, #4b5563)'
      : 'linear-gradient(135deg, #1f2937, #111827)'
  };
  border: 2px solid #9ca3af;
  padding: 12px 30px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    ${props => !props.disabled && `
      background: ${props.variant === 'execute'
        ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
        : 'linear-gradient(135deg, #374151, #1f2937)'
      };
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;

const FeedbackContainer = styled.div<{ $isVisible: boolean }>`
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 6px;
  padding: 15px;
  margin-top: 15px;
  min-height: 60px;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const FeedbackText = styled.p`
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #e2e8f0;
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const LoadingSpinner = styled.div`
  border: 2px solid #4a5568;
  border-top: 2px solid #00ffff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface ObjectivePopupProps {
  level: number;
  objective: number;
  title: string;
  onExecute: (code: string[]) => Promise<void>;
  onGetHint: (code?: string[]) => Promise<string>;
  isLoading: boolean;
}

const ObjectivePopup: React.FC<ObjectivePopupProps> = ({
  level,
  objective,
  title,
  onExecute,
  onGetHint,
  isLoading
}) => {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);

  const getInstructions = () => {
    return [
      "move_forward(steps=1) – move right steps tiles (default 1).",
      "jump(height=1) – hop over 1-tile obstacles or small gaps (use jump(2) once).",
      "toggle_switch() – flips a nearby switch (1 tile away).",
      "throw() – throw a ball 2 tiles ahead; defeats one enemy.",
      "come_down() → move +1 tile and land (airborne → ground).",
      "repeat(times, do _ end) – optional loop for \"fancy\" solutions (star bonus)."
    ];
  };

  const handleExecute = async (event?: React.MouseEvent) => {
    console.log('Execute button clicked - START', {
      isLoading,
      isGettingHint,
      code: code.trim(),
      codeLength: code.length,
      event: event?.type
    });

    // Prevent any default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!code.trim()) {
      console.log('No code entered, showing feedback');
      setFeedback('Please enter some code before executing.');
      setShowFeedback(true);
      return;
    }

    try {
      console.log('About to execute code...');
      const codeLines = code.split('\n').filter(line => line.trim());
      console.log('Code lines to execute:', codeLines);

      await onExecute(codeLines);
      console.log('Code execution completed');

    } catch (error) {
      console.error('Error in handleExecute:', error);
      setFeedback('An error occurred while executing your code.');
      setShowFeedback(true);
    }
  };

  const handleHint = async () => {
    setIsGettingHint(true);
    try {
      const codeLines = code.trim() ? code.split('\n').filter(line => line.trim()) : undefined;
      const hint = await onGetHint(codeLines);
      setFeedback(hint);
      setShowFeedback(true);

      // Auto-hide feedback after 5 seconds as specified
      setTimeout(() => {
        setShowFeedback(false);
      }, 5000);
    } catch (error) {
      setFeedback('Unable to get hint at this time.');
      setShowFeedback(true);
    } finally {
      setIsGettingHint(false);
    }
  };

  return (
    <PopupOverlay isVisible={true}>
      <PopupContainer>
        <PopupHeader>Objective: {title}</PopupHeader>

        <InstructionsContainer>
          <InstructionsList>
            {getInstructions().map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </InstructionsList>
        </InstructionsContainer>

        <CodeContainer>
          <CodeTextArea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Type your code here..."
            disabled={isLoading}
          />
        </CodeContainer>

        <ButtonContainer>
          <ActionButton
            variant="execute"
            type="button"
            onClick={(e) => {
              console.log('Button click event triggered');
              handleExecute(e);
            }}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'EXECUTE'}
          </ActionButton>

          <ActionButton
            variant="hint"
            onClick={handleHint}
            disabled={isGettingHint || isLoading}
          >
            {isGettingHint ? <LoadingSpinner /> : 'HINT'}
          </ActionButton>
        </ButtonContainer>

        <FeedbackContainer $isVisible={showFeedback}>
          {showFeedback ? (
            <FeedbackText>{feedback}</FeedbackText>
          ) : null}
        </FeedbackContainer>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default ObjectivePopup;
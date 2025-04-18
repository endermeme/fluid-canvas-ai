
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizContainer from '@/components/quiz/QuizContainer';
import QuickGameSelector from '@/components/quiz/QuickGameSelector';

const Quiz: React.FC = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleToggleChat = () => {
    setShowChat(!showChat);
  };

  const handleGameRequest = (topic: string) => {
    // Simplified - just show that the request was received
    console.log("Game requested:", topic);
  };

  return (
    <QuizContainer 
      title="Interactive Learning Games"
      showBackButton={true}
      onBack={() => navigate('/')}
      showSettingsButton={false}
    >
      <div className="h-full">
        <QuickGameSelector
          onGameRequest={handleGameRequest}
          onToggleChat={handleToggleChat}
        />
      </div>
    </QuizContainer>
  );
};

export default Quiz;

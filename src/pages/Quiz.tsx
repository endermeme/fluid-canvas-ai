
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizContainer from '@/components/quiz/QuizContainer';
import QuickGameSelector from '@/components/quiz/QuickGameSelector';
import CustomGameForm from '@/components/quiz/custom-games/CustomGameForm';

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

  // Check if we're on the custom game route
  const isCustomGame = window.location.pathname === '/custom-game';

  return (
    <QuizContainer 
      title={isCustomGame ? "Tạo Game Tùy Chỉnh" : "Interactive Learning Games"}
      showBackButton={true}
      onBack={() => navigate('/')}
      showSettingsButton={false}
    >
      <div className="h-full">
        {isCustomGame ? (
          <CustomGameForm 
            onGenerate={(content) => console.log("Game generated:", content)}
            onCancel={() => navigate('/quiz')}
          />
        ) : (
          <QuickGameSelector
            onGameRequest={handleGameRequest}
            onToggleChat={handleToggleChat}
          />
        )}
      </div>
    </QuizContainer>
  );
};

export default Quiz;

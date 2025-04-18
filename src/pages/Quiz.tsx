
import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizContainer from '@/components/quiz/QuizContainer';
import QuickGameSelector from '@/components/quiz/QuickGameSelector';
import GameController from '@/components/quiz/custom-games/GameController';

const Quiz: React.FC = () => {
  const navigate = useNavigate();

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
          <GameController />
        ) : (
          <QuickGameSelector
            onGameRequest={(topic) => {
              // Navigate to custom game with topic as param
              navigate(`/custom-game?topic=${encodeURIComponent(topic)}`);
            }}
            onToggleChat={() => {
              // Since this is a required prop but we don't have chat functionality in this context,
              // we'll provide a no-op function
              console.log("Toggle chat requested but not implemented in this context");
            }}
          />
        )}
      </div>
    </QuizContainer>
  );
};

export default Quiz;


import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame } from '@/utils/gameExport';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Button } from '@/components/ui/button';
import SimpleGameView from '@/components/quiz/custom-games/SimpleGameView';

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const game = gameId ? getSharedGame(gameId) : null;
  
  const handleBack = () => {
    navigate('/custom-game');
  };
  
  if (!game) {
    return (
      <QuizContainer
        title="Game không tồn tại"
        showBackButton={true}
        onBack={handleBack}
      >
        <div className="flex flex-col items-center justify-center h-full p-6">
          <div className="p-8 bg-background/90 rounded-xl shadow-lg border border-primary/10 max-w-md w-full">
            <p className="text-center mb-6 text-muted-foreground">Game đã hết hạn hoặc không tồn tại.</p>
            <Button onClick={handleBack} className="w-full">Quay lại</Button>
          </div>
        </div>
      </QuizContainer>
    );
  }
  
  return (
    <QuizContainer
      title={game.title}
      showBackButton={true}
      onBack={handleBack}
    >
      <SimpleGameView 
        gameHtml={game.htmlContent} 
        gameTitle={game.title}
      />
    </QuizContainer>
  );
};

export default GameSharePage;

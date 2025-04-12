
import React from 'react';
import { useParams } from 'react-router-dom';
import { getSharedGame } from '@/utils/gameExport';
import QuizContainer from '@/components/quiz/QuizContainer';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const game = gameId ? getSharedGame(gameId) : null;
  
  const handleBack = () => {
    navigate('/preset-games');
  };
  
  if (!game) {
    return (
      <QuizContainer
        title="Game không tồn tại"
        showBackButton={true}
        onBack={handleBack}
      >
        <div className="flex flex-col items-center justify-center h-full p-6">
          <p className="text-center mb-4">Game đã hết hạn hoặc không tồn tại.</p>
          <Button onClick={handleBack}>Quay lại</Button>
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
      <EnhancedGameView 
        miniGame={{
          title: game.title,
          content: game.htmlContent
        }}
        onBack={handleBack}
        extraButton={
          <Button 
            size="sm" 
            variant="outline" 
            className="ml-2"
            onClick={() => navigate('/preset-games')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Tạo Game Mới
          </Button>
        }
      />
    </QuizContainer>
  );
};

export default GameSharePage;

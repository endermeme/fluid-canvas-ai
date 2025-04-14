
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedGame } from '@/utils/gameExport';
import QuizContainer from '@/components/quiz/QuizContainer';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState(gameId ? getSharedGame(gameId) : null);
  
  // Check for OpenAI API key on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      (window as any).OPENAI_API_KEY = storedKey;
    }
  }, []);
  
  const handleBack = () => {
    navigate('/custom-game');
  };
  
  if (!game) {
    return (
      <QuizContainer
        title="Game không tồn tại"
        showBackButton={true}
        onBack={handleBack}
        className="p-0 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-background to-background/80">
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
      showBackButton={false}
      showHomeButton={false}
      showRefreshButton={false}
      className="p-0 overflow-hidden"
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
            className="text-xs"
            onClick={() => navigate('/custom-game')}
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Tạo Game Mới
          </Button>
        }
      />
    </QuizContainer>
  );
};

export default GameSharePage;

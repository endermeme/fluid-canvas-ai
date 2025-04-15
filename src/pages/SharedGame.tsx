
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { StoredGame } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import QuizContainer from '@/components/quiz/QuizContainer';

const SharedGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('ID game không hợp lệ');
      setLoading(false);
      return;
    }

    const loadGame = async () => {
      const loadedGame = await getSharedGame(id);
      if (loadedGame) {
        setGame(loadedGame);
      } else {
        setError('Game không tồn tại hoặc đã hết hạn');
      }
      setLoading(false);
    };

    loadGame();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <QuizContainer
        title="Game không tồn tại"
        showBackButton={true}
        onBack={() => navigate('/')}
      >
        <div className="flex flex-col items-center justify-center h-full p-6">
          <p className="text-center mb-6 text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/')}>Quay lại trang chủ</Button>
        </div>
      </QuizContainer>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="text-sm text-muted-foreground">
          Còn lại: {getRemainingTime(game.expiresAt)}
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <iframe
          srcDoc={game.htmlContent}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-none"
          title={game.title}
        />
      </main>
    </div>
  );
};

export default SharedGame;

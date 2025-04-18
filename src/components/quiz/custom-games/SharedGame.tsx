
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame } from '@/utils/gameExport';
import { addParticipant } from '@/utils/gameParticipation';
import QuizContainer from '@/components/quiz/QuizContainer';
import gameTemplates from '@/components/quiz/preset-games/templates';
import CustomGameContainer from './CustomGameContainer';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const SharedGame: React.FC = () => {
  const { id, gameType, slug, gameId } = useParams<{ 
    id?: string; 
    gameType?: string; 
    slug?: string; 
    gameId?: string; 
  }>();
  
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadGame = async () => {
      // Determine which ID to use - either from the new URL pattern or the old one
      const gameIdentifier = gameId || id;
      
      if (!gameIdentifier) {
        setError('ID game không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const loadedGame = await getSharedGame(gameIdentifier);
        if (loadedGame) {
          setGame(loadedGame);
        } else {
          setError('Game không tồn tại hoặc đã hết hạn');
        }
      } catch (err) {
        console.error('Error loading game:', err);
        setError('Không thể tải game. Vui lòng thử lại sau.');
      }
      setLoading(false);
    };

    loadGame();
  }, [id, gameId]);

  if (loading) {
    return (
      <QuizContainer title="Đang tải game...">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </QuizContainer>
    );
  }

  if (error || !game) {
    return (
      <QuizContainer
        title="Game không tồn tại"
        showBackButton={true}
        onBack={() => navigate('/preset-games')}
      >
        <div className="flex flex-col items-center justify-center h-full p-6">
          <p className="text-center mb-6 text-muted-foreground">{error}</p>
        </div>
      </QuizContainer>
    );
  }

  // Render appropriate game template based on game type
  const GameTemplate = gameTemplates[game.gameType as keyof typeof gameTemplates];
  
  if (GameTemplate) {
    return (
      <GameTemplate
        topic={game.title}
        content={game.content}
        onBack={() => navigate('/preset-games')}
      />
    );
  }

  // Fallback to custom game container for custom games
  return (
    <CustomGameContainer 
      title={game.title}
      content={game.content}
    />
  );
};

export default SharedGame;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChartLine } from 'lucide-react';
import QuizContainer from '@/components/quiz/QuizContainer';
import gameTemplates from '@/components/quiz/preset-games/templates';
import { recordGameParticipant } from '@/components/quiz/custom-games/utils/customGameAPI';
import GamePlayerForm from '@/components/quiz/share/GamePlayerForm';
import GamePlayView from '@/components/quiz/share/GamePlayView';

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
  const [playerName, setPlayerName] = useState<string>('');
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id && !gameId) {
      setError('ID game không hợp lệ');
      setLoading(false);
      return;
    }

    const loadGame = async () => {
      const gameIdentifier = gameId || id;
      
      try {
        const loadedGame = await getSharedGame(gameIdentifier!);
        if (loadedGame) {
          setGame(loadedGame);
          
          // Kiểm tra tên người chơi trong localStorage
          const storedName = localStorage.getItem(`player_${loadedGame.id}`);
          if (storedName) {
            setPlayerName(storedName);
            setHasJoined(true);
          }
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

  const handleJoinGame = async (name: string) => {
    if (!name || name.trim() === '') {
      alert("Vui lòng nhập tên của bạn");
      return;
    }
    
    try {
      if (game) {
        await recordGameParticipant(game.id, name);
        localStorage.setItem(`player_${game.id}`, name);
        setPlayerName(name);
        setHasJoined(true);
      }
    } catch (error) {
      console.error("Lỗi khi ghi nhận người tham gia:", error);
      // Vẫn cho phép chơi ngay cả khi có lỗi ghi nhận
      setPlayerName(name);
      setHasJoined(true);
    }
  };

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

  if (!hasJoined) {
    return <GamePlayerForm 
      game={game}
      onJoin={handleJoinGame}
      onCancel={() => navigate('/')}
    />;
  }

  // Nếu là game được định nghĩa trước từ templates
  if (game?.gameType && gameTemplates[game.gameType as keyof typeof gameTemplates]) {
    const GameTemplate = gameTemplates[game.gameType as keyof typeof gameTemplates];
    
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b sticky top-0 z-50">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div className="ml-4 hidden sm:block">
              <span className="font-medium">{game.title}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                (Chơi với tên: {playerName})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Còn lại: {game && getRemainingTime(game.expiresAt)}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`${window.location.pathname}/dashboard`)}
            >
              <ChartLine className="h-4 w-4 mr-2" />
              Giáo viên
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          <GameTemplate 
            data={game.content}
            content={game.content}
            topic={game.title}
            onBack={() => navigate('/')}
          />
        </main>
      </div>
    );
  }

  // Nếu là custom game
  return <GamePlayView 
    game={game} 
    playerName={playerName}
    onBack={() => navigate('/')}
  />;
};

export default SharedGame;

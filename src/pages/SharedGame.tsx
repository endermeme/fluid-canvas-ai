
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';

const SharedGame = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID trò chơi không hợp lệ');
      setLoading(false);
      return;
    }

    const loadGame = () => {
      const loadedGame = getSharedGame(id);
      setGame(loadedGame);
      
      if (loadedGame) {
        setTimeLeft(getRemainingTime(loadedGame.expiresAt));
      } else {
        setError('Trò chơi không tồn tại hoặc đã hết hạn');
      }
      
      setLoading(false);
    };

    loadGame();
    
    // Update remaining time every minute
    const intervalId = setInterval(() => {
      if (game) {
        setTimeLeft(getRemainingTime(game.expiresAt));
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [id, game]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg">Đang tải trò chơi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="text-2xl font-bold">{error}</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Liên kết này có thể đã hết hạn hoặc không tồn tại. Trò chơi chỉ có hiệu lực trong 48 giờ.
        </p>
        <Link to="/quiz">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại màn hình chính
          </Button>
        </Link>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="text-2xl font-bold">Trò chơi không tìm thấy</h1>
        <Link to="/quiz">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tạo trò chơi mới
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b p-3 flex justify-between items-center">
        <Link to="/quiz">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Còn lại: {timeLeft}</span>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        <iframe
          srcDoc={game.htmlContent}
          title={game.title}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-none mx-auto"
          style={{ 
            height: '100%', 
            width: '100%',
            margin: '0 auto',
            maxHeight: '100%'
          }}
        />
      </main>
    </div>
  );
};

export default SharedGame;

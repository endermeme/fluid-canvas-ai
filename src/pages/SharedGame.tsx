
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, formatRemainingTime, StoredGame } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, AlertTriangle, Plus } from 'lucide-react';

const SharedGame = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        // Giả sử game hết hạn sau 30 ngày kể từ ngày tạo
        const expirationDate = loadedGame.createdAt + (30 * 24 * 60 * 60 * 1000);
        setTimeLeft(formatRemainingTime(expirationDate));
      } else {
        setError('Trò chơi không tồn tại hoặc đã hết hạn');
      }
      
      setLoading(false);
    };

    loadGame();
    
    // Update remaining time every minute
    const intervalId = setInterval(() => {
      if (game) {
        const expirationDate = game.createdAt + (30 * 24 * 60 * 60 * 1000);
        setTimeLeft(formatRemainingTime(expirationDate));
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [id]);

  const handleCreateNewGame = () => {
    // Navigate to root path using react-router
    navigate('/');
  };

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
          Liên kết này có thể đã hết hạn hoặc không tồn tại. Trò chơi chỉ có hiệu lực trong 30 ngày.
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại màn hình chính
        </Button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="text-2xl font-bold">Trò chơi không tìm thấy</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tạo trò chơi mới
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-background border-b p-3 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Còn lại: {timeLeft}</span>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        <iframe
          srcDoc={game.htmlContent}
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

      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button 
          size="sm" 
          variant="ghost"
          className="bg-primary/10" 
          onClick={handleCreateNewGame}
        >
          <Plus size={16} className="mr-1" />
          Quay Về
        </Button>
      </div>
    </div>
  );
};

export default SharedGame;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, AlertTriangle, Share2 } from 'lucide-react';

const SharedGame = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

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
        document.title = loadedGame.title;
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

  const copyCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg font-medium">Đang tải trò chơi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="glass-morphism p-8 rounded-xl max-w-md text-center">
          <AlertTriangle className="text-destructive h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Liên kết này có thể đã hết hạn hoặc không tồn tại. Trò chơi chỉ có hiệu lực trong 48 giờ.
          </p>
          <Link to="/quiz">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại màn hình chính
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="glass-morphism p-8 rounded-xl max-w-md text-center">
          <AlertTriangle className="text-destructive h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Trò chơi không tìm thấy</h1>
          <Link to="/quiz">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tạo trò chơi mới
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
      <header className="bg-background/80 backdrop-blur-sm border-b p-3 flex justify-between items-center">
        <Link to="/quiz">
          <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/20 backdrop-blur-sm hover:bg-primary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyCurrentUrl} 
            className="bg-white/50 dark:bg-black/20 backdrop-blur-sm hover:bg-primary/20"
          >
            <Share2 className="h-4 w-4 mr-1" />
            {isCopied ? 'Đã sao chép' : 'Chia sẻ'}
          </Button>
          
          <div className="flex items-center text-sm bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-full">
            <Clock className="h-4 w-4 mr-1 text-amber-500" />
            <span>Còn lại: {timeLeft}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <iframe
          srcDoc={game.htmlContent}
          title={game.title}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-none"
          style={{ height: '100%', width: '100%' }}
        />
      </main>
    </div>
  );
};

export default SharedGame;

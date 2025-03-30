
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame, isStorageAvailable } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, AlertTriangle, Share2, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const SharedGame = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      setError('ID trò chơi không hợp lệ');
      setLoading(false);
      return;
    }

    // Check if localStorage is available (for Vercel deployment)
    if (!isStorageAvailable()) {
      setError('Không thể truy cập localStorage. Vui lòng kiểm tra cài đặt trình duyệt của bạn.');
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
  }, [id]);

  useEffect(() => {
    // Check URL parameters for errors
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam === 'storage') {
      toast({
        title: "Lưu ý quan trọng",
        description: "Trò chơi được lưu trữ cục bộ trên trình duyệt của bạn. Nếu bạn xóa dữ liệu trình duyệt, các trò chơi đã chia sẻ sẽ bị mất.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const copyCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      toast({
        title: "Đã sao chép",
        description: "Liên kết đã được sao chép vào clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {
      toast({
        title: "Không thể sao chép",
        description: "Vui lòng thử lại hoặc sao chép thủ công",
        variant: "destructive"
      });
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg font-medium">Đang tải trò chơi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="bg-background/90 backdrop-blur-md p-8 rounded-xl max-w-md text-center shadow-xl border border-red-200 dark:border-red-900/30">
          <AlertTriangle className="text-destructive h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Liên kết này có thể đã hết hạn hoặc không tồn tại. Trò chơi chỉ có hiệu lực trong 48 giờ.
          </p>
          
          <Alert variant="destructive" className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Lưu ý quan trọng</AlertTitle>
            <AlertDescription>
              Trò chơi được lưu trữ cục bộ trên trình duyệt. Nếu bạn đang sử dụng thiết bị hoặc trình duyệt khác, bạn không thể truy cập trò chơi này.
            </AlertDescription>
          </Alert>
          
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

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="bg-background/90 backdrop-blur-md p-8 rounded-xl max-w-md text-center shadow-xl border border-muted">
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
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
      <header className="bg-background/80 backdrop-blur-sm border-b p-3 flex justify-between items-center sticky top-0 z-10">
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
          style={{ height: 'calc(100vh - 56px)', width: '100%' }}
        />
      </main>
    </div>
  );
};

export default SharedGame;

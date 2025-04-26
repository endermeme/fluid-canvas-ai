
import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import GameIframeView from './GameIframeView';
import ShareGameDialog from './ShareGameDialog';
import CustomGameHeader from './CustomGameHeader';

interface MiniGame {
  title?: string;
  content: string;
}

interface EnhancedGameViewProps {
  miniGame: MiniGame;
  onReload?: () => void;
  className?: string;
  onBack?: () => void;
  onNewGame?: () => void;
  onShare?: () => void;
  extraButton?: React.ReactNode;
  hideHeader?: boolean;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onReload,
  className,
  onBack,
  onNewGame,
  onShare,
  extraButton,
  hideHeader = false
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleIframeLoad = () => {
    console.log("Iframe đã được tải xong");
    setIsIframeLoaded(true);
  };

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      try {
        setIsIframeLoaded(false);
        setIframeError(null);
        
        if (onReload) {
          onReload();
        }
      } catch (error) {
        console.error("Error refreshing game:", error);
        setIframeError("Không thể tải lại game. Vui lòng thử lại.");
      }
    }
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    
    if (!document.fullscreenElement) {
      iframeRef.current.requestFullscreen().catch(err => {
        console.error("Không thể vào chế độ toàn màn hình:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShareGame = async () => {
    if (!miniGame?.content || !isIframeLoaded) {
      toast({
        title: "Chưa thể chia sẻ",
        description: "Game đang được tải, vui lòng đợi một chút",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSharing(true);
      if (onShare) {
        onShare();
      }
      // Giả sử URL chia sẻ được tạo từ parent component
      setShareUrl(window.location.href);
      setShowShareDialog(true);
    } catch (error) {
      console.error("Lỗi khi chia sẻ game:", error);
      toast({
        title: "Lỗi chia sẻ game",
        description: "Không thể tạo liên kết chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Error component
  if (iframeError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
        <p className="text-destructive mb-4">{iframeError}</p>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={refreshGame}
        >
          Tải lại
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col ${className || ''}`}>
      {!hideHeader && (
        <CustomGameHeader
          onBack={onBack}
          onNewGame={onNewGame}
          onShare={handleShareGame}
          onRefresh={refreshGame}
          onFullscreen={handleFullscreen}
          showShare={true}
          isGameCreated={isIframeLoaded}
          showGameControls={true}
          isSharing={isSharing}
          gameTitle={miniGame?.title}
        />
      )}
      
      <div className="flex-1 relative overflow-hidden">
        {!isIframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-primary font-medium">Đang tải game...</p>
            </div>
          </div>
        )}
        <GameIframeView
          content={miniGame.content}
          title={miniGame.title}
          onLoad={handleIframeLoad}
          iframeRef={iframeRef}
        />
      </div>

      <ShareGameDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog}
        shareUrl={shareUrl}
      />
    </div>
  );
};

export default EnhancedGameView;


import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import GameHeader from './components/GameHeader';
import GameIframe from './components/GameIframe';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
  };
  onReload?: () => void;
  className?: string;
  onBack?: () => void;
  hideHeader?: boolean;
  onShare?: () => Promise<string>;
  onNewGame?: () => void;
  extraButton?: React.ReactNode;
  isTeacher?: boolean;
  gameExpired?: boolean;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onReload,
  className,
  onBack,
  hideHeader = false,
  onShare,
  onNewGame,
  extraButton,
  isTeacher = false,
  gameExpired = false
}) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (gameExpired) {
      setIframeError("Game này đã hết hạn hoặc không còn khả dụng.");
    }
  }, [gameExpired]);

  const refreshGame = () => {
    if (miniGame?.content) {
      try {
        setIsIframeLoaded(false);
        
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
    const iframe = document.querySelector('iframe');
    if (!iframe) return;
    
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error("Không thể vào chế độ toàn màn hình:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleShare = async (): Promise<string | void> => {
    if (!miniGame?.content) return;
    
    try {
      setIsSharing(true);
      toast({
        title: "Đang xử lý",
        description: "Đang tạo liên kết chia sẻ...",
      });
      
      const url = await saveGameForSharing(
        miniGame.title || 'Game tương tác',
        'custom',
        miniGame,
        miniGame.content
      );
      
      setIsSharing(false);
      return url;
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
      setIsSharing(false);
    }
  };

  const handleIframeLoaded = () => {
    setIsIframeLoaded(true);
  };

  const handleIframeError = (error: string) => {
    setIframeError(error);
  };

  return (
    <div className={`w-full h-full flex flex-col bg-gradient-to-b from-background to-background/95 ${className || ''}`}>
      {!hideHeader && (
        <GameHeader
          title={miniGame?.title}
          onBack={onBack}
          onRefresh={refreshGame}
          onFullscreen={handleFullscreen}
          onShare={handleShare}
          onNewGame={onNewGame}
          showGameControls={true}
          isSharing={isSharing}
          isTeacher={isTeacher}
        />
      )}
      
      <div className="flex-1 relative overflow-hidden p-4">
        {gameExpired ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-6 bg-background/90 rounded-xl shadow-lg border border-destructive/30 max-w-md">
              <h3 className="text-xl font-semibold text-center mb-2">Game đã hết hạn</h3>
              <p className="text-muted-foreground text-center">
                Game này không còn khả dụng hoặc đã hết hạn. Vui lòng liên hệ với người tạo game để biết thêm thông tin.
              </p>
            </div>
          </div>
        ) : (
          <GameIframe
            content={miniGame.content}
            title={miniGame.title}
            onLoaded={handleIframeLoaded}
            onError={handleIframeError}
          />
        )}
        
        {extraButton && (
          <div className="absolute bottom-4 right-4 z-10">
            {extraButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGameView;

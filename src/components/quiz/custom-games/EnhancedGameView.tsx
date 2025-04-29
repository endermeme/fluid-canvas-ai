
import React, { useState, useRef } from 'react';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import GameIframe from './components/GameIframe';
import GameLoadingState from './components/GameLoadingState';
import GameErrorState from './components/GameErrorState';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
    animation?: string | string[];
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const { toast } = useToast();

  // Theo dõi số lần thử tải lại iframe
  const maxRetryAttempts = 3;

  useEffect(() => {
    if (gameExpired) {
      setIframeError("Game này đã hết hạn hoặc không còn khả dụng.");
    }
  }, [gameExpired]);

  const refreshGame = () => {
    if (onReload) {
      onReload();
    }
    setIsIframeLoaded(false);
    setIframeError(null);
    setLoadAttempts(0);
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        iframeRef.current.requestFullscreen().catch(err => {
          console.error("Không thể vào chế độ toàn màn hình:", err);
        });
      } else {
        document.exitFullscreen();
      }
    } catch (error) {
      console.error("Lỗi khi chuyển chế độ toàn màn hình:", error);
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
      
      // Sử dụng onShare từ props nếu có, nếu không dùng hàm mặc định
      let url;
      if (onShare) {
        url = await onShare();
      } else {
        url = await saveGameForSharing(
          miniGame.title || 'Game tương tác',
          'custom',
          miniGame,
          miniGame.content
        );
      }
      
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

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  const handleIframeError = (error: string) => {
    setIframeError(error);
    if (loadAttempts < maxRetryAttempts) {
      setLoadAttempts(prev => prev + 1);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col bg-gradient-to-b from-background to-background/95 ${className || ''}`}>
      {!hideHeader && (
        <CustomGameHeader
          onBack={onBack}
          onRefresh={refreshGame}
          onFullscreen={handleFullscreen}
          onShare={handleShare}
          onNewGame={onNewGame}
          showGameControls={true}
          isSharing={isSharing}
          isTeacher={isTeacher}
          gameType={miniGame?.title}
        />
      )}
      
      <div className="flex-1 relative overflow-hidden p-4">
        {iframeError ? (
          <GameErrorState 
            errorMessage={iframeError}
            onRetry={refreshGame}
          />
        ) : (
          <div className="relative w-full h-full">
            <GameIframe
              ref={iframeRef}
              content={miniGame.content}
              title={miniGame.title}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
            
            {!isIframeLoaded && (
              <GameLoadingState 
                loadAttempts={loadAttempts}
                maxAttempts={maxRetryAttempts}
              />
            )}
          </div>
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

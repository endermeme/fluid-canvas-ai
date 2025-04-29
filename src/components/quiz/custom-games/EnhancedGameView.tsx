
import React, { useState } from 'react';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import GameErrorState from './components/GameErrorState';
import GameIframe from './components/GameIframe';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
    animation?: boolean;
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
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const { toast } = useToast();

  // Xử lý lỗi iframe hết hạn
  React.useEffect(() => {
    if (gameExpired) {
      setIframeError("Game này đã hết hạn hoặc không còn khả dụng.");
    }
  }, [gameExpired]);

  const refreshGame = () => {
    if (miniGame?.content) {
      setIsIframeLoaded(false);
      setIframeError(null);
      
      if (onReload) {
        onReload();
      }
    }
  };

  const handleFullscreen = () => {
    // Đã được xử lý trong GameIframe component
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
          <GameIframe 
            content={miniGame.content}
            title={miniGame.title}
            enableAnimation={miniGame.animation !== false}
            onLoad={() => setIsIframeLoaded(true)}
            onError={setIframeError}
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

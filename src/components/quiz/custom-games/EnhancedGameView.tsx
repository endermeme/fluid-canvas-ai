
import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '../utils/iframe-utils';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [showJoinDialog, setShowJoinDialog] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      try {
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
        
        iframeRef.current.onload = () => {
          console.log("Iframe đã được tải xong");
          setIsIframeLoaded(true);
        };
      } catch (error) {
        console.error("Error setting iframe content:", error);
        setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
      }
    }
  }, [miniGame]);

  // Nếu game đã hết hạn, hiển thị thông báo
  useEffect(() => {
    if (gameExpired) {
      setIframeError("Game này đã hết hạn hoặc không còn khả dụng.");
    }
  }, [gameExpired]);

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      try {
        setIsIframeLoaded(false);
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
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
    
    const iframe = iframeRef.current;
    
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error("Không thể vào chế độ toàn màn hình:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleShare = async (): Promise<string | void> => {
    if (onShare) {
      return await onShare();
    }
    
    try {
      setIsSharing(true);
      toast({
        title: "Đang xử lý",
        description: "Đang tạo liên kết chia sẻ...",
      });
      
      const url = await saveGameForSharing(
        miniGame.title || 'Game tương tác',
        'custom',
        { content: miniGame.content },
        miniGame.content,
        'Shared custom game'
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
    <div className={`w-full h-full flex flex-col ${className || ''}`}>
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
        />
      )}
      
      <div className="flex-1 relative overflow-hidden">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
            <p className="text-destructive mb-4">{iframeError}</p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => refreshGame()}
            >
              Tải lại
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-primary font-medium">Đang tải game...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
              title={miniGame.title || "Game tương tác"}
              style={{
                border: 'none',
                display: 'block',
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        )}
        
        {extraButton && (
          <div className="absolute bottom-4 right-4">
            {extraButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGameView;

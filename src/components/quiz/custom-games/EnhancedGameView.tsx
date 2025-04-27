
import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '../utils/iframe-utils';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      try {
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
        
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress > 90) {
            clearInterval(interval);
            progress = 90;
          }
          setLoadingProgress(progress);
        }, 100);

        // Thiết lập message listener để xử lý thông báo từ iframe
        const messageHandler = (event: MessageEvent) => {
          // Kiểm tra nếu tin nhắn từ iframe của chúng ta
          if (event.data && event.data.type === 'GAME_LOADED') {
            console.log('Game loaded message received from iframe');
            clearInterval(interval);
            setLoadingProgress(100);
            setTimeout(() => {
              setIsIframeLoaded(true);
            }, 200);
          }
        };

        window.addEventListener('message', messageHandler);
        
        iframeRef.current.onload = () => {
          console.log('Iframe onload event triggered');
          clearInterval(interval);
          setLoadingProgress(100);
          
          // Đặt timeout để đảm bảo iframe có đủ thời gian để tải
          setTimeout(() => {
            if (!isIframeLoaded) {
              setIsIframeLoaded(true);
            }
          }, 1000);
        };

        // Backup timeout để đảm bảo trường hợp không nhận được message hoặc onload không trigger
        const backupTimeout = setTimeout(() => {
          if (!isIframeLoaded && loadingProgress < 100) {
            console.log('Backup timeout triggered - forcing iframe to display');
            clearInterval(interval);
            setLoadingProgress(100);
            setIsIframeLoaded(true);
          }
        }, 5000);
        
        return () => {
          window.removeEventListener('message', messageHandler);
          clearTimeout(backupTimeout);
          clearInterval(interval);
        };
      } catch (error) {
        console.error("Error setting iframe content:", error);
        setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
      }
    }
  }, [miniGame]);

  useEffect(() => {
    if (gameExpired) {
      setIframeError("Game này đã hết hạn hoặc không còn khả dụng.");
    }
  }, [gameExpired]);

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      try {
        setIsIframeLoaded(false);
        setLoadingProgress(0);
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
          <div className="flex flex-col items-center justify-center h-full">
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lỗi tải game</AlertTitle>
              <AlertDescription>{iframeError}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <Card className="relative w-full h-full overflow-hidden shadow-lg border-primary/10">
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 p-6">
                <div className="w-full max-w-xs space-y-4">
                  <Progress value={loadingProgress} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    Đang tải game... {Math.round(loadingProgress)}%
                  </p>
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
          </Card>
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

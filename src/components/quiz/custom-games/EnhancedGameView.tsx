
import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '../utils/iframe-utils';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';

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
  const [loadingFailed, setLoadingFailed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      try {
        // Reset states when loading new content
        setIsIframeLoaded(false);
        setLoadingProgress(0);
        setLoadingFailed(false);
        
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress > 90) {
            clearInterval(interval);
            progress = 90;
          }
          setLoadingProgress(progress);
        }, 100);
        
        // Set up load and error handlers for iframe
        const iframe = iframeRef.current;
        
        iframe.onload = () => {
          clearInterval(interval);
          setLoadingProgress(100);
          setTimeout(() => {
            setIsIframeLoaded(true);
          }, 200);
        };
        
        iframe.onerror = () => {
          clearInterval(interval);
          setLoadingFailed(true);
          setIframeError("Không thể tải game. Vui lòng thử lại sau.");
        };
        
        // Set a timeout to detect loading failures
        const timeout = setTimeout(() => {
          if (!isIframeLoaded && loadingProgress < 100) {
            setLoadingFailed(true);
            setIframeError("Game không thể tải trong thời gian cho phép. Hãy thử làm mới lại.");
            clearInterval(interval);
          }
        }, 15000); // 15 seconds timeout
        
        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      } catch (error) {
        console.error("Error setting iframe content:", error);
        setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
        setLoadingFailed(true);
      }
    }
  }, [miniGame]);

  useEffect(() => {
    if (gameExpired) {
      setIframeError("Game này đã hết hạn hoặc không còn khả dụng.");
      setLoadingFailed(true);
    }
  }, [gameExpired]);

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      try {
        setIsIframeLoaded(false);
        setLoadingProgress(0);
        setLoadingFailed(false);
        
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
        
        toast({
          title: "Đang làm mới game",
          description: "Game đang được tải lại...",
        });
        
        if (onReload) {
          onReload();
        }
      } catch (error) {
        console.error("Error refreshing game:", error);
        setIframeError("Không thể tải lại game. Vui lòng thử lại.");
        setLoadingFailed(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error("Không thể vào chế độ toàn màn hình:", err);
        toast({
          title: "Lỗi hiển thị",
          description: "Không thể vào chế độ toàn màn hình. Thiết bị của bạn có thể không hỗ trợ tính năng này.",
          variant: "destructive"
        });
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
              <AlertDescription className="mb-4">{iframeError}</AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={refreshGame}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Thử lại
              </Button>
            </Alert>
          </div>
        ) : (
          <Card className="relative w-full h-full overflow-hidden shadow-lg border-primary/10">
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 p-6">
                <div className="w-full max-w-xs space-y-4">
                  <Progress value={loadingProgress} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    {loadingFailed ? (
                      <span className="text-destructive">Đã xảy ra lỗi khi tải game</span>
                    ) : (
                      <>Đang tải game... {Math.round(loadingProgress)}%</>
                    )}
                  </p>
                  
                  {loadingFailed && (
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={refreshGame}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" /> Thử lại
                      </Button>
                    </div>
                  )}
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

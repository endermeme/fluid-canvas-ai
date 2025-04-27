
import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '../utils/iframe-utils';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
  };
  onReload?: () => void;
  className?: string;
  onBack?: () => void;
  hideHeader?: boolean;
  onShare?: () => Promise<string> | void;
  onNewGame?: () => void;
  extraButton?: React.ReactNode;
  isTeacher?: boolean;
  gameExpired?: boolean;
}

// Hàm lưu game trực tiếp trong component thay vì sử dụng file utils riêng
const saveGameForSharing = async (title: string, content: string) => {
  try {
    console.log("Đang lưu game để chia sẻ:", { title });
    
    // Lưu vào bảng games
    const { data: gameEntry, error: gameError } = await supabase
      .from('games')
      .insert([{
        title: title,
        html_content: content,
        game_type: 'custom',
        description: 'Game tương tác tùy chỉnh',
        is_preset: false,
        content_type: 'html',
        expires_at: new Date(Date.now() + (48 * 60 * 60 * 1000)).toISOString() // 48 giờ
      }])
      .select()
      .single();

    if (gameError) throw gameError;

    // Tạo URL chia sẻ
    const shareUrl = `${window.location.origin}/game/${gameEntry.id}`;
    return shareUrl;
  } catch (error) {
    console.error('Lỗi khi lưu game:', error);
    throw error;
  }
};

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
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  const loadingIntervalRef = useRef<number | null>(null);
  
  // Hàm để xóa các timers
  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      try {
        // Reset trạng thái
        setIsIframeLoaded(false);
        setLoadingProgress(0);
        setLoadingFailed(false);
        setLoadingTimedOut(false);
        setIframeError(null);
        
        clearTimers();
        
        // Đảm bảo chỉ truyền 2 tham số đúng với định nghĩa hàm
        const enhancedContent = enhanceIframeContent(
          miniGame.content,
          miniGame.title
        );
        
        iframeRef.current.srcdoc = enhancedContent;
        
        // Giả lập hiển thị tiến trình tải
        let progress = 0;
        loadingIntervalRef.current = window.setInterval(() => {
          progress += Math.random() * 10 + 5;  // Nhanh hơn
          if (progress > 90) {
            clearInterval(loadingIntervalRef.current!);
            progress = 90;
          }
          setLoadingProgress(progress);
        }, 150);
        
        // Thiết lập các xử lý sự kiện cho iframe
        const iframe = iframeRef.current;
        
        iframe.onload = () => {
          clearInterval(loadingIntervalRef.current!);
          setLoadingProgress(100);
          setTimeout(() => {
            setIsIframeLoaded(true);
          }, 200);
          
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        };
        
        iframe.onerror = () => {
          clearInterval(loadingIntervalRef.current!);
          setLoadingFailed(true);
          setIframeError("Không thể tải game. Vui lòng thử lại sau.");
        };
        
        // Thiết lập thời gian chờ để phát hiện lỗi tải - ngắn hơn (10 giây)
        timerRef.current = window.setTimeout(() => {
          if (!isIframeLoaded && loadingProgress < 100) {
            setLoadingFailed(true);
            setLoadingTimedOut(true);
            setIframeError("Game không thể tải trong thời gian cho phép. Hãy thử làm mới lại.");
            clearInterval(loadingIntervalRef.current!);
          }
        }, 10000);
        
        return () => {
          clearTimers();
        };
      } catch (error) {
        console.error("Lỗi khi thiết lập nội dung iframe:", error);
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
    
    return () => {
      clearTimers();
    };
  }, [gameExpired]);

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      try {
        setIsIframeLoaded(false);
        setLoadingProgress(0);
        setLoadingFailed(false);
        setLoadingTimedOut(false);
        
        clearTimers();
        
        // Đảm bảo chỉ truyền 2 tham số đúng với định nghĩa hàm
        const enhancedContent = enhanceIframeContent(
          miniGame.content,
          miniGame.title
        );
        
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
        console.error("Lỗi khi làm mới game:", error);
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

  const handleShare = async () => {
    if (!miniGame?.content) return;
    
    try {
      setIsSharing(true);
      toast({
        title: "Đang xử lý",
        description: "Đang tạo liên kết chia sẻ...",
      });
      
      // Sử dụng hàm trực tiếp trong component thay vì từ file utils
      const url = onShare ? 
        await onShare() : 
        await saveGameForSharing(
          miniGame.title || 'Game tương tác',
          miniGame.content
        );
      
      // Sao chép URL vào clipboard
      if (url) {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Liên kết đã sẵn sàng",
          description: "Đã sao chép đường dẫn vào clipboard.",
        });
      }
      
      setIsSharing(false);
      return url;
    } catch (error) {
      console.error("Lỗi chia sẻ game:", error);
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
              <AlertDescription className="mb-4">
                {iframeError}
                {loadingTimedOut && (
                  <div className="mt-2 text-sm">
                    <p>Nguyên nhân có thể do:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Game quá phức tạp không thể tải kịp thời gian</li>
                      <li>Kết nối mạng không ổn định</li>
                      <li>Thiết bị của bạn không đủ mạnh</li>
                    </ul>
                  </div>
                )}
              </AlertDescription>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshGame}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Thử lại
                </Button>
                {loadingTimedOut && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNewGame}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" /> Tạo game mới
                  </Button>
                )}
              </div>
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

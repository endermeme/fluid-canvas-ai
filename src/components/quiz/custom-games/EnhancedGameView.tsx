
import React, { useState, useEffect } from 'react';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import GameRenderer from '../generator/gameRenderer';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
    html?: string;
    css?: string;
    js?: string;
    rawResponse?: string;
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

// Tách HTML, CSS, JS từ content nếu cần
const extractComponents = (content: string) => {
  const html = content.match(/<body>([\s\S]*?)<\/body>/i)?.[1]?.trim() || content;
  const css = content.match(/<style>([\s\S]*?)<\/style>/i)?.[1]?.trim() || '';
  const js = content.match(/<script>([\s\S]*?)<\/script>/i)?.[1]?.trim() || '';
  
  return { html, css, js };
};

// Hàm lưu game trực tiếp trong component thay vì sử dụng file utils riêng
const saveGameForSharing = async (title: string, html: string, css: string, js: string) => {
  try {
    console.log("Đang lưu game để chia sẻ:", { title });
    
    // Lưu vào bảng games
    const { data: gameEntry, error: gameError } = await supabase
      .from('games')
      .insert([{
        title: title,
        html_content: html,
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();
  const [gameData, setGameData] = useState<{html: string, css: string, js: string}>({
    html: '',
    css: '',
    js: ''
  });
  
  useEffect(() => {
    if (!miniGame) return;
    
    try {
      setIsLoading(true);
      setLoadError(null);
      setLoadingProgress(0);
      
      // Giả lập tiến trình tải
      const loadingInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newValue = prev + Math.random() * 10 + 5;
          return newValue > 90 ? 90 : newValue;
        });
      }, 150);
      
      // Xử lý trích xuất HTML, CSS, JS
      setTimeout(() => {
        try {
          let html = '', css = '', js = '';
          
          if (miniGame.html && miniGame.css && miniGame.js) {
            // Nếu đã có các thành phần riêng biệt
            html = miniGame.html;
            css = miniGame.css;
            js = miniGame.js;
          } else if (miniGame.content) {
            // Nếu chỉ có content, trích xuất các thành phần
            const extracted = extractComponents(miniGame.content);
            html = extracted.html;
            css = extracted.css;
            js = extracted.js;
          }
          
          setGameData({ html, css, js });
          
          // Hoàn thành tải
          clearInterval(loadingInterval);
          setLoadingProgress(100);
          
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
          
        } catch (error) {
          console.error("Lỗi khi xử lý nội dung game:", error);
          setLoadError("Không thể tải nội dung game. Định dạng không hợp lệ.");
          clearInterval(loadingInterval);
          setIsLoading(false);
        }
      }, 800);
      
      return () => {
        clearInterval(loadingInterval);
      };
    } catch (error) {
      console.error("Lỗi khi tải game:", error);
      setLoadError("Không thể tải game. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  }, [miniGame]);
  
  useEffect(() => {
    if (gameExpired) {
      setLoadError("Game này đã hết hạn hoặc không còn khả dụng.");
    }
  }, [gameExpired]);

  const refreshGame = () => {
    if (!miniGame) return;
    
    try {
      setIsLoading(true);
      setLoadError(null);
      setLoadingProgress(0);
      
      // Giả lập tải lại
      setTimeout(() => {
        let html = '', css = '', js = '';
          
        if (miniGame.html && miniGame.css && miniGame.js) {
          html = miniGame.html;
          css = miniGame.css;
          js = miniGame.js;
        } else if (miniGame.content) {
          const extracted = extractComponents(miniGame.content);
          html = extracted.html;
          css = extracted.css;
          js = extracted.js;
        }
        
        setGameData({ html, css, js });
        setLoadingProgress(100);
        
        setTimeout(() => {
          setIsLoading(false);
          toast({
            title: "Game đã được làm mới",
            description: "Game đã được tải lại thành công",
          });
        }, 300);
        
        if (onReload) {
          onReload();
        }
      }, 800);
    } catch (error) {
      console.error("Lỗi khi làm mới game:", error);
      setLoadError("Không thể tải lại game. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  const handleFullscreen = () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;
    
    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen().catch(err => {
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
    if (!miniGame) return "";
    
    try {
      setIsSharing(true);
      toast({
        title: "Đang xử lý",
        description: "Đang tạo liên kết chia sẻ...",
      });
      
      // Sử dụng hàm trực tiếp trong component
      const url = onShare ? 
        await onShare() : 
        await saveGameForSharing(
          miniGame.title || 'Game tương tác',
          gameData.html,
          gameData.css,
          gameData.js
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
      return "";
    }
  };
  
  const toggleDebugInfo = () => {
    setShowDebug(prev => !prev);
    
    if (!showDebug && miniGame) {
      console.log("%c📋 GAME DEBUG INFO:", "background:#673ab7; color:white; padding:5px; border-radius:3px;");
      
      if (miniGame.rawResponse) {
        console.log("%c📄 Raw API Response:", "color:#9c27b0; font-weight:bold;");
        console.log(miniGame.rawResponse);
      }
      
      console.log("%c🔤 HTML:", "color:#e91e63; font-weight:bold;");
      console.log(gameData.html);
      
      console.log("%c🎨 CSS:", "color:#009688; font-weight:bold;");
      console.log(gameData.css);
      
      console.log("%c⚙️ JS:", "color:#ff5722; font-weight:bold;");
      console.log(gameData.js);
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
        {loadError ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lỗi tải game</AlertTitle>
              <AlertDescription className="mb-4">
                {loadError}
                <div className="mt-2 text-sm">
                  <p>Nguyên nhân có thể do:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Game quá phức tạp không thể tải</li>
                    <li>Định dạng game không hợp lệ</li>
                    <li>Thiết bị của bạn không hỗ trợ</li>
                  </ul>
                </div>
              </AlertDescription>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshGame}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Thử lại
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNewGame}
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Tạo game mới
                </Button>
              </div>
            </Alert>
          </div>
        ) : (
          <Card className="relative w-full h-full overflow-hidden shadow-lg border-primary/10">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 p-6">
                <div className="w-full max-w-xs space-y-4">
                  <Progress value={loadingProgress} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    Đang tải game... {Math.round(loadingProgress)}%
                  </p>
                </div>
              </div>
            )}
            
            {!isLoading && !loadError && gameData && (
              <GameRenderer 
                game={{
                  title: miniGame?.title || 'Game tương tác',
                  content: miniGame?.content || '',
                  html: gameData.html,
                  css: gameData.css,
                  js: gameData.js
                }}
                className="w-full h-full"
              />
            )}
          </Card>
        )}
        
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={toggleDebugInfo}
            className="bg-background/80 backdrop-blur-sm"
          >
            {showDebug ? "Ẩn Debug" : "Hiện Debug"}
          </Button>
          {extraButton}
        </div>
      </div>
    </div>
  );
};

export default EnhancedGameView;

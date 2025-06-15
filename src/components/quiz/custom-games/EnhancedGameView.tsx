
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, ArrowLeft, RefreshCw, Maximize } from 'lucide-react';
import GameIframeRenderer from './game-components/GameIframeRenderer';
import { useGameShareManager } from '../hooks/useGameShareManager';
import { enhanceIframeContent } from '../utils/iframe-utils';

interface MiniGame {
  title?: string;
  content: string;
}

interface EnhancedGameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
  hideHeader?: boolean;
  extraButton?: React.ReactNode;
  gameExpired?: boolean;
  isSharedMode?: boolean;
  onQuizScoreSubmit?: (score: number, totalQuestions: number) => Promise<void>;
  onReload?: () => void;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onBack, 
  hideHeader = false, 
  extraButton,
  gameExpired = false,
  isSharedMode = false,
  onQuizScoreSubmit,
  onReload
}) => {
  const { toast } = useToast();
  const { isSharing, handleShare } = useGameShareManager(miniGame, toast);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log("EnhancedGameView props:", { isSharedMode, gameExpired, hasContent: !!miniGame?.content });

  const handleShareGame = async () => {
    try {
      const url = await handleShare();
      if (url) {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Đã sao chép liên kết",
          description: "Liên kết chia sẻ đã được sao chép vào clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể chia sẻ game. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    console.log("Refreshing game...");
    setIsLoading(true);
    setError(null);
    
    if (onReload) {
      onReload();
    }
    
    // Force reload iframe content
    if (iframeRef.current && miniGame.content) {
      loadIframeContent();
    }
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error("Không thể vào chế độ toàn màn hình:", err);
        toast({
          title: "Lỗi toàn màn hình",
          description: "Không thể vào chế độ toàn màn hình.",
          variant: "destructive",
        });
      });
    } else {
      document.exitFullscreen();
    }
  };

  const loadIframeContent = async () => {
    if (!iframeRef.current || !miniGame.content) {
      console.error("Cannot load: iframe ref or content missing");
      setError("Không thể tải game do thiếu nội dung.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Loading enhanced iframe content...");
      setError(null);
      
      const enhancedContent = await enhanceIframeContent(miniGame.content, miniGame.title);
      
      // Add score submission support for shared mode
      let finalContent = enhancedContent;
      if (isSharedMode && onQuizScoreSubmit) {
        console.log("Adding score submission support for shared mode");
        finalContent = enhancedContent.replace(
          '</head>',
          `<script>
            window.submitQuizScore = function(score, totalQuestions) {
              console.log('Submitting quiz score:', { score, totalQuestions });
              window.parent.postMessage({
                type: 'QUIZ_COMPLETED',
                score: score,
                totalQuestions: totalQuestions,
                gameType: 'shared'
              }, '*');
            };
            
            // Auto-detect game completion for memory games
            window.addEventListener('message', function(event) {
              if (event.data.type === 'QUIZ_COMPLETED') {
                console.log('Game completed:', event.data);
                if (window.submitQuizScore) {
                  window.submitQuizScore(event.data.score, event.data.totalQuestions);
                }
              }
            });
          </script></head>`
        );
      }
      
      if (iframeRef.current) {
        iframeRef.current.srcdoc = finalContent;
        
        iframeRef.current.onload = () => {
          console.log("Iframe loaded successfully");
          setIsLoading(false);
        };
        
        iframeRef.current.onerror = () => {
          console.error("Iframe failed to load");
          setError("Không thể tải nội dung game.");
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error("Error loading iframe content:", error);
      setError("Không thể tải nội dung game. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (miniGame?.content) {
      console.log("Content changed, loading iframe...");
      loadIframeContent();
    }
  }, [miniGame?.content, isSharedMode]);

  useEffect(() => {
    if (gameExpired) {
      setError("Game này đã hết hạn hoặc không còn khả dụng.");
      setIsLoading(false);
    }
  }, [gameExpired]);

  useEffect(() => {
    if (isSharedMode && onQuizScoreSubmit) {
      const handleMessage = async (event: MessageEvent) => {
        console.log("Received message:", event.data);
        if (event.data.type === 'QUIZ_COMPLETED') {
          try {
            console.log("Submitting score from shared game:", event.data);
            await onQuizScoreSubmit(event.data.score, event.data.totalQuestions);
            toast({
              title: "Điểm đã được lưu!",
              description: `Bạn đã hoàn thành với ${event.data.score}/${event.data.totalQuestions} điểm.`,
            });
          } catch (error) {
            console.error("Error submitting quiz score:", error);
            toast({
              title: "Lỗi lưu điểm",
              description: "Không thể lưu điểm của bạn.",
              variant: "destructive",
            });
          }
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isSharedMode, onQuizScoreSubmit]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col bg-gray-50">
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </Button>
              )}
              <h1 className="text-lg font-semibold text-gray-900">
                {miniGame.title || 'Game Tương Tác'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Thử lại
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải game</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {!hideHeader && (
        <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">
              {miniGame.title || 'Game Tương Tác'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {extraButton}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFullscreen}
              className="flex items-center gap-2"
            >
              <Maximize className="h-4 w-4" />
              Toàn màn hình
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShareGame}
              disabled={isSharing || gameExpired}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              {isSharing ? 'Đang chia sẻ...' : 'Chia sẻ'}
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải game...</p>
            </div>
          </div>
        )}
        <GameIframeRenderer 
          ref={iframeRef}
          title={miniGame.title || 'Game Tương Tác'}
          isLoaded={!isLoading}
        />
      </div>
    </div>
  );
};

export default EnhancedGameView;

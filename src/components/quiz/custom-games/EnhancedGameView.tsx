
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, ArrowLeft, RefreshCw, Maximize, AlertCircle } from 'lucide-react';
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
  const [retryCount, setRetryCount] = useState(0);
  
  console.log("EnhancedGameView initialized:", { 
    isSharedMode, 
    gameExpired, 
    hasContent: !!miniGame?.content,
    contentLength: miniGame?.content?.length 
  });

  const handleShareGame = async () => {
    try {
      console.log("Starting share process...");
      const url = await handleShare();
      if (url) {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Đã sao chép liên kết",
          description: "Liên kết chia sẻ đã được sao chép vào clipboard.",
        });
        console.log("Share successful:", url);
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
    setRetryCount(prev => prev + 1);
    
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
        console.error("Cannot enter fullscreen:", err);
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
      console.log("Loading iframe content, attempt:", retryCount + 1);
      setError(null);
      
      const enhancedContent = await enhanceIframeContent(miniGame.content, miniGame.title);
      
      // Add comprehensive message handling for shared mode
      let finalContent = enhancedContent;
      if (isSharedMode) {
        console.log("Adding comprehensive shared mode support");
        finalContent = enhancedContent.replace(
          '</head>',
          `<script>
            console.log('Shared mode script loaded');
            
            // Score submission function
            window.submitQuizScore = function(score, totalQuestions, gameType = 'quiz') {
              console.log('Submitting score:', { score, totalQuestions, gameType });
              const data = {
                type: 'QUIZ_COMPLETED',
                score: score,
                totalQuestions: totalQuestions,
                gameType: gameType,
                timestamp: Date.now()
              };
              window.parent.postMessage(data, '*');
              return data;
            };
            
            // Auto-detect various completion patterns
            window.addEventListener('message', function(event) {
              console.log('Iframe received message:', event.data);
              if (event.data && event.data.type === 'QUIZ_COMPLETED') {
                window.submitQuizScore(
                  event.data.score, 
                  event.data.totalQuestions, 
                  event.data.gameType
                );
              }
            });
            
            // Global completion handler
            window.onGameComplete = function(data) {
              console.log('Game completed globally:', data);
              if (data && typeof data.score !== 'undefined') {
                window.submitQuizScore(
                  data.score, 
                  data.totalQuestions || data.total || 10, 
                  data.gameType || 'quiz'
                );
              }
            };
            
            // Monitor for completion indicators
            let completionCheckInterval = setInterval(function() {
              // Check for common completion indicators
              const completionElements = [
                document.querySelector('.game-complete'),
                document.querySelector('.quiz-finished'),
                document.querySelector('.result-screen'),
                document.querySelector('[data-game-complete]')
              ].filter(Boolean);
              
              if (completionElements.length > 0) {
                console.log('Completion element detected');
                // Try to extract score information
                const scoreText = document.body.textContent || '';
                const scoreMatch = scoreText.match(/(\\d+)\\s*\/\\s*(\\d+)/);
                if (scoreMatch) {
                  const score = parseInt(scoreMatch[1]);
                  const total = parseInt(scoreMatch[2]);
                  console.log('Auto-detected score:', score, '/', total);
                  window.submitQuizScore(score, total, 'auto-detected');
                  clearInterval(completionCheckInterval);
                }
              }
            }, 2000);
            
            // Clear interval after 5 minutes
            setTimeout(() => clearInterval(completionCheckInterval), 300000);
          </script></head>`
        );
      }
      
      if (iframeRef.current) {
        console.log("Setting iframe content...");
        iframeRef.current.srcdoc = finalContent;
        
        // Enhanced error handling
        const loadTimeout = setTimeout(() => {
          console.error("Iframe load timeout");
          if (retryCount < 3) {
            setError("Đang tải chậm. Đang thử lại...");
            setTimeout(handleRefresh, 2000);
          } else {
            setError("Không thể tải nội dung game sau nhiều lần thử.");
          }
          setIsLoading(false);
        }, 15000);
        
        iframeRef.current.onload = () => {
          console.log("Iframe loaded successfully");
          clearTimeout(loadTimeout);
          setIsLoading(false);
          setError(null);
        };
        
        iframeRef.current.onerror = (err) => {
          console.error("Iframe failed to load:", err);
          clearTimeout(loadTimeout);
          setError("Lỗi tải nội dung game.");
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
      setRetryCount(0);
      loadIframeContent();
    }
  }, [miniGame?.content, isSharedMode]);

  useEffect(() => {
    if (gameExpired) {
      setError("Game này đã hết hạn hoặc không còn khả dụng.");
      setIsLoading(false);
    }
  }, [gameExpired]);

  // Enhanced message listener for shared mode
  useEffect(() => {
    if (isSharedMode && onQuizScoreSubmit) {
      const handleMessage = async (event: MessageEvent) => {
        console.log("Parent received message:", event.data);
        
        if (event.data && event.data.type === 'QUIZ_COMPLETED') {
          try {
            console.log("Processing quiz completion:", event.data);
            await onQuizScoreSubmit(
              event.data.score || 0, 
              event.data.totalQuestions || event.data.total || 10
            );
            toast({
              title: "Điểm đã được lưu!",
              description: `Bạn đã hoàn thành với ${event.data.score}/${event.data.totalQuestions || event.data.total} điểm.`,
            });
          } catch (error) {
            console.error("Error submitting quiz score:", error);
            toast({
              title: "Lỗi lưu điểm",
              description: "Không thể lưu điểm của bạn. Đã ghi nhận kết quả cục bộ.",
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
                Thử lại ({retryCount}/3)
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải game</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={handleRefresh} className="flex items-center gap-2 w-full">
                <RefreshCw className="h-4 w-4" />
                Thử lại
              </Button>
              {retryCount >= 3 && onReload && (
                <Button onClick={onReload} variant="outline" className="w-full">
                  Tải lại hoàn toàn
                </Button>
              )}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Debug: Retry count: {retryCount}, Shared mode: {isSharedMode ? 'Yes' : 'No'}
            </div>
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
            {isSharedMode && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                Shared Mode
              </span>
            )}
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
              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mt-2">Lần thử: {retryCount}</p>
              )}
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

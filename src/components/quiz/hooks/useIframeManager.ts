
import { useRef, useState, useEffect } from 'react';
import { enhanceIframeContent } from '../utils/iframe-utils';

interface MiniGame {
  title?: string;
  content: string;
}

export const useIframeManager = (
  miniGame: MiniGame, 
  onReload?: () => void, 
  gameExpired?: boolean,
  onScoreUpdate?: (score: number, totalQuestions: number) => void,
  onGameComplete?: (finalScore: number, completionTime: number, extraData?: any) => void,
  onProgressUpdate?: (progress: number, currentLevel: number) => void
) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameProgress, setGameProgress] = useState<number>(0);

  const loadIframeContent = async () => {
    if (!iframeRef.current || !miniGame?.content) {
      console.error("Không thể tải: iframe ref hoặc nội dung không tồn tại");
      setIframeError("Không thể tải game do thiếu nội dung.");
      return;
    }

    try {
      console.log("Đang tải nội dung game...");
      
      const content = await enhanceIframeContent(miniGame.content, miniGame.title);
      if (iframeRef.current) {
        iframeRef.current.srcdoc = content;
      }
      
      // Mô phỏng tiến trình tải đơn giản
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          setIsIframeLoaded(true);
        }
        setLoadingProgress(progress);
      }, 100);

      // Sự kiện khi iframe tải xong
      iframeRef.current.onload = () => {
        clearInterval(interval);
        setLoadingProgress(100);
        setIsIframeLoaded(true);
      };
      
      return () => {
        clearInterval(interval);
      };
    } catch (error) {
      console.error("Error setting iframe content:", error);
      setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
    }
  };

  // Message listener cho score communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data.type) return;
      
      switch (event.data.type) {
        case 'GAME_SCORE_UPDATE':
          const { score, totalQuestions } = event.data.data;
          setGameScore(score);
          onScoreUpdate?.(score, totalQuestions);
          break;
          
        case 'GAME_COMPLETE':
          const { score: finalScore, completionTime, extraData } = event.data.data;
          onGameComplete?.(finalScore, completionTime, extraData);
          break;
          
        case 'GAME_PROGRESS_UPDATE':
          const { progress, currentLevel } = event.data.data;
          setGameProgress(progress);
          onProgressUpdate?.(progress, currentLevel);
          break;
          
        case 'GAME_ERROR':
          const { message } = event.data.data;
          setIframeError(message);
          break;
          
        case 'GAME_LOADED':
          console.log('Game loaded successfully');
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onScoreUpdate, onGameComplete, onProgressUpdate]);

  useEffect(() => {
    if (miniGame?.content) {
      setIsIframeLoaded(false);
      setLoadingProgress(0);
      setIframeError(null);
      setGameScore(0);
      setGameProgress(0);
      loadIframeContent();
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
        setIframeError(null);
        loadIframeContent();
        
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

  return {
    iframeRef,
    iframeError,
    isIframeLoaded,
    loadingProgress,
    gameScore,
    gameProgress,
    refreshGame,
    handleFullscreen
  };
};


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
  onQuizScoreSubmit?: (score: number, totalQuestions: number) => Promise<void>
) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Listen for messages from iframe (for quiz score submission)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'QUIZ_COMPLETED' && onQuizScoreSubmit) {
        try {
          await onQuizScoreSubmit(event.data.score, event.data.totalQuestions);
        } catch (error) {
          console.error('Error submitting quiz score:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onQuizScoreSubmit]);

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

  useEffect(() => {
    if (miniGame?.content) {
      setIsIframeLoaded(false);
      setLoadingProgress(0);
      setIframeError(null);
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
    refreshGame,
    handleFullscreen
  };
};

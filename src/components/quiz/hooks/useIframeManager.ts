
import { useRef, useState, useEffect, useCallback } from 'react';

interface MiniGame {
  title?: string;
  content: string;
}

export const useIframeManager = (
  miniGame: MiniGame,
  onReload?: () => void,
  gameExpired?: boolean
) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxRetryAttempts = 3;

  const refreshGame = useCallback(() => {
    if (onReload) {
      onReload();
    } else {
      setIframeError(null);
      setIsIframeLoaded(false);
      setLoadingProgress(0);
      setLoadAttempts(prev => prev + 1);
      
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.src = 'about:blank';
        
        setTimeout(() => {
          try {
            const blob = new Blob([miniGame.content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            iframe.src = url;
          } catch (error) {
            console.error('Error refreshing game:', error);
            setIframeError('Không thể tải lại game. Vui lòng thử lại.');
          }
        }, 100);
      }
    }
  }, [onReload, miniGame.content]);

  const handleFullscreen = useCallback(() => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    if (!miniGame.content || gameExpired) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    setIframeError(null);
    setIsIframeLoaded(false);
    setLoadingProgress(10);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    const loadTimeout = setTimeout(() => {
      if (!isIframeLoaded) {
        clearInterval(progressInterval);
        setIframeError('Game tải quá lâu. Vui lòng thử lại.');
        setLoadingProgress(0);
      }
    }, 15000);

    const handleIframeLoad = () => {
      clearInterval(progressInterval);
      clearTimeout(loadTimeout);
      setLoadingProgress(100);
      setTimeout(() => {
        setIsIframeLoaded(true);
      }, 500);
    };

    const handleIframeError = () => {
      clearInterval(progressInterval);
      clearTimeout(loadTimeout);
      setIframeError('Không thể tải game. Vui lòng thử lại.');
      setLoadingProgress(0);
    };

    iframe.addEventListener('load', handleIframeLoad);
    iframe.addEventListener('error', handleIframeError);

    try {
      const blob = new Blob([miniGame.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframe.src = url;

      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
        iframe.removeEventListener('error', handleIframeError);
        clearInterval(progressInterval);
        clearTimeout(loadTimeout);
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('Error loading game content:', error);
      setIframeError('Lỗi khi tải nội dung game.');
      clearInterval(progressInterval);
      clearTimeout(loadTimeout);
    }
  }, [miniGame.content, gameExpired, isIframeLoaded]);

  return {
    iframeRef,
    iframeError,
    isIframeLoaded,
    loadingProgress,
    loadAttempts,
    maxRetryAttempts,
    refreshGame,
    handleFullscreen
  };
};

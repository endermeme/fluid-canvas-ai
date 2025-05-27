
import { useRef, useState, useEffect, useCallback } from 'react';
import { enhanceIframeContent } from '@/components/quiz/utils/iframe-utils';

interface MiniGame {
  title?: string;
  content: string;
}

export const useIframeManager = (
  miniGame: MiniGame | null,
  onReload?: () => void,
  gameExpired?: boolean
) => {
  const iframeRef = useRef<HTMLIFrameElement & { updateContent?: (content: string) => Promise<void> }>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxRetryAttempts = 3;

  const loadGameContent = useCallback(async () => {
    if (!miniGame?.content || !iframeRef.current) {
      console.log('🎮 No content or iframe ref available');
      return;
    }

    try {
      console.log('🎮 Loading game content:', {
        contentLength: miniGame.content.length,
        title: miniGame.title,
        attempt: loadAttempts + 1
      });

      setIframeError(null);
      setIsIframeLoaded(false);
      setLoadingProgress(20);

      // Enhance content
      const enhancedContent = await enhanceIframeContent(miniGame.content, miniGame.title);
      setLoadingProgress(60);

      console.log('🎮 Content enhanced:', {
        originalLength: miniGame.content.length,
        enhancedLength: enhancedContent.length,
        hasDoctype: enhancedContent.includes('<!DOCTYPE')
      });

      // Update iframe
      if (iframeRef.current.updateContent) {
        await iframeRef.current.updateContent(enhancedContent);
      } else {
        iframeRef.current.srcdoc = enhancedContent;
      }

      setLoadingProgress(80);

      // Set up load detection
      const iframe = iframeRef.current;
      
      const handleLoad = () => {
        console.log('🎮 Iframe load event fired');
        setLoadingProgress(100);
        setIsIframeLoaded(true);
        setIframeError(null);
      };

      const handleError = (error: any) => {
        console.error('🎮 Iframe error:', error);
        setIframeError('Lỗi tải game. Vui lòng thử lại.');
        setIsIframeLoaded(false);
      };

      iframe.onload = handleLoad;
      iframe.onerror = handleError;

      // Timeout fallback
      setTimeout(() => {
        if (!isIframeLoaded) {
          console.log('🎮 Iframe load timeout, assuming loaded');
          setIsIframeLoaded(true);
          setLoadingProgress(100);
        }
      }, 5000);

    } catch (error) {
      console.error('🎮 Error loading game content:', error);
      setIframeError(`Lỗi tải game: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsIframeLoaded(false);
    }
  }, [miniGame, loadAttempts, isIframeLoaded]);

  const refreshGame = useCallback(async () => {
    console.log('🎮 Refreshing game...');
    
    if (loadAttempts < maxRetryAttempts) {
      setLoadAttempts(prev => prev + 1);
      setLoadingProgress(0);
      await loadGameContent();
    } else if (onReload) {
      console.log('🎮 Max attempts reached, calling onReload');
      onReload();
    } else {
      setIframeError('Không thể tải game sau nhiều lần thử. Vui lòng tạo game mới.');
    }
  }, [loadAttempts, maxRetryAttempts, loadGameContent, onReload]);

  const handleFullscreen = useCallback(() => {
    if (iframeRef.current) {
      try {
        if (iframeRef.current.requestFullscreen) {
          iframeRef.current.requestFullscreen();
        }
      } catch (error) {
        console.warn('🎮 Fullscreen not supported:', error);
      }
    }
  }, []);

  // Load content when miniGame changes
  useEffect(() => {
    if (miniGame?.content) {
      setLoadAttempts(0);
      loadGameContent();
    }
  }, [miniGame?.content, miniGame?.title]);

  // Handle game expiration
  useEffect(() => {
    if (gameExpired) {
      setIframeError('Game đã hết hạn. Vui lòng tạo game mới.');
      setIsIframeLoaded(false);
    }
  }, [gameExpired]);

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

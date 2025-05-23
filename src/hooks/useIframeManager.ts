import { useRef, useState, useEffect } from 'react';
import { enhanceIframeContent } from '@/lib/iframe-utils';

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
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxRetryAttempts = 3;

  const loadIframeContent = async () => {
    if (!iframeRef.current || !miniGame?.content) return;

    try {
      console.log("Đang cố gắng tải nội dung game...");
      const enhancedContent = await enhanceIframeContent(miniGame.content, miniGame.title);
      if (iframeRef.current) {
        iframeRef.current.srcdoc = enhancedContent;
      }
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
        }, 800); // Tăng thời gian chờ
      };

      // Backup timeout để đảm bảo trường hợp không nhận được message hoặc onload không trigger
      const backupTimeout = setTimeout(() => {
        if (!isIframeLoaded) {
          console.log('Backup timeout triggered - forcing iframe to display');
          clearInterval(interval);
          setLoadingProgress(100);
          setIsIframeLoaded(true);
          
          // Kiểm tra xem iframe có nội dung không
          try {
            if (iframeRef.current) {
              const iframeDoc = iframeRef.current.contentDocument || 
                (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
                
              if (!iframeDoc || !iframeDoc.body || !iframeDoc.body.innerHTML || 
                  iframeDoc.body.innerHTML.trim() === '') {
                console.log('Iframe content appears empty, attempting retry');
                if (loadAttempts < maxRetryAttempts) {
                  setLoadAttempts(prev => prev + 1);
                  setTimeout(() => loadIframeContent(), 1000); // Thử lại sau 1 giây
                } else {
                  setIframeError("Game không thể tải được. Vui lòng thử làm mới.");
                }
              }
            }
          } catch (e) {
            console.error("Lỗi khi kiểm tra nội dung iframe:", e);
          }
        }
      }, 3000); // Giảm thời gian timeout để phát hiện sớm hơn
      
      return () => {
        window.removeEventListener('message', messageHandler);
        clearTimeout(backupTimeout);
        clearInterval(interval);
      };
    } catch (error) {
      console.error("Error setting iframe content:", error);
      setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadIframeContent();
  }, [miniGame, loadAttempts]);

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
        setLoadAttempts(0); // Reset số lần thử tải lại
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
    loadAttempts,
    maxRetryAttempts,
    refreshGame,
    handleFullscreen
  };
};

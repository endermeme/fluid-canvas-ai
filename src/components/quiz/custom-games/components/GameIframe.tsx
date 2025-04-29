
import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '../../utils/iframe-utils';
import { enhanceAnimations } from '../../utils/enhanceAnimation';
import { Card } from "@/components/ui/card";
import GameLoadingState from './GameLoadingState';

interface GameIframeProps {
  content: string;
  title?: string;
  enableAnimation?: boolean;
  onLoad: () => void;
  onError: (message: string) => void;
}

const GameIframe: React.FC<GameIframeProps> = ({ 
  content, 
  title = "Game tương tác",
  enableAnimation = true,
  onLoad,
  onError
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  const maxRetryAttempts = 3;

  const loadIframeContent = async () => {
    if (!iframeRef.current || !content) return;

    try {
      console.log("Đang cố gắng tải nội dung game...");
      let enhancedContent = await enhanceIframeContent(content, title);
      
      // Thêm hỗ trợ animation nếu cần
      if (enableAnimation) {
        enhancedContent = enhanceAnimations(enhancedContent);
      }

      if (iframeRef.current) {
        // Sử dụng srcdoc để hỗ trợ tốt hơn cho các animations
        iframeRef.current.srcdoc = enhancedContent;
      }
      
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
            setIsLoaded(true);
            onLoad();
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
          if (!isLoaded) {
            setIsLoaded(true);
            onLoad();
          }
        }, 800);
      };

      // Backup timeout để đảm bảo trường hợp không nhận được message hoặc onload không trigger
      const backupTimeout = setTimeout(() => {
        if (!isLoaded) {
          console.log('Backup timeout triggered - forcing iframe to display');
          clearInterval(interval);
          setLoadingProgress(100);
          setIsLoaded(true);
          onLoad();
          
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
                  onError("Game không thể tải được. Vui lòng thử làm mới.");
                }
              }
            }
          } catch (e) {
            console.error("Lỗi khi kiểm tra nội dung iframe:", e);
          }
        }
      }, 3000);
      
      return () => {
        window.removeEventListener('message', messageHandler);
        clearTimeout(backupTimeout);
        clearInterval(interval);
      };
    } catch (error) {
      console.error("Error setting iframe content:", error);
      onError("Không thể tải nội dung game. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadIframeContent();
  }, [content, loadAttempts]);

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

  return (
    <Card className="relative w-full h-full overflow-hidden shadow-lg border-primary/10">
      {!isLoaded && (
        <GameLoadingState 
          progress={loadingProgress} 
          loadAttempts={loadAttempts}
          maxRetryAttempts={maxRetryAttempts}
        />
      )}
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-presentation"
        allowFullScreen
        title={title}
        style={{
          border: 'none',
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff'
        }}
      />
    </Card>
  );
};

export default GameIframe;

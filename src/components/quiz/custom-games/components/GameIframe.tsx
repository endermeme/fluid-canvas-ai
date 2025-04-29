
import React, { useRef, useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { enhanceIframeContent } from '../../utils/iframe-utils';

interface GameIframeProps {
  content: string;
  title?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const GameIframe: React.FC<GameIframeProps> = ({
  content,
  title,
  onLoad,
  onError,
  className = ''
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadAttemptsRef = useRef(0);
  const maxRetryAttempts = 3;

  const loadIframeContent = async () => {
    if (!iframeRef.current || !content) return;

    try {
      console.log("GameIframe: Chuẩn bị tải nội dung game...");
      const enhancedContent = await enhanceIframeContent(content, title);
      
      if (iframeRef.current) {
        iframeRef.current.srcdoc = enhancedContent;
      }

      // Thiết lập message listener để xử lý thông báo từ iframe
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'GAME_LOADED') {
          console.log('GameIframe: Nhận được thông báo game đã tải xong');
          setIsLoading(false);
          if (onLoad) onLoad();
        }
      };

      window.addEventListener('message', messageHandler);
      
      // Sự kiện onload của iframe
      if (iframeRef.current) {
        iframeRef.current.onload = () => {
          console.log('GameIframe: Sự kiện onload được kích hoạt');
          
          // Kiểm tra xem iframe có nội dung không
          try {
            const iframeDoc = iframeRef.current?.contentDocument || 
              (iframeRef.current?.contentWindow && iframeRef.current.contentWindow.document);
              
            if (!iframeDoc || !iframeDoc.body || !iframeDoc.body.innerHTML || 
                iframeDoc.body.innerHTML.trim() === '') {
              console.warn('GameIframe: Iframe không có nội dung HTML sau khi tải');
              
              if (loadAttemptsRef.current < maxRetryAttempts) {
                loadAttemptsRef.current += 1;
                console.log(`GameIframe: Thử tải lại lần ${loadAttemptsRef.current}/${maxRetryAttempts}`);
                setTimeout(loadIframeContent, 500);
                return;
              } else if (onError) {
                onError("Không thể tải nội dung game sau nhiều lần thử");
              }
            }
          } catch (e) {
            console.error("GameIframe: Lỗi khi kiểm tra nội dung iframe:", e);
          }
          
          // Nếu sau 800ms vẫn không nhận được thông báo GAME_LOADED, cũng coi như đã tải xong
          setTimeout(() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }, 800);
        };
      }

      // Backup timeout để đảm bảo trạng thái luôn được cập nhật
      const backupTimeout = setTimeout(() => {
        if (isLoading) {
          console.log('GameIframe: Timeout - Đánh dấu game đã tải xong');
          setIsLoading(false);
          if (onLoad) onLoad();
          
          // Kiểm tra nội dung iframe một lần nữa
          try {
            const iframeDoc = iframeRef.current?.contentDocument || 
              (iframeRef.current?.contentWindow && iframeRef.current.contentWindow.document);
              
            if (!iframeDoc || !iframeDoc.body || !iframeDoc.body.innerHTML || 
                iframeDoc.body.innerHTML.trim() === '') {
              console.warn('GameIframe: Iframe có vẻ không có nội dung sau timeout');
              
              if (loadAttemptsRef.current < maxRetryAttempts) {
                loadAttemptsRef.current += 1;
                console.log(`GameIframe: Thử tải lại sau timeout lần ${loadAttemptsRef.current}/${maxRetryAttempts}`);
                setTimeout(loadIframeContent, 500);
              } else if (onError) {
                onError("Không thể tải nội dung game sau nhiều lần thử");
              }
            }
          } catch (e) {
            console.error("GameIframe: Lỗi khi kiểm tra nội dung iframe sau timeout:", e);
          }
        }
      }, 3000);
      
      return () => {
        window.removeEventListener('message', messageHandler);
        clearTimeout(backupTimeout);
      };
    } catch (error) {
      console.error("GameIframe: Lỗi khi thiết lập nội dung iframe:", error);
      if (onError) {
        onError("Không thể tải nội dung game");
      }
    }
  };

  useEffect(() => {
    loadAttemptsRef.current = 0;
    setIsLoading(true);
    loadIframeContent();
  }, [content, title]);

  return (
    <Card className={`w-full h-full overflow-hidden border-primary/10 ${className}`}>
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        title={title || "Trò chơi tương tác"}
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

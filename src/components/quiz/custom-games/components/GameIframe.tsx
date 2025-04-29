
import React, { useEffect, useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { enhanceIframeContent } from '../../utils/iframe-utils';

interface GameIframeProps {
  content: string;
  title?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  className?: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

const GameIframe: React.FC<GameIframeProps> = ({
  content,
  title,
  onLoad,
  onError,
  className = '',
  iframeRef
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadAttemptsRef = useRef(0);
  const maxRetryAttempts = 3;
  const timeoutRef = useRef<number | null>(null);
  const messageListenerRef = useRef<(event: MessageEvent) => void | null>(null);

  const loadIframeContent = async () => {
    if (!iframeRef.current || !content) return;

    try {
      console.log("GameIframe: Chuẩn bị tải nội dung game...");
      const enhancedContent = await enhanceIframeContent(content, title);
      
      if (iframeRef.current) {
        iframeRef.current.srcdoc = enhancedContent;
      }

      // Xóa các event listener cũ nếu có
      if (messageListenerRef.current) {
        window.removeEventListener('message', messageListenerRef.current);
      }

      // Thiết lập message listener để xử lý thông báo từ iframe
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'GAME_LOADED') {
          console.log('GameIframe: Nhận được thông báo game đã tải xong');
          setIsLoading(false);
          if (onLoad) onLoad();
          
          // Xóa timeout nếu đã nhận được thông báo thành công
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      };

      messageListenerRef.current = messageHandler;
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
                setTimeout(loadIframeContent, 800);
                return;
              } else if (onError) {
                onError("Không thể tải nội dung game sau nhiều lần thử");
              }
            } else {
              // Kiểm tra nếu body chỉ chứa thông báo lỗi
              const bodyText = iframeDoc.body.textContent || '';
              if (bodyText.includes('Error:') || bodyText.includes('Lỗi:')) {
                console.error('GameIframe: Phát hiện thông báo lỗi trong iframe:', bodyText);
                if (onError) {
                  onError("Phát hiện lỗi trong nội dung game");
                }
                return;
              }
              
              // Thử thêm một script vào iframe để thông báo đã load
              try {
                const script = iframeDoc.createElement('script');
                script.textContent = `
                  try {
                    if (window.parent && window.parent !== window) {
                      window.parent.postMessage({ type: 'GAME_LOADED', success: true, source: 'injected' }, '*');
                    }
                  } catch(e) { console.error('Error sending message:', e); }
                `;
                iframeDoc.body.appendChild(script);
              } catch (scriptError) {
                console.warn('GameIframe: Không thể inject script:', scriptError);
              }
            }
          } catch (e) {
            console.error("GameIframe: Lỗi khi kiểm tra nội dung iframe:", e);
          }
          
          // Nếu sau 1000ms vẫn không nhận được thông báo GAME_LOADED, cũng coi như đã tải xong
          timeoutRef.current = window.setTimeout(() => {
            setIsLoading(false);
            if (onLoad) onLoad();
            timeoutRef.current = null;
          }, 1000) as unknown as number;
        };
      }

      // Backup timeout để đảm bảo trạng thái luôn được cập nhật
      timeoutRef.current = window.setTimeout(() => {
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
                setTimeout(loadIframeContent, 800);
              } else if (onError) {
                onError("Không thể tải nội dung game sau nhiều lần thử");
              }
            }
          } catch (e) {
            console.error("GameIframe: Lỗi khi kiểm tra nội dung iframe sau timeout:", e);
          }
        }
        timeoutRef.current = null;
      }, 4000) as unknown as number;
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
    
    // Cleanup function
    return () => {
      if (messageListenerRef.current) {
        window.removeEventListener('message', messageListenerRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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


import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '../../utils/iframe-utils';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GameIframeProps {
  content: string;
  title?: string;
  onLoaded?: () => void;
  onError?: (error: string) => void;
}

const GameIframe: React.FC<GameIframeProps> = ({ 
  content, 
  title = 'Interactive Game',
  onLoaded,
  onError
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const maxRetryAttempts = 3;

  const loadIframeContent = async () => {
    if (!iframeRef.current || !content) return;

    try {
      console.log("Đang cố gắng tải nội dung game...");
      const enhancedContent = await enhanceIframeContent(content, title);
      
      if (iframeRef.current) {
        iframeRef.current.srcdoc = enhancedContent;
      }
      setError(null);
      
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
            if (onLoaded) onLoaded();
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
            if (onLoaded) onLoaded();
          }
        }, 800); // Tăng thời gian chờ
      };

      // Backup timeout để đảm bảo trường hợp không nhận được message hoặc onload không trigger
      const backupTimeout = setTimeout(() => {
        if (!isLoaded) {
          console.log('Backup timeout triggered - forcing iframe to display');
          clearInterval(interval);
          setLoadingProgress(100);
          setIsLoaded(true);
          if (onLoaded) onLoaded();
          
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
                  const errorMessage = "Game không thể tải được. Vui lòng thử làm mới.";
                  setError(errorMessage);
                  if (onError) onError(errorMessage);
                }
              }
            }
          } catch (e) {
            console.error("Lỗi khi kiểm tra nội dung iframe:", e);
            const errorMessage = "Không thể tải nội dung game. Vui lòng thử lại.";
            setError(errorMessage);
            if (onError) onError(errorMessage);
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
      const errorMessage = "Không thể tải nội dung game. Vui lòng thử lại.";
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  useEffect(() => {
    loadIframeContent();
  }, [content, loadAttempts]);

  const handleRefresh = () => {
    setIsLoaded(false);
    setLoadingProgress(0);
    setLoadAttempts(0);
    loadIframeContent();
  };

  return (
    <Card className="relative w-full h-full overflow-hidden shadow-lg border-primary/10">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 p-6">
          <div className="w-full max-w-xs space-y-4">
            <Progress value={loadingProgress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              Đang tải game... {Math.round(loadingProgress)}%
            </p>
            {loadAttempts > 0 && (
              <p className="text-center text-xs text-amber-500">
                Đang thử lại lần {loadAttempts}/{maxRetryAttempts}...
              </p>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Lỗi tải game</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <button 
                  onClick={handleRefresh}
                  className="text-sm font-medium underline cursor-pointer hover:text-primary"
                >
                  Thử tải lại
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
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

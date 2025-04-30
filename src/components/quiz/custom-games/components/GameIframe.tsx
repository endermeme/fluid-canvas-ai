
import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '../../utils/iframe-utils';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
  const [isCheckingContent, setIsCheckingContent] = useState(false);

  const maxRetryAttempts = 5; // Tăng số lần thử lại lên 5

  // Kiểm tra xem nội dung iframe có tải thành công hay không
  const checkIframeContent = () => {
    if (!iframeRef.current) return false;

    try {
      setIsCheckingContent(true);
      const iframeDoc = iframeRef.current.contentDocument || 
        (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
      
      // Kiểm tra nội dung có tồn tại không
      if (!iframeDoc || !iframeDoc.body) {
        console.error('Iframe không có nội dung');
        return false;
      }
      
      // Kiểm tra nếu nội dung là trống hoặc chỉ có trống trắng
      const contentText = iframeDoc.body.innerText || '';
      const contentHTML = iframeDoc.body.innerHTML || '';
      
      if (contentText.trim() === '' && 
          (contentHTML.trim() === '' || contentHTML.trim() === '<div></div>' || contentHTML.trim().includes('Không thể tải nội dung'))) {
        console.error('Iframe có nội dung nhưng rỗng', contentHTML);
        return false;
      }
      
      return true;
    } catch (e) {
      console.error("Lỗi khi kiểm tra nội dung iframe:", e);
      return false;
    } finally {
      setIsCheckingContent(false);
    }
  };

  const loadIframeContent = async () => {
    if (!iframeRef.current || !content) return;

    try {
      console.log(`Đang tải game... (lần thử ${loadAttempts + 1}/${maxRetryAttempts})`);
      const enhancedContent = await enhanceIframeContent(content, title);
      
      if (iframeRef.current) {
        // Thêm timestamp để tránh cache
        iframeRef.current.srcdoc = enhancedContent + `<!-- ${Date.now()} -->`;
      }
      setError(null);
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) {
          clearInterval(interval);
          progress = 90;
        }
        setLoadingProgress(progress);
      }, 100);

      // Thiết lập message listener để xử lý thông báo từ iframe
      const messageHandler = (event: MessageEvent) => {
        // Kiểm tra nếu tin nhắn từ iframe của chúng ta
        if (event.data && typeof event.data === 'object') {
          if (event.data.type === 'GAME_LOADED') {
            console.log('Game loaded message received from iframe', event.data.source || 'unknown');
            clearInterval(interval);
            setLoadingProgress(100);
            setTimeout(() => {
              if (checkIframeContent()) {
                setIsLoaded(true);
                if (onLoaded) onLoaded();
              } else {
                handleLoadFailure("Nội dung game trống hoặc không hợp lệ");
              }
            }, 200);
          } else if (event.data.type === 'GAME_ERROR') {
            console.error('Game error received from iframe:', event.data.error);
            const errorMessage = event.data.error?.message || "Lỗi không xác định trong game";
            handleLoadFailure(errorMessage);
          }
        }
      };

      window.addEventListener('message', messageHandler);
      
      iframeRef.current.onload = () => {
        console.log('Iframe onload event triggered');
        clearInterval(interval);
        setLoadingProgress(95);
        
        // Đợi một chút để iframe có thời gian render nội dung
        setTimeout(() => {
          if (checkIframeContent()) {
            setLoadingProgress(100);
            setTimeout(() => {
              setIsLoaded(true);
              if (onLoaded) onLoaded();
            }, 200);
          } else {
            // Nếu nội dung không tồn tại hoặc trống, thử lại
            handleLoadFailure("Không thể xác minh nội dung game");
          }
        }, 1000);
      };

      // Backup timeout với thời gian dài hơn
      const backupTimeout = setTimeout(() => {
        if (!isLoaded) {
          console.log('Backup timeout triggered - kiểm tra iframe');
          clearInterval(interval);
          setLoadingProgress(96);
          
          if (checkIframeContent()) {
            setLoadingProgress(100);
            setIsLoaded(true);
            if (onLoaded) onLoaded();
            console.log('Nội dung iframe hợp lệ qua kiểm tra backup');
          } else {
            handleLoadFailure("Hết thời gian chờ tải game");
          }
        }
      }, 5000); // Tăng thời gian timeout lên 5 giây
      
      return () => {
        window.removeEventListener('message', messageHandler);
        clearTimeout(backupTimeout);
        clearInterval(interval);
      };
    } catch (error) {
      console.error("Error setting iframe content:", error);
      handleLoadFailure(`Lỗi khi tải nội dung game: ${error instanceof Error ? error.message : 'Không xác định'}`);
    }
  };

  const handleLoadFailure = (errorMessage: string) => {
    console.warn(`Lỗi tải game (lần ${loadAttempts + 1}/${maxRetryAttempts}): ${errorMessage}`);
    
    if (loadAttempts < maxRetryAttempts - 1) {
      // Thử lại tự động sau một khoảng thời gian
      setLoadingProgress(30 + loadAttempts * 10); // Đặt tiến độ về 30-70% tùy theo số lần thử
      setLoadAttempts(prev => prev + 1);
      setTimeout(() => loadIframeContent(), 1000 * (loadAttempts + 1)); // Tăng thời gian chờ giữa các lần thử
    } else {
      // Đã hết số lần thử, hiển thị lỗi
      const finalError = "Không thể tải nội dung game sau nhiều lần thử. Vui lòng kiểm tra kết nối mạng và thử lại.";
      setError(finalError);
      if (onError) onError(finalError);
    }
  };

  useEffect(() => {
    // Reset state khi content thay đổi
    if (content) {
      setIsLoaded(false);
      setLoadingProgress(0);
      setError(null);
      setLoadAttempts(0);
      loadIframeContent();
    }
  }, [content]);

  const handleRefresh = () => {
    setIsLoaded(false);
    setLoadingProgress(0);
    setError(null);
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
              {loadAttempts > 0 && ` (lần thử ${loadAttempts + 1}/${maxRetryAttempts})`}
            </p>
            
            {loadAttempts > 0 && loadAttempts < maxRetryAttempts && (
              <p className="text-center text-xs text-amber-500">
                Kết nối không ổn định, đang thử lại...
              </p>
            )}
            
            {isCheckingContent && (
              <p className="text-center text-xs text-blue-500">
                Đang kiểm tra tính toàn vẹn nội dung...
              </p>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/95 p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Lỗi tải game</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Thử lại
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    // Tải lại toàn bộ trang
                    window.location.reload();
                  }}
                >
                  Tải lại trang
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                <p>Gợi ý: Nếu bạn gặp lỗi này nhiều lần, hãy thử:</p>
                <ul className="list-disc list-inside pl-2 mt-1">
                  <li>Kiểm tra kết nối mạng</li>
                  <li>Dùng trình duyệt Chrome hoặc Edge mới nhất</li>
                  <li>Đóng các ứng dụng khác để giải phóng bộ nhớ</li>
                  <li>Tạo game đơn giản hơn</li>
                </ul>
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
      
      {/* Thêm lớp phủ tĩnh để bắt và ngăn click events khi đang tải */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-transparent z-5" 
          onClick={(e) => e.preventDefault()}
        />
      )}
    </Card>
  );
};

export default GameIframe;

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Maximize, ArrowLeft, Share2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
  };
  onBack?: () => void;
  onNewGame?: () => void;
  onShare?: () => void;
  extraButton?: React.ReactNode;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onBack,
  onNewGame,
  onShare,
  extraButton
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState<string | null>(null);

  const sanitizeContent = (content: string) => {
    // Xóa bỏ các khối code block của markdown nếu có
    let processedContent = content.replace(/```html|```/g, '').trim();
    
    // Đảm bảo có cấu trúc HTML đầy đủ
    if (!processedContent.includes('<!DOCTYPE html>')) {
      processedContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${miniGame.title || 'Interactive Game'}</title></head><body>${processedContent}</body></html>`;
    }
    
    // Thêm CSS cơ bản để cải thiện hiển thị
    const basicCSS = `
      <style>
        body { 
          font-family: Arial, sans-serif; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 100vh; 
          margin: 0; 
          background-color: #f0f0f0; 
        }
        canvas, #game-container { 
          max-width: 100%; 
          max-height: 100%; 
        }
      </style>
    `;
    
    // Chèn CSS vào HTML
    processedContent = processedContent.replace('</head>', `${basicCSS}</head>`);
    
    return processedContent;
  };

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      try {
        const enhancedContent = sanitizeContent(miniGame.content);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
      } catch (error) {
        console.error("Error setting iframe content:", error);
        setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
      }
    }
  }, [miniGame]);

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      try {
        const enhancedContent = sanitizeContent(miniGame.content);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
      } catch (error) {
        console.error("Error refreshing game:", error);
        setIframeError("Không thể tải lại game. Vui lòng thử lại.");
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (!document.fullscreenElement) {
        iframeRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-2 bg-background/80 backdrop-blur-md border-b border-primary/10 z-10">
        <div className="flex items-center">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="gap-1 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Quay lại
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-1.5">
          {extraButton}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshGame} 
            className="w-8 h-8 p-0"
            title="Tải lại"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen} 
            className="w-8 h-8 p-0"
            title="Toàn màn hình"
          >
            <Maximize className="h-3.5 w-3.5" />
          </Button>
          
          {onNewGame && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNewGame} 
              className="ml-1 text-xs"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Game mới
            </Button>
          )}
          
          {onShare && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={onShare} 
              className="ml-1 text-xs"
            >
              <Share2 className="h-3.5 w-3.5 mr-1" />
              Chia sẻ
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
            <p className="text-destructive mb-4">{iframeError}</p>
            <Button 
              variant="outline" 
              onClick={refreshGame}
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Tải lại
            </Button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            title={miniGame.title || "Minigame"}
            style={{
              border: 'none',
              display: 'block',
              width: '100%',
              height: '100%'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedGameView;

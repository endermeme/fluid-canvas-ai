
import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { enhanceIframeContent } from '../custom-games/utils/iframe-utils';

interface GameContainerProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  content: string;
  title?: string;
  error?: string | null;
  onReload: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({
  iframeRef,
  content,
  title,
  error: externalError,
  onReload
}) => {
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    if (externalError) {
      setLocalError(externalError);
    }
  }, [externalError]);

  const formattedContent = content ? enhanceIframeContent(content, title) : '';
  
  const handleReload = () => {
    setLoading(true);
    setLocalError(null);
    setKey(prev => prev + 1);
    onReload();
  };

  const toggleFullscreen = () => {
    setShowFullscreen(prev => !prev);
  };
  
  return (
    <div className="flex flex-col h-screen w-screen fixed inset-0 bg-background">
      <div 
        className={`relative flex-1 bg-gradient-to-b from-background/50 to-background border-t border-border/50 w-full transition-all duration-300`}
      >
        {!!localError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 p-8 z-20">
            <div className="flex items-center gap-2 text-red-500 font-bold text-xl mb-4">
              <AlertTriangle size={24} />
              <span>Rất tiếc, có lỗi xảy ra!</span>
            </div>
            <div className="text-gray-700 mb-6 text-center max-w-md">{localError}</div>
            <button 
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition flex items-center gap-2"
              onClick={handleReload}
            >
              <RefreshCw size={18} className="animate-spin-slow" />
              <span>Tải lại game</span>
            </button>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 z-10">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-4 border-primary mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-background"></div>
              </div>
            </div>
            <div className="text-foreground text-lg font-medium mt-4">Đang tải game...</div>
            <div className="text-muted-foreground text-sm mt-2">Vui lòng đợi một chút</div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          key={key}
          title={title || "Game"}
          srcDoc={formattedContent}
          className="w-full h-full border-0 bg-background"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLocalError("Không thể tải nội dung game. Vui lòng thử lại sau.");
            setLoading(false);
          }}
          style={{
            width: '100%',
            height: '100%',
            display: loading ? 'none' : 'block',
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </div>
    </div>
  );
};

export default GameContainer;

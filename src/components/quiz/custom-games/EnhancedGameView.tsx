
import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from './utils/iframe-utils';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
  };
  onReload?: () => void;
  className?: string;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onReload,
  className
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      try {
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
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
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
        
        if (onReload) {
          onReload();
        }
      } catch (error) {
        console.error("Error refreshing game:", error);
        setIframeError("Không thể tải lại game. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${className || ''}`}>      
      <div className="flex-1 relative overflow-hidden">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
            <p className="text-destructive mb-4">{iframeError}</p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={refreshGame}
            >
              Tải lại
            </button>
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

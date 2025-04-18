
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { enhanceIframeContent } from '../utils/iframe-utils';

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
  error,
  onReload
}) => {
  const [iframeError, setIframeError] = useState<string | null>(error || null);
  const [enhancedContent, setEnhancedContent] = useState<string>('');
  
  useEffect(() => {
    if (content) {
      try {
        // Process content to remove any dependence on gptengineer.js
        const processed = enhanceIframeContent(content, title);
        setEnhancedContent(processed);
        setIframeError(null);
      } catch (err) {
        console.error("Error processing iframe content:", err);
        setIframeError("Lỗi xử lý nội dung game. Vui lòng thử lại.");
      }
    }
  }, [content, title]);
  
  // Handle iframe load errors
  const handleIframeError = () => {
    if (iframeRef.current) {
      setIframeError("Game không thể tải. Vui lòng thử lại.");
    }
  };
  
  return (
    <div className="flex-1 relative overflow-hidden">
      {iframeError ? (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
          <p className="text-destructive mb-4">{iframeError}</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setIframeError(null);
              onReload();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Tải lại
          </Button>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          srcDoc={enhancedContent}
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          title={title || "Minigame"}
          style={{ 
            border: 'none',
            width: '100%',
            height: '100%',
            display: 'block'
          }}
          onError={handleIframeError}
        />
      )}
    </div>
  );
};

export default GameContainer;

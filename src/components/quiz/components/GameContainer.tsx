
import React from 'react';
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
  // Ensure content is properly formatted
  const formattedContent = content ? enhanceIframeContent(content, title) : '';
  
  return (
    <div className="flex-1 relative overflow-hidden">
      {error ? (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
          <p className="text-destructive mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={onReload}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Tải lại
          </Button>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          srcDoc={formattedContent}
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          title={title || "Minigame"}
          style={{ 
            border: 'none',
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};

export default GameContainer;

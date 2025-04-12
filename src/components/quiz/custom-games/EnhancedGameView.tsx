
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Maximize } from 'lucide-react';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;  // Changed to optional to match MiniGame type
    content: string;
  };
  extraButton?: React.ReactNode;
  onBack?: () => void;
  onNewGame?: () => void;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  extraButton,
  onBack,
  onNewGame
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Set the iframe content when the component mounts or miniGame changes
    if (iframeRef.current && miniGame?.content) {
      iframeRef.current.srcdoc = miniGame.content;
    }
  }, [miniGame]);

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      iframeRef.current.srcdoc = miniGame.content;
    }
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (!document.fullscreenElement) {
        iframeRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Game Controls */}
      <div className="flex justify-between items-center px-4 py-2 bg-background/80 backdrop-blur-sm border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshGame} 
            className="h-8 text-xs border-primary/20"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Tải lại
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen} 
            className="h-8 text-xs border-primary/20"
          >
            <Maximize className="h-3 w-3 mr-1" />
            Toàn màn hình
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {extraButton}
        </div>
      </div>
      
      {/* Game Container */}
      <div className="flex-1 bg-white relative overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
          title={miniGame.title}
        />
      </div>
    </div>
  );
};

export default EnhancedGameView;

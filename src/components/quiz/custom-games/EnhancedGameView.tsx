import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RefreshCw, Code } from 'lucide-react';
import { MiniGame } from '../generator/AIGameGenerator';

interface EnhancedGameViewProps {
  miniGame: MiniGame;
  extraButton?: React.ReactNode;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ miniGame, extraButton }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen();
    }
  };

  const refreshGame = () => {
    if (iframeRef.current) {
      setIsRefreshing(true);
      const iframe = iframeRef.current;
      iframe.srcdoc = '';
      
      // Brief timeout to ensure refresh is visible to user
      setTimeout(() => {
        if (iframe && miniGame.content) {
          iframe.srcdoc = miniGame.content;
        }
        setIsRefreshing(false);
      }, 300);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full flex flex-col ${isFullscreen ? 'bg-black' : ''}`}
    >
      {/* Game Header */}
      <div className={`flex justify-between items-center p-2 ${isFullscreen ? 'bg-background/90 backdrop-blur-sm' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Code className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium truncate max-w-[200px]">
            {miniGame.title || 'AI Game'}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {extraButton}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshGame}
            disabled={isRefreshing}
            className={`rounded-full p-2 h-8 w-8 ${isRefreshing ? 'animate-spin' : ''}`}
            title="Làm mới trò chơi"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullscreen}
            className="rounded-full p-2 h-8 w-8"
            title={isFullscreen ? "Thoát chế độ toàn màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Game Container */}
      <Card className={`flex-1 border-0 rounded-none ${isFullscreen ? '' : 'rounded-b-lg shadow-md overflow-hidden'}`}>
        <iframe
          ref={iframeRef}
          srcDoc={miniGame.content}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title={miniGame.title || "AI Game"}
          loading="eager"
        />
      </Card>
    </div>
  );
};

export default EnhancedGameView;

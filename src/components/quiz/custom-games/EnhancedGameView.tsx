
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Maximize, ArrowLeft, Share2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import GameContainer from '../components/GameContainer';
import { enhanceIframeContent } from '../utils/iframe-utils';

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

  const refreshGame = () => {
    setIframeError(null);
    // This forces the iframe to reload the content
    if (iframeRef.current) {
      try {
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
      } catch (error) {
        console.error("Error refreshing game:", error);
        setIframeError("Không thể tải lại game. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-1.5 bg-background/80 backdrop-blur-md border-b border-primary/10 z-10">
        <div className="flex items-center gap-1">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="w-7 h-7 p-0"
              title="Quay lại"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {extraButton}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshGame} 
            className="w-7 h-7 p-0"
            title="Tải lại"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen} 
            className="w-7 h-7 p-0"
            title="Toàn màn hình"
          >
            <Maximize className="h-3.5 w-3.5" />
          </Button>
          
          {onNewGame && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNewGame} 
              className="h-7 px-2 text-xs"
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Game mới
            </Button>
          )}
          
          {onShare && miniGame?.content && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={onShare} 
              className="h-7 px-2 text-xs"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Chia sẻ
            </Button>
          )}
        </div>
      </div>
      
      <GameContainer
        iframeRef={iframeRef}
        content={miniGame.content}
        title={miniGame.title}
        error={iframeError}
        onReload={refreshGame}
      />
    </div>
  );
};

export default EnhancedGameView;

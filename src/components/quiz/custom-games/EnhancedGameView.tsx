
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Maximize, ArrowLeft, Share2, PlusCircle } from 'lucide-react';

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

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      const enhancedContent = enhanceIframeContent(miniGame.content);
      iframeRef.current.srcdoc = enhancedContent;
    }
  }, [miniGame]);

  // Enhanced iframe content - completely removes any constraints
  const enhanceIframeContent = (content: string): string => {
    // Remove any existing style tags to prevent conflicts
    let processedContent = content;
    
    // Add our new style definitions - simplified and focused on maximizing display area
    const fullDisplayStyles = `
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }
        
        *, *::before, *::after {
          box-sizing: border-box !important;
        }
        
        body > div, main, #root, #app, .container, .game-container, #game, .game {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: auto !important;
          display: flex !important;
          flex-direction: column !important;
        }
        
        canvas {
          display: block !important;
          max-width: 100% !important;
          max-height: 100% !important;
          margin: 0 auto !important;
          object-fit: contain !important;
        }
        
        pre, code {
          white-space: pre-wrap !important;
          word-break: break-word !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 8px !important;
          background: rgba(0,0,0,0.05) !important;
          border-radius: 4px !important;
        }
      </style>
    `;
    
    // Insert our styles at the beginning of head or create a head if none exists
    if (processedContent.includes('<head>')) {
      processedContent = processedContent.replace('<head>', `<head>${fullDisplayStyles}`);
    } else if (processedContent.includes('<html>')) {
      processedContent = processedContent.replace('<html>', `<html><head>${fullDisplayStyles}</head>`);
    } else {
      // If no html structure, add complete html wrapper
      processedContent = `<!DOCTYPE html><html><head>${fullDisplayStyles}</head><body>${processedContent}</body></html>`;
    }
    
    return processedContent;
  };

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      const enhancedContent = enhanceIframeContent(miniGame.content);
      iframeRef.current.srcdoc = enhancedContent;
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
      {/* Game Controls - Minimized */}
      <div className="flex justify-between items-center p-1 bg-background/70 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack} 
              className="h-7 text-xs border-primary/20"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Quay lại
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshGame} 
            className="h-7 text-xs border-primary/20"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Tải lại
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {extraButton && extraButton}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen} 
            className="h-7 text-xs border-primary/20"
          >
            <Maximize className="h-3 w-3 mr-1" />
            Toàn màn hình
          </Button>
          
          {onNewGame && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onNewGame} 
              className="h-7 text-xs"
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Game mới
            </Button>
          )}
          
          {onShare && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={onShare} 
              className="h-7 text-xs"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Chia sẻ
            </Button>
          )}
        </div>
      </div>
      
      {/* Game Container - Maximized */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
          title={miniGame.title}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            border: 'none',
            margin: 0,
            padding: 0
          }}
        />
      </div>
    </div>
  );
};

export default EnhancedGameView;

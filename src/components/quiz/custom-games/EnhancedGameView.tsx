
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

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      const enhancedContent = enhanceIframeContent(miniGame.content);
      iframeRef.current.srcdoc = enhancedContent;
    }
  }, [miniGame]);

  // Enhanced iframe content to provide optimal display
  const enhanceIframeContent = (content: string): string => {
    // Safely sanitize content by removing markdown-style code blocks
    let processedContent = content.replace(/```html|```/g, '');
    processedContent = processedContent.replace(/`/g, '');
    
    // Add optimized styles for full display
    const optimizedStyles = `
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
        
        body {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%) !important;
        }
        
        *, *::before, *::after {
          box-sizing: border-box !important;
        }
        
        #game-container, #root, #app, .container, .game-container, #game, .game, main, [class*="container"] {
          width: 100% !important;
          height: 100% !important;
          margin: 0 auto !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          max-width: 100% !important;
        }
        
        canvas {
          display: block !important;
          max-width: 100% !important;
          max-height: 100% !important;
          margin: 0 auto !important;
          object-fit: contain !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          margin: 0.5em 0 !important;
          text-align: center !important;
        }
        
        button {
          cursor: pointer !important;
          padding: 8px 16px !important;
          margin: 8px !important;
          background: #4f46e5 !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          font-size: 16px !important;
          transition: background 0.2s !important;
        }
        
        button:hover {
          background: #4338ca !important;
        }
        
        pre, code {
          display: none !important;
        }
      </style>
    `;
    
    // Insert styles and ensure proper HTML structure
    if (processedContent.includes('<head>')) {
      processedContent = processedContent.replace('<head>', `<head>${optimizedStyles}`);
    } else if (processedContent.includes('<html>')) {
      processedContent = processedContent.replace('<html>', `<html><head>${optimizedStyles}</head>`);
    } else {
      // If no html structure, add complete html wrapper
      processedContent = `<!DOCTYPE html><html><head>${optimizedStyles}</head><body>${processedContent}</body></html>`;
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
      {/* Streamlined Controls Bar */}
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
      
      {/* Game Display */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts allow-forms"
          title={miniGame.title || "Minigame"}
          style={{
            border: 'none',
            display: 'block',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default EnhancedGameView;

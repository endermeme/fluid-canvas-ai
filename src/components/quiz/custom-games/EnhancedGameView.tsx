
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
  extraButton?: React.ReactNode; // Add support for custom button
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
    // Set the iframe content when the component mounts or miniGame changes
    if (iframeRef.current && miniGame?.content) {
      // Process the content to enhance code display
      const enhancedContent = enhanceCodeDisplay(miniGame.content);
      iframeRef.current.srcdoc = enhancedContent;
    }
  }, [miniGame]);

  // Enhance code display by adding styles for better code formatting and legibility
  const enhanceCodeDisplay = (content: string): string => {
    // Add custom CSS for code display to make it larger and more readable
    const codeStylesCSS = `
      <style>
        /* Đảm bảo nội dung đầy đủ không bị bóp méo */
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          overflow: auto !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Đảm bảo tất cả container đều full-size */
        body > div, 
        .container, 
        main, 
        .game-container, 
        #game,
        .game,
        #app,
        #root {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* Định dạng code để dễ đọc */
        pre, code, .code-block {
          font-size: 18px !important;
          line-height: 1.5 !important;
          font-family: Consolas, Monaco, 'Andale Mono', monospace !important;
          white-space: pre-wrap !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
        }
        
        pre {
          background-color: #f5f5f5 !important;
          padding: 16px !important;
          border: 1px solid #ddd !important;
          border-radius: 6px !important;
          overflow-x: auto !important;
          margin: 16px 0 !important;
        }
        
        canvas {
          display: block !important;
          margin: 0 auto !important;
          max-width: 100% !important;
          max-height: 100% !important;
        }
      </style>
    `;
    
    // Insert our custom styles just before the closing </head> tag
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${codeStylesCSS}</head>`);
    } else {
      // If no head tag, add styles at the beginning
      content = codeStylesCSS + content;
    }
    
    return content;
  };

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      const enhancedContent = enhanceCodeDisplay(miniGame.content);
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
      {/* Game Controls */}
      <div className="flex justify-between items-center p-2 bg-background/80 backdrop-blur-sm border-b border-primary/10">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack} 
              className="h-8 text-xs border-primary/20"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Quay lại
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshGame} 
            className="h-8 text-xs border-primary/20"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Tải lại
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Display the extraButton if provided */}
          {extraButton && extraButton}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen} 
            className="h-8 text-xs border-primary/20"
          >
            <Maximize className="h-3 w-3 mr-1" />
            Toàn màn hình
          </Button>
          
          {onNewGame && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onNewGame} 
              className="h-8 text-xs"
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
              className="h-8 text-xs"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Chia sẻ
            </Button>
          )}
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

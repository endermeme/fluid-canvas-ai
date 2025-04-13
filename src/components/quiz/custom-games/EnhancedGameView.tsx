
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
      // Add custom styling for code and JavaScript display before setting content
      const enhancedContent = enhanceCodeDisplay(miniGame.content);
      iframeRef.current.srcdoc = enhancedContent;
    }
  }, [miniGame]);

  // Function to enhance code display in the game content
  const enhanceCodeDisplay = (htmlContent: string): string => {
    // Add custom CSS to make code display larger and more readable
    const codeStylesCSS = `
      <style>
        /* Styles for code sections */
        pre, code {
          font-size: 16px !important;
          line-height: 1.5 !important;
          font-family: monospace !important;
          white-space: pre-wrap !important;
          background-color: #f5f5f5 !important;
          padding: 15px !important;
          border-radius: 8px !important;
          border: 1px solid #ddd !important;
          margin: 15px 0 !important;
          overflow-x: auto !important;
          tab-size: 2 !important;
        }
        
        /* Style for code blocks specifically */
        pre code {
          padding: 0 !important;
          border: none !important;
          background: transparent !important;
        }
        
        /* Style for inline code */
        code:not(pre code) {
          padding: 2px 5px !important;
          border-radius: 3px !important;
        }
        
        /* Style for code headings and labels */
        .code-label {
          font-weight: bold !important;
          margin-bottom: 5px !important;
          color: #333 !important;
        }
        
        /* Special styling for JavaScript code blocks */
        .js-code {
          background-color: #f8f8ff !important;
          border-left: 4px solid #4285f4 !important;
        }
        
        /* Make the game canvas larger */
        canvas {
          max-width: 100% !important;
          height: auto !important;
        }
        
        /* Code section with title */
        .code-section {
          margin: 20px 0 !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        
        .code-section-title {
          background-color: #e9e9e9 !important;
          padding: 8px 15px !important;
          font-weight: bold !important;
          border-bottom: 1px solid #ddd !important;
        }
        
        .code-section-content {
          padding: 15px !important;
        }
      </style>
    `;
    
    // Insert the styles right before the </head> tag
    if (htmlContent.includes('</head>')) {
      htmlContent = htmlContent.replace('</head>', `${codeStylesCSS}</head>`);
    } else {
      // If no head tag, add it at the beginning
      htmlContent = `<head>${codeStylesCSS}</head>${htmlContent}`;
    }
    
    // Find all script tags and wrap them with special styling if not already in pre/code blocks
    htmlContent = htmlContent.replace(
      /(<script[\s\S]*?>)([\s\S]*?)(<\/script>)/gi,
      (match, openTag, content, closeTag) => {
        // Skip if it's an empty script or has only attributes
        if (!content.trim()) return match;
        
        // Skip if it's already in a pre/code block
        if (content.includes('</code>') || content.includes('</pre>')) return match;
        
        // Create a styled version of the script content
        return `${openTag}${content}${closeTag}
        <div class="code-section">
          <div class="code-section-title">JavaScript Code</div>
          <div class="code-section-content">
            <pre class="js-code"><code>${content
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
            }</code></pre>
          </div>
        </div>`;
      }
    );
    
    return htmlContent;
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

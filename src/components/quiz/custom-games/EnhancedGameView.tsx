
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Maximize, ArrowLeft, Share2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { enhanceIframeContent } from '../utils/iframe-utils';
import GameContainer from '../components/GameContainer';
import { logInfo } from '@/components/quiz/generator/apiUtils';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
    htmlContent?: string;
    cssContent?: string;
    jsContent?: string;
    isSeparatedFiles?: boolean;
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
  const [iframeContent, setIframeContent] = useState<string>('');

  // Process and enhance the content when it changes
  useEffect(() => {
    if (miniGame?.content) {
      try {
        const contentToUse = miniGame.content;
        const enhancedContent = enhanceIframeContent(contentToUse, miniGame.title);
        setIframeContent(enhancedContent);
        setIframeError(null);
        
        // Log for debugging
        logInfo('EnhancedGameView', 'Setting iframe content:', { 
          contentLength: contentToUse.length,
          enhancedLength: enhancedContent.length,
          firstFewChars: enhancedContent.substring(0, 100) + '...'
        });
      } catch (error) {
        console.error("Error enhancing content:", error);
        setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
      }
    } else {
      setIframeError("Không có nội dung game để hiển thị.");
    }
  }, [miniGame]);

  // Set the iframe content when it's ready
  useEffect(() => {
    if (iframeRef.current && iframeContent) {
      try {
        iframeRef.current.srcdoc = iframeContent;
      } catch (error) {
        console.error("Error setting iframe content:", error);
        setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
      }
    }
  }, [iframeContent, iframeRef]);

  const refreshGame = () => {
    if (iframeRef.current && iframeContent) {
      try {
        // Force a refresh by setting srcdoc again
        iframeRef.current.srcdoc = '';
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.srcdoc = iframeContent;
          }
        }, 50);
        setIframeError(null);
      } catch (error) {
        console.error("Error refreshing game:", error);
        setIframeError("Không thể tải lại game. Vui lòng thử lại.");
      }
    }
  };

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
      
      <div className="flex-1 relative overflow-hidden">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
            <p className="text-destructive mb-4">{iframeError}</p>
            <Button 
              variant="outline" 
              onClick={refreshGame}
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Tải lại
            </Button>
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

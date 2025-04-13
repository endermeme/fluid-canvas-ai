import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  RefreshCw, 
  Share2, 
  Expand, 
  Play, 
  Pause, 
  Download, 
  Gamepad
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createGameSession } from '@/services/gameParticipation';
import { useToast } from '@/hooks/use-toast';
import QuizContainer from '../QuizContainer';

interface CustomGameContainerProps {
  title?: string;
  content: string;
  onBack?: () => void;
  onNewGame?: () => void;
}

const CustomGameContainer: React.FC<CustomGameContainerProps> = ({ 
  title = "Trò Chơi Tùy Chỉnh", 
  content, 
  onBack, 
  onNewGame 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Generate a safe HTML content
  const generateHtmlContent = () => {
    // Create a safe wrapper around the custom content
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            background: #f8f9fa;
          }
          #game-container {
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Custom styles for embedded content */
          canvas {
            max-width: 100%;
            max-height: 100%;
            margin: auto;
          }
        </style>
      </head>
      <body>
        <div id="game-container">
          ${content}
        </div>
        <script>
          // Communication channel with parent
          window.addEventListener('message', function(event) {
            if (event.data === 'pause') {
              // Implement pause logic if the game supports it
              console.log('Game paused');
              // You can add custom pause logic here
            } else if (event.data === 'resume') {
              // Implement resume logic if the game supports it
              console.log('Game resumed');
              // You can add custom resume logic here
            }
          });
        </script>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(generateHtmlContent());
        iframeDoc.close();
      }
    }
  }, [content]);

  const toggleFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (!isFullscreen) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  const togglePause = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    
    if (isPaused) {
      iframe.contentWindow.postMessage('resume', '*');
    } else {
      iframe.contentWindow.postMessage('pause', '*');
    }
    
    setIsPaused(!isPaused);
  };

  const handleShareGame = () => {
    // Create a shareable game session
    const gameSession = createGameSession(
      title,
      content
    );
    
    // Navigate to the share page
    navigate(`/game/${gameSession.id}`);
    
    toast({
      title: "Game đã được chia sẻ",
      description: "Bạn có thể gửi link cho người khác để họ tham gia.",
    });
  };

  const handleGameReload = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(generateHtmlContent());
        iframeDoc.close();
      }
    }
  };

  // Custom header controls for game
  const headerControls = (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={togglePause}
        className="h-8 w-8 p-0 flex items-center justify-center"
        title={isPaused ? "Tiếp tục" : "Tạm dừng"}
      >
        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleFullscreen}
        className="h-8 w-8 p-0 flex items-center justify-center"
        title="Toàn màn hình"
      >
        <Expand className="h-4 w-4" />
      </Button>
    </>
  );

  // Footer actions
  const footerActions = (
    <div className="flex justify-between items-center">
      <div>
        {onNewGame && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewGame}
            className="border-primary/20 bg-primary/5"
          >
            <Gamepad className="h-4 w-4 mr-1.5" />
            Trò Chơi Mới
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleShareGame}
          className="bg-primary/10 border border-primary/20 shadow-sm"
        >
          <Share2 className="h-4 w-4 mr-1.5" />
          Chia Sẻ
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          className="bg-gradient-to-r from-primary to-primary/80"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Lưu
        </Button>
      </div>
    </div>
  );

  return (
    <QuizContainer
      title={title}
      showBackButton={true}
      showHomeButton={false}
      showRefreshButton={false}
      onBack={onBack}
      onRefresh={handleGameReload}
      headerRight={headerControls}
      footerContent={footerActions}
    >
      <div className="w-full h-full">
        <iframe 
          ref={iframeRef}
          className="w-full h-full border-none"
          title={title}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </QuizContainer>
  );
};

export default CustomGameContainer;

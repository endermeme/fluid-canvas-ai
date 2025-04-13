
import React, { useEffect, useRef, useState } from 'react';
import { MiniGame } from './generator/AIGameGenerator';
import { Button } from '@/components/ui/button';
import { Share2, Home, RefreshCw, Trophy, ArrowLeft } from 'lucide-react';
import { saveGameForSharing } from '@/utils/gameExport';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface GameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
  extraButton?: React.ReactNode;
}

const GameView: React.FC<GameViewProps> = ({ miniGame, onBack, extraButton }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [shareInProgress, setShareInProgress] = useState(false);
  const [gameStats, setGameStats] = useState<{score?: number; completed?: boolean; totalTime?: number}>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (miniGame && miniGame.content) {
      try {
        saveGameForSharing(
          miniGame.title || "Minigame tương tác", 
          "", // Empty description
          miniGame.content
        );
      } catch (e) {
        console.error("Error saving game to history:", e);
      }
    }
  }, [miniGame]);

  const handleShare = () => {
    if (shareInProgress) return;
    
    try {
      setShareInProgress(true);
      const shareUrl = saveGameForSharing(
        miniGame.title || "Minigame tương tác",
        "", // Empty description
        miniGame.content
      );
      
      if (!shareUrl) {
        throw new Error("Không thể tạo URL chia sẻ");
      }
      
      navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link Chia Sẻ Đã Được Sao Chép",
        description: "Đã sao chép liên kết vào clipboard. Link có hiệu lực trong 48 giờ.",
      });
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Lỗi Chia Sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setShareInProgress(false);
    }
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  
  const handleReloadGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = enhanceIframeContent(miniGame.content);
        }
      }, 100);
      setGameStats({});
      setIframeError(null);
    }
  };

  // Enhanced function to properly prepare the content
  const enhanceIframeContent = (content: string): string => {
    // Remove any existing style tags to prevent conflicts
    let processedContent = content;
    
    // Add our new style definitions - maximizing display area
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

  const handleIframeLoad = () => {
    try {
      if (!iframeRef.current) return;
      
      setIframeError(null);

      // Set up message listener for game stats
      window.addEventListener('message', (event) => {
        try {
          const data = event.data;
          if (data && typeof data === 'object') {
            if (data.type === 'gameStats' && data.payload) {
              setGameStats(data.payload);
              
              if (data.payload.completed) {
                toast({
                  title: "Trò chơi đã hoàn thành!",
                  description: data.payload.score !== undefined 
                    ? `Điểm số của bạn: ${data.payload.score}` 
                    : "Chúc mừng bạn đã hoàn thành trò chơi!",
                });
              }
            }
          }
        } catch (err) {
          console.error("Error processing iframe message:", err);
        }
      });
    } catch (e) {
      console.error("General error in handleIframeLoad:", e);
      setIframeError("Lỗi khi tải minigame. Vui lòng thử lại.");
    }
  };

  if (!miniGame || !miniGame.content) {
    return <div>Không thể tải minigame</div>;
  }

  // Enhanced content with proper styling
  const enhancedContent = enhanceIframeContent(miniGame.content);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {iframeError ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex flex-col items-center m-4">
            <p>{iframeError}</p>
            <Button 
              variant="outline" 
              className="mt-3" 
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </Button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={enhancedContent}
            className="w-full h-full"
            sandbox="allow-scripts allow-popups allow-same-origin"
            onLoad={handleIframeLoad}
            title={miniGame.title || "Minigame"}
            style={{ 
              border: 'none',
              margin: 0,
              padding: 0,
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        )}

        {/* Back button overlay */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToHome} 
          className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-background/70 hover:bg-background/80 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      </div>
      
      {miniGame.title && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="px-4 py-2 bg-background/70 backdrop-blur-sm rounded-full shadow-md">
            <h2 className="text-sm font-medium text-center">{miniGame.title}</h2>
          </div>
        </div>
      )}
      
      {gameStats.score !== undefined && (
        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full shadow-md flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">{gameStats.score} điểm</span>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        <Button 
          size="sm" 
          variant="secondary"
          className="bg-background/70 backdrop-blur-sm shadow-md" 
          onClick={handleReloadGame}
        >
          <RefreshCw size={14} className="mr-1" />
          Chơi Lại
        </Button>
        
        <Button 
          size="sm" 
          variant="secondary"
          className="bg-background/70 backdrop-blur-sm shadow-md" 
          onClick={handleShare}
          disabled={shareInProgress}
        >
          <Share2 size={14} className="mr-1" />
          Chia Sẻ
        </Button>
        
        {extraButton}
      </div>
    </div>
  );
};

export default GameView;

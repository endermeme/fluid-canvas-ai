
import React, { useEffect, useRef, useState } from 'react';
import { MiniGame } from './generator/AIGameGenerator';
import { Button } from '@/components/ui/button';
import { Share2, RefreshCw, Trophy, ArrowLeft } from 'lucide-react';
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
      {/* Controls Bar */}
      <div className="flex justify-between items-center p-2 bg-background/80 backdrop-blur-md border-b border-primary/10 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToHome} 
          className="gap-1 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại
        </Button>
          
        <div className="flex items-center gap-1.5">
          {gameStats.score !== undefined && (
            <div className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium flex items-center">
              <Trophy className="h-3 w-3 text-primary mr-1" />
              {gameStats.score} điểm
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReloadGame}
            className="w-8 h-8 p-0"
            title="Chơi lại"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            disabled={shareInProgress}
            className="gap-1 text-xs"
          >
            <Share2 className="h-3.5 w-3.5" />
            Chia Sẻ
          </Button>
          
          {extraButton}
        </div>
      </div>
      
      {/* Game Display */}
      <div className="flex-1 relative overflow-hidden">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
            <p className="text-destructive mb-4">{iframeError}</p>
            <Button 
              variant="outline" 
              onClick={handleReloadGame}
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Tải lại
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
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GameView;

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
      const enhancedContent = miniGame.content.replace(
        /<style>/i, 
        `<style>
          /* Larger font for code blocks and JavaScript */
          pre, code, script {
            font-size: 16px !important;
            line-height: 1.5 !important;
          }
          
          /* Make JavaScript sections more prominent */
          .code-block, .js-block, pre {
            font-size: 16px !important;
            padding: 15px !important;
            border-radius: 8px !important;
            background-color: #f8f8f8 !important;
            border: 1px solid #e0e0e0 !important;
            margin: 15px 0 !important;
            overflow: auto !important;
            max-height: 500px !important;
          }
          
          /* Style JavaScript content */
          .js-content, [data-lang="javascript"], [data-language="javascript"] {
            display: block !important;
            font-size: 16px !important;
            font-family: monospace !important;
            white-space: pre-wrap !important;
          }
        `
      );
      
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = enhancedContent;
        }
      }, 100);
      setGameStats({});
      setIframeError(null);
    }
  };

  const handleIframeLoad = () => {
    try {
      if (!iframeRef.current) return;
      
      setIframeError(null);

      const iframe = iframeRef.current;
      
      try {
        const iframeDoc = iframe.contentDocument;
        
        if (!iframeDoc) {
          console.warn("Cannot access iframe content document - possible cross-origin restriction");
          return;
        }
        
        const styleElement = iframeDoc.createElement('style');
        styleElement.textContent = `
          body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          html { overflow: hidden !important; }
          
          main, .main, #main, .game, #game, .game-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Larger font for code blocks and JavaScript */
          pre, code, script {
            font-size: 16px !important;
            line-height: 1.5 !important;
          }
          
          /* Make JavaScript sections more prominent */
          .code-block, .js-block, pre {
            font-size: 16px !important;
            padding: 15px !important;
            border-radius: 8px !important;
            background-color: #f8f8f8 !important;
            border: 1px solid #e0e0e0 !important;
            margin: 15px 0 !important;
            overflow: auto !important;
            max-height: 500px !important;
          }
          
          /* Style JavaScript content */
          .js-content, [data-lang="javascript"], [data-language="javascript"] {
            display: block !important;
            font-size: 16px !important;
            font-family: monospace !important;
            white-space: pre-wrap !important;
          }
        `;
        iframeDoc.head.appendChild(styleElement);
        
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
        
      } catch (crossOriginError) {
        console.warn("Cross-origin restriction prevented accessing iframe content:", crossOriginError);
        setIframeError("Không thể tương tác với minigame do hạn chế bảo mật. Vui lòng thử tải lại trang.");
      }
    } catch (e) {
      console.error("General error in handleIframeLoad:", e);
      setIframeError("Lỗi khi tải minigame. Vui lòng thử lại.");
    }
  };

  if (!miniGame || !miniGame.content) {
    return <div>Không thể tải minigame</div>;
  }

  const enhancedContent = miniGame.content.replace(
    /<style>/i, 
    `<style>
      /* Larger font for code blocks and JavaScript */
      pre, code, script {
        font-size: 16px !important;
        line-height: 1.5 !important;
      }
      
      /* Make JavaScript sections more prominent */
      .code-block, .js-block, pre {
        font-size: 16px !important;
        padding: 15px !important;
        border-radius: 8px !important;
        background-color: #f8f8f8 !important;
        border: 1px solid #e0e0e0 !important;
        margin: 15px 0 !important;
        overflow: auto !important;
        max-height: 500px !important;
      }
      
      /* Style JavaScript content */
      .js-content, [data-lang="javascript"], [data-language="javascript"] {
        display: block !important;
        font-size: 16px !important;
        font-family: monospace !important;
        white-space: pre-wrap !important;
      }
    `
  );

  return (
    <div className="flex flex-col h-full w-full items-center justify-center overflow-hidden">
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
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
            className="w-full h-full border-0 mx-auto"
            sandbox="allow-scripts allow-popups allow-same-origin"
            onLoad={handleIframeLoad}
            title={miniGame.title || "Minigame"}
            style={{ maxWidth: '100%', height: '100%', margin: '0 auto' }}
          />
        )}

        {/* Back button overlay */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToHome} 
          className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      </div>
      
      {miniGame.title && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-md">
            <h2 className="text-sm font-medium text-center">{miniGame.title}</h2>
          </div>
        </div>
      )}
      
      {gameStats.score !== undefined && (
        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 shadow-md flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">{gameStats.score} điểm</span>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        <Button 
          size="sm" 
          variant="secondary"
          className="bg-background/80 backdrop-blur-sm border border-primary/20 shadow-md" 
          onClick={handleReloadGame}
        >
          <RefreshCw size={14} className="mr-1" />
          Chơi Lại
        </Button>
        
        <Button 
          size="sm" 
          variant="secondary"
          className="bg-background/80 backdrop-blur-sm border border-primary/20 shadow-md" 
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

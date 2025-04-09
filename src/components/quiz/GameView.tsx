
import React, { useEffect, useRef, useState } from 'react';
import { MiniGame } from './generator/AIGameGenerator';
import { Button } from '@/components/ui/button';
import { Share2, Home } from 'lucide-react';
import { saveGameForSharing } from '@/utils/gameExport';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface GameViewProps {
  miniGame: MiniGame;
}

const GameView: React.FC<GameViewProps> = ({ miniGame }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [shareInProgress, setShareInProgress] = useState(false);
  const navigate = useNavigate();

  // Save the game to history when it loads
  useEffect(() => {
    if (miniGame && miniGame.content) {
      try {
        // Save game to local storage for history
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

  // Handle sharing the game
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

  // Handle returning to home
  const handleBackToHome = () => {
    navigate('/');
  };

  // Apply game optimization when iframe loads
  const handleIframeLoad = () => {
    try {
      if (!iframeRef.current) return;
      
      // Reset any previous errors
      setIframeError(null);

      const iframe = iframeRef.current;
      
      try {
        const iframeDoc = iframe.contentDocument;
        
        if (!iframeDoc) {
          console.warn("Cannot access iframe content document - possible cross-origin restriction");
          return;
        }
        
        // Add CSS to fix the game display
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
          
          /* Basic styling fixes */
          html { overflow: hidden !important; }
          
          /* Game container */
          main, .main, #main, .game, #game, .game-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        `;
        iframeDoc.head.appendChild(styleElement);
        
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
            srcDoc={miniGame.content}
            className="w-full h-full border-0 mx-auto"
            sandbox="allow-scripts allow-popups allow-same-origin"
            onLoad={handleIframeLoad}
            title={miniGame.title || "Minigame"}
            style={{ maxWidth: '100%', height: '100%', margin: '0 auto' }}
          />
        )}
      </div>
      
      {/* Control buttons */}
      <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
        <Button 
          size="sm" 
          variant="ghost"
          className="bg-primary/10" 
          onClick={handleBackToHome}
        >
          <Home size={16} className="mr-1" />
          Trở Về
        </Button>
        
        <Button 
          size="sm" 
          variant="ghost"
          className="bg-primary/10" 
          onClick={handleShare}
          disabled={shareInProgress}
        >
          <Share2 size={16} className="mr-1" />
          Chia Sẻ
        </Button>
      </div>
    </div>
  );
};

export default GameView;

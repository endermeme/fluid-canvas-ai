
import React, { useEffect, useRef } from 'react';
import { MiniGame } from './AIGameGenerator';
import { Button } from '@/components/ui/button';
import { Share2, Download, Sparkles } from 'lucide-react';
import { saveGameForSharing } from '@/utils/gameExport';
import { useToast } from '@/hooks/use-toast';

interface GameViewProps {
  miniGame: MiniGame;
}

const GameView: React.FC<GameViewProps> = ({ miniGame }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Save the game to history when it loads
  useEffect(() => {
    if (miniGame && miniGame.title) {
      try {
        // Save game to local storage for history
        saveGameForSharing(
          miniGame.title,
          miniGame.description || "Minigame tương tác",
          miniGame.content
        );
      } catch (e) {
        console.error("Error saving game to history:", e);
      }
    }
  }, [miniGame]);

  // Handle sharing the game
  const handleShare = () => {
    try {
      const shareUrl = saveGameForSharing(
        miniGame.title,
        miniGame.description || "Minigame tương tác",
        miniGame.content
      );
      
      navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link Chia Sẻ Đã Được Sao Chép",
        description: "Đã sao chép liên kết vào clipboard. Link có hiệu lực trong 48 giờ.",
      });
    } catch (error) {
      toast({
        title: "Lỗi Chia Sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Apply game optimization code when iframe loads
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
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
          h1, h2, h3, h4, h5, h6, header, .header, [class*="header"], [id*="header"], 
          [class*="title"], [id*="title"], .title-container, .game-title {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          main, .main, #main, .game, #game, .game-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .next-button, .back-button, .restart-button, .other-button {
            position: fixed !important;
            bottom: 10px;
            z-index: 9999 !important;
          }
          html {
            overflow: hidden !important;
          }
        `;
        iframeDoc.head.appendChild(styleElement);
        
        // Add JavaScript to prevent scrolling and remove headers
        const scriptElement = iframeDoc.createElement('script');
        scriptElement.textContent = `
          // Prevent scrolling
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          
          // Remove all header elements
          function removeHeaders() {
            const selectors = [
              'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', '.header', 
              '[class*="header"]', '[id*="header"]', '[class*="title"]', 
              '[id*="title"]', '.title-container', '.game-title'
            ];
            
            selectors.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.height = '0';
                el.style.overflow = 'hidden';
              });
            });
          }
          
          // Remove headers immediately
          removeHeaders();
          
          // And also observe DOM changes to remove headers when they appear
          const observer = new MutationObserver(() => {
            removeHeaders();
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
          // Prevent scrolling events
          window.addEventListener('scroll', function(e) {
            e.preventDefault();
            window.scrollTo(0, 0);
          }, { passive: false });
          
          document.addEventListener('touchmove', function(e) {
            e.preventDefault();
          }, { passive: false });
        `;
        iframeDoc.body.appendChild(scriptElement);
      }
    }
  };

  if (!miniGame || !miniGame.content) {
    return <div>Không thể tải minigame</div>;
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        <iframe
          ref={iframeRef}
          srcDoc={miniGame.content}
          className="w-full h-full border-0 mx-auto"
          sandbox="allow-scripts allow-popups"
          onLoad={handleIframeLoad}
          title={miniGame.title}
          style={{ maxWidth: '100%', margin: '0 auto' }}
        />
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button 
          size="sm" 
          variant="ghost"
          className="bg-primary/10" 
          onClick={handleShare}
        >
          <Share2 size={16} className="mr-1" />
          Chia Sẻ
        </Button>
      </div>
    </div>
  );
};

export default GameView;

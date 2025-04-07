import React, { useEffect, useRef, useState } from 'react';
import { MiniGame } from './generator/types';
import sanitizeHtml from 'sanitize-html';
import { Button } from '@/components/ui/button';
import { Home, Share2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportGameToSharedURL } from '@/utils/gameExport';

interface GameViewProps {
  miniGame: MiniGame;
  onBackToHome?: () => void; // Make this prop optional for backward compatibility
}

const GameView: React.FC<GameViewProps> = ({ miniGame, onBackToHome }) => {
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (miniGame && miniGame.content && iframeContainerRef.current) {
      const iframe = document.createElement('iframe');
      iframe.srcdoc = sanitizeHtml(miniGame.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['style', 'script']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          '*': ['style', 'class'],
          'div': ['data-*'],
          'iframe': ['srcdoc', 'style', 'sandbox'],
          'a': ['href', 'rel', 'target'],
        },
        allowedIframeHostnames: ['*'],
        allowVulnerableTags: true,
        allowVulnerableAttributes: true,
      });
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = 'none';
      iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals';

      // Clear previous content
      iframeContainerRef.current.innerHTML = '';
      iframeContainerRef.current.appendChild(iframe);
    }
  }, [miniGame]);

  const handleShare = async () => {
    if (!miniGame) return;
    
    try {
      const shareableUrl = await exportGameToSharedURL(miniGame);
      if (shareableUrl) {
        navigator.clipboard.writeText(shareableUrl);
        setIsCopied(true);
        toast({
          title: "Đã sao chép!",
          description: "Đường dẫn đã được sao chép vào clipboard.",
        });
        setTimeout(() => setIsCopied(false), 3000);
      } else {
        throw new Error("Không thể tạo đường dẫn chia sẻ.");
      }
    } catch (error) {
      console.error("Lỗi chia sẻ game:", error);
      toast({
        title: "Lỗi",
        description: "Không thể chia sẻ game. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };
  
  // Find a good spot to add the back to home button
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold truncate">{miniGame.title}</h1>
        <div className="flex gap-2">
          {onBackToHome && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBackToHome}
              className="flex items-center gap-1"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Trang chủ</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center gap-1"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Chia sẻ</span>
          </Button>
        </div>
      </div>
      
      <div
        ref={iframeContainerRef}
        className="relative flex-1 w-full overflow-hidden bg-white"
      >
        {/* The game will be loaded here */}
      </div>
    </div>
  );
};

export default GameView;

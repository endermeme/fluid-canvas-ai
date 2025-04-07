
import React, { useEffect, useRef, useState } from 'react';
import { MiniGame } from './generator/types';
import sanitizeHtml from 'sanitize-html';
import { Button } from '@/components/ui/button';
import { Home, Share2, Copy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';

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
          'iframe': ['srcdoc', 'style'],
          'a': ['href', 'rel', 'target'],
        },
        allowedIframeHostnames: ['*'],
        allowVulnerableTags: true,
        allowVulnerableAttributes: true,
      });
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = 'none';
      
      // Use setAttribute instead of direct property assignment for sandbox
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals');

      // Clear previous content
      iframeContainerRef.current.innerHTML = '';
      iframeContainerRef.current.appendChild(iframe);
    }
  }, [miniGame]);

  const handleShare = async () => {
    if (!miniGame) return;
    
    try {
      const shareableUrl = saveGameForSharing(
        miniGame.title, 
        miniGame.description || "", 
        miniGame.content
      );
      
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

      {/* Nút Tạo Mới cố định ở góc dưới bên phải */}
      {onBackToHome && (
        <div className="absolute bottom-4 right-4">
          <Button 
            onClick={onBackToHome}
            size="sm" 
            className="bg-primary/80 hover:bg-primary shadow-lg"
          >
            <Plus size={16} className="mr-1" />
            Tạo Mới
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameView;

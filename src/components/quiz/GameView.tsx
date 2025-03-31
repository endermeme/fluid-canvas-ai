
import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import { MiniGame } from './AIGameGenerator';
import { animateContentHighlight } from '@/lib/animations';

interface GameViewProps {
  miniGame: MiniGame;
}

const GameView: React.FC<GameViewProps> = ({ miniGame }) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const { toast } = useToast();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Reset loaded state when game changes
    setIsFrameLoaded(false);
    setShowSourceCode(false);
  }, [miniGame]);

  const handleShareGame = () => {
    try {
      if (!miniGame.content) {
        throw new Error('Game content is missing');
      }
      
      const url = saveGameForSharing(
        miniGame.title,
        miniGame.description,
        miniGame.content
      );
      
      setShareUrl(url);
      
      // Copy to clipboard automatically
      navigator.clipboard.writeText(url).catch(() => {
        // Silent fallback if clipboard API fails
      });
      
      toast({
        title: "Đã Tạo Liên Kết Chia Sẻ",
        description: "Liên kết có hiệu lực trong 48 giờ và đã được sao chép vào clipboard."
      });
    } catch (error) {
      console.error('Lỗi khi chia sẻ game:', error);
      toast({
        title: "Lỗi Chia Sẻ",
        description: "Không thể tạo liên kết chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Đã Sao Chép",
        description: "Liên kết đã được sao chép vào clipboard."
      });
    }).catch(err => {
      console.error('Lỗi khi sao chép:', err);
      toast({
        title: "Lỗi Sao Chép",
        description: "Không thể sao chép liên kết. Vui lòng thử lại.",
        variant: "destructive"
      });
    });
  };

  const handleFrameLoad = () => {
    setIsFrameLoaded(true);
    
    // Animate the iframe container when content loads
    const container = iframeRef.current?.parentElement;
    if (container) {
      container.classList.add('animate-fade-in');
    }
  };

  const toggleSourceCode = () => {
    setShowSourceCode(!showSourceCode);
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="bg-background border-b p-2 flex items-center justify-between shadow-sm">
        <h3 className="text-sm font-medium truncate mr-2">
          {miniGame.title}
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            onClick={toggleSourceCode} 
            variant="outline" 
            size="sm" 
            className="h-8 transition-transform active:scale-95"
          >
            {showSourceCode ? "Xem Game" : "Xem Code"}
          </Button>
          
          {shareUrl ? (
            <div className="flex items-center gap-2 bg-muted p-1.5 rounded-md max-w-sm transition-all animate-scale-in">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="bg-transparent text-xs flex-1 min-w-0 outline-none px-2"
              />
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2 transition-transform active:scale-95"
                onClick={() => copyToClipboard(shareUrl)}
              >
                {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleShareGame} 
              variant="outline" 
              size="sm" 
              className="h-8 transition-transform active:scale-95 animate-float-in"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Chia Sẻ (48h)
            </Button>
          )}
        </div>
      </div>
      
      {!showSourceCode ? (
        <div className="relative flex-1 overflow-hidden">
          {!isFrameLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin"></div>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Đang tải minigame...</p>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            srcDoc={miniGame.content}
            title={miniGame.title}
            sandbox="allow-scripts allow-same-origin"
            className={`w-full h-full border-none ${isFrameLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ height: '100%', width: '100%' }}
            onLoad={handleFrameLoad}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">HTML</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                {miniGame.gameHtml}
              </pre>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">CSS</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                {miniGame.cssStyles}
              </pre>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">JavaScript</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                {miniGame.gameScript}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;

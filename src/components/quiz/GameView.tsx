
import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import { MiniGame } from './AIGameGenerator';

interface GameViewProps {
  miniGame: MiniGame;
}

const GameView: React.FC<GameViewProps> = ({ miniGame }) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleShareGame = () => {
    try {
      const url = saveGameForSharing(
        miniGame.title,
        miniGame.description,
        miniGame.htmlContent
      );
      
      setShareUrl(url);
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

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="bg-background border-b p-2 flex items-center justify-between">
        <h3 className="text-sm font-medium truncate mr-2">
          {miniGame.title}
        </h3>
        <div className="flex items-center gap-2">
          {shareUrl ? (
            <div className="flex items-center gap-2 bg-muted p-1 rounded-md max-w-sm">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="bg-transparent text-xs flex-1 min-w-0 outline-none px-2"
              />
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2"
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
              className="h-8"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Chia Sẻ (48h)
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          srcDoc={miniGame.htmlContent}
          title={miniGame.title}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-none"
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default GameView;

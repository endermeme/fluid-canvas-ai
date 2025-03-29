
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import { MiniGame } from '@/utils/AIGameGenerator';

interface GameShareSectionProps {
  miniGame: MiniGame | null;
}

const GameShareSection = ({ miniGame }: GameShareSectionProps) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleShareGame = () => {
    if (!miniGame) return;
    
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

  if (shareUrl) {
    return (
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
    );
  }

  return (
    <Button 
      onClick={handleShareGame} 
      variant="outline" 
      size="sm" 
      className="h-8"
    >
      <Share2 className="h-4 w-4 mr-1" />
      Chia Sẻ (48h)
    </Button>
  );
};

export default GameShareSection;

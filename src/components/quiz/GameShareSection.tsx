
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, QrCode, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import { MiniGame } from '@/utils/AIGameGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeSVG } from 'qrcode.react';

interface GameShareSectionProps {
  miniGame: MiniGame | null;
}

const GameShareSection = ({ miniGame }: GameShareSectionProps) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(true);
      toast({
        title: "Đã Tạo Liên Kết Chia Sẻ",
        description: "Liên kết có hiệu lực trong 48 giờ và đã được tạo thành công."
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

  // Close share panel and reset state
  const handleCloseShare = () => {
    setIsOpen(false);
  };

  if (shareUrl && isOpen) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-3 min-w-[280px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-primary">Chia sẻ trò chơi</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCloseShare}>
            <span className="sr-only">Đóng</span>
            <span aria-hidden="true">&times;</span>
          </Button>
        </div>
        
        <Tabs defaultValue="qr">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="qr" className="flex items-center gap-1">
              <QrCode className="h-3.5 w-3.5" />
              <span>Mã QR</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-1">
              <Link className="h-3.5 w-3.5" />
              <span>Liên kết</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="qr" className="space-y-2 flex flex-col items-center">
            <div className="p-3 bg-white rounded-md">
              <QRCodeSVG 
                value={shareUrl} 
                size={200} 
                bgColor="#FFFFFF"
                fgColor="#000000"
                includeMargin={true}
                level="H" // high error correction capability
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Học sinh có thể quét mã QR này để tham gia
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => copyToClipboard(shareUrl)}
            >
              {isCopied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              Sao chép liên kết
            </Button>
          </TabsContent>
          
          <TabsContent value="link">
            <div className="flex items-center gap-2 bg-muted p-1.5 rounded-md">
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
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Chia sẻ liên kết này với học sinh để tham gia
            </p>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleShareGame} 
      variant="outline" 
      size="sm" 
      className="h-8 bg-white/80 hover:bg-white"
    >
      <Share2 className="h-4 w-4 mr-1.5" />
      Chia Sẻ (48h)
    </Button>
  );
};

export default GameShareSection;

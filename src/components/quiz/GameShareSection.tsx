
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, QrCode, Link, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import { MiniGame } from '@/utils/AIGameGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';

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
  
  const downloadQRCode = () => {
    if (!shareUrl) return;
    
    // Create a temporary canvas to generate the QR code
    const canvas = document.createElement("canvas");
    const qrCodeSvg = document.getElementById("share-qr-code");
    
    if (qrCodeSvg) {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(qrCodeSvg);
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        
        // Draw white background
        if (context) {
          context.fillStyle = "#FFFFFF";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
          
          // Convert to data URL and download
          const dataURL = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataURL;
          a.download = `${miniGame?.title || 'game'}-qr-code.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          toast({
            title: "Tải xuống thành công",
            description: "Mã QR đã được tải xuống."
          });
        }
      };
      
      img.src = `data:image/svg+xml;base64,${btoa(svgStr)}`;
    }
  };

  // Close share panel and reset state
  const handleCloseShare = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-medium">Chia sẻ trò chơi</DialogTitle>
          <DialogDescription>
            Học sinh có thể quét mã QR hoặc sử dụng liên kết để tham gia trò chơi này.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="qr" className="w-full">
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
          
          <TabsContent value="qr" className="space-y-4 flex flex-col items-center">
            <div className="p-4 bg-white rounded-md border">
              {shareUrl && (
                <QRCodeSVG 
                  id="share-qr-code"
                  value={shareUrl} 
                  size={250} 
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  includeMargin={true}
                  level="H" // high error correction capability
                />
              )}
            </div>
            <p className="text-sm text-center text-muted-foreground max-w-xs">
              Học sinh có thể quét mã QR này để tham gia trò chơi
            </p>
            <div className="flex gap-2 w-full justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareUrl && copyToClipboard(shareUrl)}
                className="flex-1"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                Sao chép liên kết
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadQRCode}
                className="flex-1"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Tải QR
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="link">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                <input 
                  type="text" 
                  value={shareUrl || ''} 
                  readOnly 
                  className="bg-transparent text-sm flex-1 min-w-0 outline-none px-2"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-2"
                  onClick={() => shareUrl && copyToClipboard(shareUrl)}
                >
                  {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <p className="text-sm text-center mt-2 text-muted-foreground">
                Chia sẻ liên kết này với học sinh để họ tham gia trò chơi
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GameShareSection;

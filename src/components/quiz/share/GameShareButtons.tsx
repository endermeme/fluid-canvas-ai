import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, Copy, Facebook, Twitter, Download, 
  Laptop, QrCode, Link, Check, Loader2 
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { getShortenedUrl } from '@/services/vpsStorage';
import QRCode from 'qrcode.react';

interface GameShareButtonsProps {
  gameId: string;
  shareUrl: string;
  title: string;
}

const GameShareButtons: React.FC<GameShareButtonsProps> = ({ 
  gameId, 
  shareUrl, 
  title 
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isGeneratingShortUrl, setIsGeneratingShortUrl] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopyLink = () => {
    const urlToCopy = shortUrl || shareUrl;
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    
    toast({
      title: "Link đã được sao chép!",
      description: "Đã sao chép link chia sẻ vào clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCreateShortUrl = async () => {
    if (shortUrl) return; // Đã có rồi
    
    setIsGeneratingShortUrl(true);
    try {
      const shortenedUrl = await getShortenedUrl(shareUrl);
      setShortUrl(shortenedUrl);
      
      toast({
        title: "Đã tạo link rút gọn",
        description: "Link rút gọn đã được tạo thành công.",
      });
    } catch (error) {
      toast({
        title: "Lỗi tạo link rút gọn",
        description: "Không thể tạo link rút gọn. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingShortUrl(false);
    }
  };
  
  const handleShareFacebook = () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`Chơi game "${title}" ngay!`)}`;
    window.open(fbShareUrl, '_blank', 'width=600,height=400');
  };
  
  const handleShareTwitter = () => {
    // Sử dụng X (Twitter) mới
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Chơi game "${title}" ngay!`)}`;
    window.open(twitterShareUrl, '_blank', 'width=600,height=400');
  };
  
  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('game-qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `game-qrcode-${gameId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Đã tải QR Code",
      description: "QR Code đã được tải xuống.",
    });
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowShareDialog(true)}
              className="gap-1.5"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chia sẻ game với bạn bè</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chia sẻ game</DialogTitle>
            <DialogDescription>
              Chia sẻ game "{title}" với bạn bè qua mạng xã hội hoặc bằng link trực tiếp.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mt-4">
            <Input
              value={shortUrl || shareUrl}
              readOnly
              className="flex-1"
            />
            <Button size="sm" variant="outline" onClick={handleCopyLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          {!shortUrl && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleCreateShortUrl}
              disabled={isGeneratingShortUrl}
              className="mt-2"
            >
              {isGeneratingShortUrl ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo link ngắn...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Tạo link ngắn
                </>
              )}
            </Button>
          )}
          
          <div className="flex flex-col space-y-4 mt-4">
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleShareFacebook}>
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareTwitter}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <p className="text-sm font-medium mb-2">Quét QR Code</p>
              <QRCode 
                id="game-qr-code"
                value={shareUrl} 
                size={150} 
                level="M"
                includeMargin={true}
                className="mb-2"
              />
              <Button variant="ghost" size="sm" onClick={handleDownloadQRCode}>
                <Download className="h-4 w-4 mr-2" />
                Tải QR Code
              </Button>
            </div>
          </div>
          
          <DialogFooter className="mt-4 flex justify-between">
            <Button variant="secondary" size="sm" asChild>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                <Laptop className="h-4 w-4 mr-2" />
                Mở trong tab mới
              </a>
            </Button>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GameShareButtons; 
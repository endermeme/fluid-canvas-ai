import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, Copy, Facebook, Twitter, Download, 
  Laptop, QrCode, Link, Check, Loader2, Save
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
import { shareGameToVps } from '@/services/storage';
import QRCode from 'qrcode.react';

interface GameShareButtonsProps {
  gameId: string;
  title: string;
  shareUrl?: string;
  gameData?: any;
  gameType?: 'preset' | 'custom';
  variant?: 'icon' | 'button';
}

const GameShareButtons: React.FC<GameShareButtonsProps> = ({ 
  gameId, 
  shareUrl: initialShareUrl, 
  title,
  gameData,
  gameType = 'custom',
  variant = 'button'
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isGeneratingShortUrl, setIsGeneratingShortUrl] = useState(false);
  const [isSavingToVps, setIsSavingToVps] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>(initialShareUrl || '');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopyLink = () => {
    const urlToCopy = shortUrl || shareUrl;
    if (!urlToCopy) {
      toast({
        title: "Lỗi sao chép",
        description: "Chưa có link để sao chép. Vui lòng tạo link chia sẻ trước.",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    
    toast({
      title: "Link đã được sao chép!",
      description: "Đã sao chép link chia sẻ vào clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const saveGameToVps = async () => {
    if (!gameData) {
      toast({
        title: "Lỗi lưu game",
        description: "Không có dữ liệu game để lưu trữ.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSavingToVps(true);
    try {
      // Lưu game lên VPS qua storage service
      const savedGame = await shareGameToVps(gameData, gameType, title);
      
      // Cập nhật URL chia sẻ
      const newShareUrl = savedGame.shareUrl || `${window.location.origin}/game/${savedGame.id}`;
      setShareUrl(newShareUrl);
      
      toast({
        title: "Đã lưu game lên server",
        description: "Game đã được lưu trữ và sẵn sàng chia sẻ!",
      });
      
      return newShareUrl;
    } catch (error) {
      toast({
        title: "Lỗi lưu game",
        description: "Không thể lưu game lên server. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSavingToVps(false);
    }
  };
  
  const handleCreateShortUrl = async () => {
    if (shortUrl) return; // Đã có rồi
    
    // Nếu chưa có URL chia sẻ và có dữ liệu game, lưu game trước
    let urlToShorten = shareUrl;
    if (!urlToShorten && gameData) {
      urlToShorten = await saveGameToVps();
      if (!urlToShorten) return;
    } else if (!urlToShorten) {
      toast({
        title: "Lỗi tạo link ngắn",
        description: "Không có URL để rút gọn. Vui lòng lưu game trước.",
        variant: "destructive"
      });
      return;
    }
    
    // Tạo URL rút gọn
    setIsGeneratingShortUrl(true);
    try {
      const shortenedUrl = await getShortenedUrl(urlToShorten);
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
  
  const handleOpenShareDialog = async () => {
    // Nếu có dữ liệu game nhưng chưa có URL chia sẻ, lưu game trước
    if (gameData && !shareUrl) {
      const newShareUrl = await saveGameToVps();
      if (!newShareUrl) {
        toast({
          title: "Không thể chia sẻ",
          description: "Không thể tạo link chia sẻ. Vui lòng thử lại sau.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setShowShareDialog(true);
  };
  
  const handleShareFacebook = async () => {
    // Nếu chưa có URL chia sẻ, tạo trước
    let urlToShare = shareUrl;
    if (!urlToShare && gameData) {
      urlToShare = await saveGameToVps();
      if (!urlToShare) return;
    }
    
    if (!urlToShare) {
      toast({
        title: "Lỗi chia sẻ",
        description: "Không có URL để chia sẻ. Vui lòng lưu game trước.",
        variant: "destructive"
      });
      return;
    }
    
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}&quote=${encodeURIComponent(`Chơi game "${title}" ngay!`)}`;
    window.open(fbShareUrl, '_blank', 'width=600,height=400');
  };
  
  const handleShareTwitter = async () => {
    // Nếu chưa có URL chia sẻ, tạo trước
    let urlToShare = shareUrl;
    if (!urlToShare && gameData) {
      urlToShare = await saveGameToVps();
      if (!urlToShare) return;
    }
    
    if (!urlToShare) {
      toast({
        title: "Lỗi chia sẻ",
        description: "Không có URL để chia sẻ. Vui lòng lưu game trước.",
        variant: "destructive"
      });
      return;
    }
    
    // Sử dụng X (Twitter) mới
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(`Chơi game "${title}" ngay!`)}`;
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

  // Hiển thị dạng nút icon hoặc nút đầy đủ
  const renderShareButton = () => {
    if (variant === 'icon') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleOpenShareDialog}
          className="h-8 w-8 p-0"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      );
    }
    
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleOpenShareDialog}
        className="gap-1.5"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Chia sẻ</span>
      </Button>
    );
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {renderShareButton()}
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
          
          {(!shareUrl && gameData) ? (
            <div className="py-4 text-center">
              <Button 
                onClick={saveGameToVps} 
                disabled={isSavingToVps}
                className="w-full"
              >
                {isSavingToVps ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu lên server...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu game lên server
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Game cần được lưu trữ trên server trước khi chia sẻ
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
          
          <DialogFooter className="mt-4 flex justify-between">
            {shareUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Laptop className="h-4 w-4 mr-2" />
                  Mở trong tab mới
                </a>
              </Button>
            )}
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
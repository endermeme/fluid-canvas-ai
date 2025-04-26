
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Fullscreen, Share2, PlusCircle, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

interface CustomGameHeaderProps {
  onBack?: () => void;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onShare?: () => Promise<string | void>;
  onNewGame?: () => void;
  showGameControls?: boolean;
  isSharing?: boolean;
}

const CustomGameHeader: React.FC<CustomGameHeaderProps> = ({
  onBack,
  onRefresh,
  onFullscreen,
  onShare,
  onNewGame,
  showGameControls = false,
  isSharing = false,
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleShare = async () => {
    if (!onShare) return;
    
    try {
      const url = await onShare();
      if (url) {
        setShareUrl(url.toString());
        setShowShareDialog(true);
      }
    } catch (error) {
      console.error('Error sharing game:', error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Đã sao chép",
          description: "Đường dẫn đã được sao chép vào clipboard.",
        });
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
        toast({
          title: "Lỗi sao chép",
          description: "Không thể sao chép đường dẫn. Vui lòng thử lại.",
          variant: "destructive"
        });
      });
  };

  return (
    <>
      <header className="bg-background/80 backdrop-blur-sm p-2 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {showGameControls && (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onRefresh}
                className="h-8 w-8 p-0"
                title="Tải lại"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onFullscreen}
                className="h-8 w-8 p-0"
                title="Toàn màn hình"
              >
                <Fullscreen className="h-4 w-4" />
              </Button>
              
              {onShare && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="h-8 px-3 flex items-center gap-1"
                  title="Chia sẻ"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Chia sẻ</span>
                </Button>
              )}
              
              {onNewGame && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onNewGame}
                  className="h-8 w-8 p-0"
                  title="Tạo game mới"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </header>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chia sẻ game</DialogTitle>
            <DialogDescription>
              Chia sẻ game này với bạn bè để họ có thể tham gia chơi
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            
            <div className="w-full space-y-2">
              <Label htmlFor="share-link">Liên kết chia sẻ</Label>
              <div className="flex">
                <Input 
                  id="share-link" 
                  value={shareUrl} 
                  readOnly 
                  className="rounded-r-none"
                />
                <Button 
                  variant="outline" 
                  className="rounded-l-none"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomGameHeader;

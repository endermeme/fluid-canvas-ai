
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';

interface QuizHeaderProps {
  showBackButton?: boolean;
  showCreateButton?: boolean;
  showShareButton?: boolean;
  isGameCreated?: boolean;
  onBack?: () => void;
  onCreate?: () => void;
  onShare?: () => void;
  headerRight?: React.ReactNode;
  gameData?: any;
  gameType?: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  showBackButton = true,
  showCreateButton = false,
  showShareButton = false,
  isGameCreated = false,
  onBack,
  onCreate,
  onShare,
  headerRight,
  gameData,
  gameType = 'custom'
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (!gameData || !onShare) return;
    
    try {
      setIsSharing(true);
      toast({
        title: "Đang xử lý",
        description: "Đang lưu game và tạo liên kết chia sẻ...",
      });

      // Lấy nội dung HTML từ game-container
      const gameContainer = document.getElementById('game-container');
      let html = gameContainer?.innerHTML || '';
      
      // Mã hóa nội dung game vào HTML để có thể phục hồi dễ dàng
      if (gameData) {
        const encodedContent = encodeURIComponent(JSON.stringify(gameData));
        html = `<div data-game-content="${encodedContent}">${html}</div>`;
      }
      
      // Lưu game vào Supabase và lấy URL chia sẻ
      const url = await saveGameForSharing(
        gameData.title || 'Custom Game',
        gameType,
        gameData,
        html
      );
      
      if (url) {
        setShareUrl(url);
        setShowShareDialog(true);
        
        if (onShare) {
          onShare();
        }

        toast({
          title: "Game đã được chia sẻ",
          description: "Đường dẫn đã được tạo để chia sẻ trò chơi.",
        });
      } else {
        throw new Error("Không nhận được URL chia sẻ");
      }
    } catch (error) {
      console.error('Error sharing game:', error);
      toast({
        title: "Không thể chia sẻ game",
        description: "Đã xảy ra lỗi khi tạo đường dẫn. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
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
          description: "Không thể sao chép liên kết. Vui lòng thử lại.",
          variant: "destructive"
        });
      });
  };

  return (
    <>
      <div className="flex justify-between items-center bg-background/90 backdrop-blur-md px-2 py-1.5 border-b border-primary/10 shadow-sm">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBack} className="w-7 h-7 p-0" title="Quay lại">
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {headerRight}
        
        <div className="flex items-center gap-2">
          {showCreateButton && (
            <Button variant="outline" size="sm" onClick={onCreate} className="h-7 px-2 text-xs" title="Tạo mới">
              <PlusCircle className="h-3 w-3 mr-1" />
              Tạo
            </Button>
          )}

          {showShareButton && isGameCreated && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleShare}
              disabled={isSharing} 
              className="h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90" 
              title="Chia sẻ game"
            >
              <Share2 className="h-3 w-3 mr-1" />
              {isSharing ? 'Đang xử lý...' : 'Chia sẻ'}
            </Button>
          )}
        </div>
      </div>

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

export default QuizHeader;

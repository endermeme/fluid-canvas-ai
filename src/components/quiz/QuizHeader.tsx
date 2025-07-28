import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Game sharing moved to separate handlers

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
    if (!gameData) {
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể chia sẻ game vì chưa có dữ liệu",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSharing(true);
      toast({
        title: "Đang xử lý",
        description: "Đang lưu game và tạo liên kết chia sẻ...",
      });

      // Deprecated - use specific share handlers instead
      toast({
        title: "Lỗi chia sẻ",
        description: "Chức năng chia sẻ chung đã bị tắt. Vui lòng sử dụng chức năng chia sẻ riêng cho từng loại game.",
        variant: "destructive"
      });
      return;
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
      <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 border-b border-primary/10">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2" title="Quay lại">
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
        )}
        
        {headerRight}
        
        <div className="flex items-center gap-3">
          {showCreateButton && (
            <Button variant="outline" size="sm" onClick={onCreate} className="flex items-center gap-2" title="Tạo mới">
              <PlusCircle className="h-4 w-4" />
              <span>Tạo</span>
            </Button>
          )}

          {showShareButton && isGameCreated && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleShare}
              disabled={isSharing} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2" 
              title="Chia sẻ game"
            >
              <Share2 className="h-4 w-4" />
              <span>{isSharing ? 'Đang xử lý...' : 'Chia sẻ'}</span>
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

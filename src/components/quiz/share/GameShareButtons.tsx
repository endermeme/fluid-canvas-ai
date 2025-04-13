
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Share2, Link as LinkIcon, QrCode } from 'lucide-react';
import { toast } from "sonner";
import { copyToClipboard } from '@/utils/clipboard';

interface GameShareButtonsProps {
  gameId: string;
  title?: string;
  variant?: 'default' | 'icon';
  className?: string;
}

const GameShareButtons: React.FC<GameShareButtonsProps> = ({ 
  gameId, 
  title = 'Game', 
  variant = 'default',
  className = ''
}) => {
  const [showQR, setShowQR] = useState(false);
  
  // Tạo URL chia sẻ
  const shareUrl = `${window.location.origin}/game/${gameId}`;
  
  // Xử lý copy link
  const handleCopyLink = () => {
    copyToClipboard(shareUrl);
    toast.success("Đã sao chép liên kết");
  };
  
  // Xử lý chia sẻ
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Trò chơi: ${title}`,
          text: `Tham gia chơi ${title} tại đây:`,
          url: shareUrl,
        });
      } else {
        handleCopyLink();
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
      // Fallback to copy if share fails
      handleCopyLink();
    }
  };
  
  // Render dạng icon only
  if (variant === 'icon') {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleShare}
        className={className}
        title="Chia sẻ game"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    );
  }
  
  // Render dạng mặc định
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopyLink}
        className="flex items-center gap-1.5"
      >
        <Copy className="h-4 w-4" />
        <span>Sao chép link</span>
      </Button>
      
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleShare}
        className="flex items-center gap-1.5"
      >
        <Share2 className="h-4 w-4" />
        <span>Chia sẻ</span>
      </Button>
    </div>
  );
};

export default GameShareButtons;

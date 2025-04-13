
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Share2, Link as LinkIcon, QrCode } from 'lucide-react';
import { toast } from "sonner";
import { copyToClipboard } from '@/utils/clipboard';
import { saveGameForSharing } from '@/utils/gameExport';

interface GameShareButtonsProps {
  gameId: string;
  title?: string;
  variant?: 'default' | 'icon';
  className?: string;
  gameData?: any;
  gameType?: string;
}

const GameShareButtons: React.FC<GameShareButtonsProps> = ({ 
  gameId, 
  title = 'Game', 
  variant = 'default',
  className = '',
  gameData,
  gameType
}) => {
  const [showQR, setShowQR] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Create share URL
  const shareUrl = `${window.location.origin}/game/${gameId}`;
  
  // Handle copy link
  const handleCopyLink = () => {
    copyToClipboard(shareUrl);
    toast.success("Đã sao chép liên kết");
  };
  
  // Handle share
  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      // If we have gameData, we need to save it first
      if (gameData && gameType) {
        try {
          // Use import.meta.env to store game data using the appropriate service
          const savedGame = await saveGameForSharing(
            title,
            `Game ${gameType} tạo bởi AI`,
            typeof gameData === 'string' ? gameData : JSON.stringify(gameData)
          );
          
          // If successful, update the share URL
          if (savedGame) {
            toast.success("Đã lưu game thành công");
          }
        } catch (error) {
          console.error("Error saving game:", error);
          toast.error("Lỗi khi lưu game");
        }
      }
      
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
    } finally {
      setIsSharing(false);
    }
  };
  
  // Render icon only variant
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
  
  // Render default variant
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
        disabled={isSharing}
      >
        <Share2 className="h-4 w-4" />
        <span>{isSharing ? "Đang chia sẻ..." : "Chia sẻ"}</span>
      </Button>
    </div>
  );
};

export default GameShareButtons;

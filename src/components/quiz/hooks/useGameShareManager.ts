
import { useState } from 'react';

interface MiniGame {
  title?: string;
  content: string;
}

interface Toast {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface ToastHook {
  toast: (toast: Toast) => void;
}

export const useGameShareManager = (
  miniGame: MiniGame, 
  toast: ToastHook, 
  onShare?: () => Promise<string>
) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;
    
    try {
      setIsSharing(true);
      
      if (onShare) {
        const shareUrl = await onShare();
        if (shareUrl) {
          toast.toast({
            title: "Game đã được chia sẻ",
            description: "Liên kết đã được tạo thành công.",
          });
        }
      } else {
        // Fallback sharing method
        const shareData = {
          title: miniGame.title || 'Game tương tác',
          text: 'Hãy chơi game này cùng tôi!',
          url: window.location.href
        };
        
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          toast.toast({
            title: "Đã sao chép liên kết",
            description: "Liên kết đã được sao chép vào clipboard.",
          });
        }
      }
    } catch (error) {
      console.error('Error sharing game:', error);
      toast.toast({
        title: "Lỗi chia sẻ",
        description: "Không thể chia sẻ game. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  return {
    isSharing,
    handleShare
  };
};

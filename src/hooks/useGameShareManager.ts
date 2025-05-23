import { useState } from 'react';
import { saveGameForSharing } from '@/lib/gameExport';
import { ToastType } from '@/hooks/use-toast';

interface MiniGame {
  title?: string;
  content: string;
}

export const useGameShareManager = (
  miniGame: MiniGame, 
  toast: ToastType,
  onShare?: () => Promise<string>
) => {
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const handleShare = async (): Promise<string | void> => {
    if (!miniGame?.content) return;
    
    try {
      setIsSharing(true);
      toast({
        title: "Đang xử lý",
        description: "Đang tạo liên kết chia sẻ...",
      });
      
      if (onShare) {
        return await onShare();
      } else {
        const url = await saveGameForSharing(
          miniGame.title || 'Game tương tác',
          'custom',
          miniGame,
          miniGame.content
        );
        
        setIsSharing(false);
        return url;
      }
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
      setIsSharing(false);
      return undefined;
    }
  };

  return {
    isSharing,
    handleShare
  };
};

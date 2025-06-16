
import { useState } from 'react';
import { saveGameForSharing } from '@/utils/gameExport';
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
    if (!miniGame?.content) {
      toast({
        title: "Lỗi chia sẻ",
        description: "Không có nội dung game để chia sẻ.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSharing(true);
      
      toast({
        title: "Đang xử lý",
        description: "Đang tạo liên kết chia sẻ...",
      });
      
      if (onShare) {
        const result = await onShare();
        setIsSharing(false);
        return result;
      } else {
        const url = await saveGameForSharing(
          miniGame.title || 'Game tương tác',
          'custom',
          miniGame,
          miniGame.content
        );
        
        setIsSharing(false);
        
        if (url) {
          toast({
            title: "Chia sẻ thành công! 🎉",
            description: "Link chia sẻ đã được tạo.",
          });
          return url;
        } else {
          throw new Error("Không thể tạo URL chia sẻ");
        }
      }
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: error instanceof Error ? error.message : "Không thể tạo link chia sẻ. Vui lòng thử lại.",
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

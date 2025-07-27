import { useState } from 'react';
import { saveCustomGameForSharing } from '@/utils/customGameExport';
import { ToastType } from '@/hooks/use-toast';

interface CustomMiniGame {
  title?: string;
  content: string;
}

export const useCustomGameShareManager = (
  miniGame: CustomMiniGame, 
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
        // For custom games, save the HTML content directly
        const url = await saveCustomGameForSharing(
          miniGame.title || 'Game tương tác',
          miniGame, // Pass the whole miniGame as content
          miniGame.content, // HTML content
          `Custom game: ${miniGame.title || 'Game tương tác'}`
        );
        
        setIsSharing(false);
        
        if (url) {
          toast({
            title: "Chia sẻ thành công! 🎉",
            description: "Link chia sẻ custom game đã được tạo.",
          });
          return url;
        } else {
          throw new Error("Không thể tạo URL chia sẻ");
        }
      }
    } catch (error) {
      console.error("Error sharing custom game:", error);
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
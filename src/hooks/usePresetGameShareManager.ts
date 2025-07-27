import { useState } from 'react';
import { savePresetGameForSharing } from '@/utils/presetGameExport';
import { ToastType } from '@/hooks/use-toast';

interface PresetMiniGame {
  title?: string;
  content: string;
  gameType?: string;
  data?: any;
}

export const usePresetGameShareManager = (
  miniGame: PresetMiniGame, 
  toast: ToastType,
  onShare?: () => Promise<string>
) => {
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const handleShare = async (): Promise<string | void> => {
    if (!miniGame?.data && !miniGame?.content) {
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
        // For preset games, use the structured data
        const gameData = miniGame.data || miniGame.content;
        const gameType = miniGame.gameType || detectGameType(gameData);
        
        const url = await savePresetGameForSharing(
          miniGame.title || 'Game tương tác',
          gameType,
          gameData,
          `Preset game: ${miniGame.title || 'Game tương tác'}`
        );
        
        setIsSharing(false);
        
        if (url) {
          toast({
            title: "Chia sẻ thành công! 🎉",
            description: "Link chia sẻ preset game đã được tạo.",
          });
          return url;
        } else {
          throw new Error("Không thể tạo URL chia sẻ");
        }
      }
    } catch (error) {
      console.error("Error sharing preset game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: error instanceof Error ? error.message : "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
      setIsSharing(false);
      return undefined;
    }
  };

  // Detect game type from content structure
  const detectGameType = (data: any): string => {
    if (typeof data === 'object' && data !== null) {
      if (data.questions) return 'quiz';
      if (data.cards) return 'flashcards';
      if (data.pairs) return 'memory';
      if (data.items) return 'matching';
      if (data.statements) return 'truefalse';
      if (data.words) return 'wordsearch';
    }
    return 'quiz'; // default
  };

  return {
    isSharing,
    handleShare
  };
};
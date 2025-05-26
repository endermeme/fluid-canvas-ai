
import { useState, useCallback } from 'react';
import { saveGameForSharing } from '@/utils/gameExport';

interface MiniGame {
  title?: string;
  content: string;
}

export const useGameShareManager = (
  miniGame: MiniGame,
  toast: any,
  onShare?: () => Promise<string>
) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (isSharing) return;

    setIsSharing(true);
    
    try {
      let shareUrl = '';
      
      if (onShare) {
        shareUrl = await onShare();
      } else {
        shareUrl = await saveGameForSharing(
          miniGame.title || 'Game Tương Tác',
          'custom',
          miniGame,
          miniGame.content
        );
      }

      if (shareUrl) {
        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Đã chia sẻ thành công",
            description: "Liên kết đã được sao chép vào clipboard.",
          });
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          toast({
            title: "Game đã được chia sẻ",
            description: `Liên kết: ${shareUrl}`,
          });
        }
      } else {
        throw new Error('Không thể tạo liên kết chia sẻ');
      }
    } catch (error) {
      console.error('Error sharing game:', error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể chia sẻ game. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, onShare, miniGame, toast]);

  return {
    isSharing,
    handleShare
  };
};

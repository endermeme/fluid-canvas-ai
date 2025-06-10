
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';

export const useGameSharing = () => {
  const [shareUrl, setShareUrl] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async (gameContent: any, gameType: string, getGameTypeName: () => string) => {
    try {
      if (!gameContent) return;
      
      const gameContainer = document.getElementById('game-container');
      let html = gameContainer?.innerHTML || '';
      
      const encodedContent = encodeURIComponent(JSON.stringify(gameContent));
      html = `<div data-game-content="${encodedContent}">${html}</div>`;
      
      const shareUrl = await saveGameForSharing(
        gameContent.title || getGameTypeName(),
        gameType,
        gameContent,
        html
      );
      
      if (shareUrl) {
        setShareUrl(shareUrl);
        setShowShareDialog(true);
        
        toast({
          title: "Game đã được chia sẻ",
          description: "Đường dẫn đã được tạo để chia sẻ trò chơi.",
        });
      } else {
        toast({
          title: "Không thể chia sẻ game",
          description: "Đã xảy ra lỗi khi tạo đường dẫn. Vui lòng thử lại.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
      });
  };

  return {
    shareUrl,
    showShareDialog,
    copied,
    setShowShareDialog,
    handleShare,
    handleCopyLink
  };
};

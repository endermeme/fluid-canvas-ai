
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MiniGame {
  title?: string;
  content: string;
}

interface ToastFunction {
  (options: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
  }): void;
}

export const useGameShareManager = (
  miniGame: MiniGame | null,
  toast: ToastFunction,
  onShare?: () => Promise<string>
) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!miniGame?.content) {
      toast({
        title: "Lỗi",
        description: "Không có game để chia sẻ",
        variant: "destructive"
      });
      return;
    }

    // If custom onShare is provided, use it
    if (onShare) {
      try {
        setIsSharing(true);
        const shareUrl = await onShare();
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Đã sao chép",
          description: "Link chia sẻ đã được sao chép vào clipboard",
        });
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
      return;
    }

    // Default sharing logic
    try {
      setIsSharing(true);

      console.log('🎮 Sharing game:', {
        title: miniGame.title,
        contentLength: miniGame.content.length
      });

      const { data, error } = await supabase
        .from('games')
        .insert({
          title: miniGame.title || 'Game Tùy Chỉnh',
          html_content: miniGame.content,
          content: miniGame.content,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('🎮 Error saving game:', error);
        throw error;
      }

      if (!data?.id) {
        throw new Error('Không nhận được ID game');
      }

      const shareUrl = `${window.location.origin}/shared-game/${data.id}`;
      
      console.log('🎮 Game saved successfully:', {
        gameId: data.id,
        shareUrl
      });

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);

      toast({
        title: "Đã lưu và sao chép",
        description: "Link chia sẻ đã được sao chép vào clipboard",
      });

    } catch (error) {
      console.error('🎮 Error sharing game:', error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể chia sẻ game. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  }, [miniGame, toast, onShare]);

  return {
    isSharing,
    handleShare
  };
};

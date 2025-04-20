
import React, { useEffect, useRef, useState } from 'react';
import { MiniGame } from './generator/geminiGenerator';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { enhanceIframeContent } from './custom-games/utils/iframe-utils';
import GameHeader from './components/GameHeader';
import GameContainer from './components/GameContainer';

interface GameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
  extraButton?: React.ReactNode;
}

const GameView: React.FC<GameViewProps> = ({ miniGame, onBack, extraButton }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [shareInProgress, setShareInProgress] = useState(false);
  const [gameStats, setGameStats] = useState<{score?: number; completed?: boolean; totalTime?: number}>({});
  const navigate = useNavigate();

  useEffect(() => {
    const saveGameToDb = async () => {
      if (miniGame && miniGame.content) {
        try {
          const { data, error } = await supabase
            .from('games')
            .insert({
              title: miniGame.title || "Minigame tương tác",
              game_type: "custom-game",
              html_content: miniGame.content,
              is_published: true,
              description: `Custom game: ${miniGame.title || "Minigame tương tác"}`
            })
            .select()
            .single();

          if (error) throw error;
          
          console.log("Game saved successfully:", data);
        } catch (e) {
          console.error("Error saving game to database:", e);
        }
      }
    };
    
    saveGameToDb();
  }, [miniGame]);

  const handleShare = async () => {
    if (shareInProgress) return;
    
    try {
      setShareInProgress(true);
      
      const { data, error } = await supabase
        .from('games')
        .insert({
          title: miniGame.title || "Minigame tương tác",
          game_type: "custom-game",
          html_content: miniGame.content,
          is_published: true,
          description: `Shared game: ${miniGame.title || "Minigame tương tác"}`
        })
        .select()
        .single();

      if (error) throw error;

      // Create a slug from the title for more descriptive URL
      const slug = (miniGame.title || "minigame").toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
      const shareUrl = `${window.location.origin}/play/custom-game/${slug}/${data.id}`;
      
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link Chia Sẻ Đã Được Sao Chép",
        description: "Đã sao chép liên kết vào clipboard. Link có hiệu lực trong 48 giờ.",
      });
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Lỗi Chia Sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setShareInProgress(false);
    }
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  
  const handleReloadGame = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.src = 'about:blank';
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.srcdoc = enhanceIframeContent(miniGame.content, miniGame.title);
          }
        }, 100);
        setGameStats({});
        setIframeError(null);
      } catch (error) {
        console.error("Error reloading game:", error);
        setIframeError("Failed to reload game. Please try again.");
      }
    }
  };

  const handleIframeLoad = () => {
    try {
      if (!iframeRef.current) return;
      
      setIframeError(null);

      window.addEventListener('message', (event) => {
        try {
          const data = event.data;
          if (data && typeof data === 'object') {
            if (data.type === 'gameStats' && data.payload) {
              setGameStats(data.payload);
              
              if (data.payload.completed) {
                toast({
                  title: "Trò chơi đã hoàn thành!",
                  description: data.payload.score !== undefined 
                    ? `Điểm số của bạn: ${data.payload.score}` 
                    : "Chúc mừng bạn đã hoàn thành trò chơi!",
                });
              }
            }
          }
        } catch (err) {
          console.error("Error processing iframe message:", err);
        }
      });
    } catch (e) {
      console.error("General error in handleIframeLoad:", e);
      setIframeError("Lỗi khi tải minigame. Vui lòng thử lại.");
    }
  };

  if (!miniGame || !miniGame.content) {
    return <div>Không thể tải minigame</div>;
  }

  const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <GameHeader
        title={miniGame.title || "Minigame tương tác"}
        onBack={handleBackToHome}
        onRefresh={handleReloadGame}
        onShare={handleShare}
        score={gameStats.score}
        extraButton={extraButton}
        progress={100} // Adding the missing required props
        currentItem={1}
        totalItems={1}
      />
      
      <GameContainer
        iframeRef={iframeRef}
        content={enhancedContent}
        title={miniGame.title}
        error={iframeError}
        onReload={handleReloadGame}
      />
    </div>
  );
};

export default GameView;

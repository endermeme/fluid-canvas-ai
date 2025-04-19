
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Share2 } from 'lucide-react';
import EnhancedGameView from '@/custom-games/components/EnhancedGameView';
import { StoredGame } from '@/types/game';
import { STORAGE_KEYS } from '@/core/utils/constants';
import GameLoading from '@/preset-games/GameLoading';
import GameError from '@/preset-games/GameError';

interface RouteParams {
  type: string;
  slug: string;
  id: string;
}

const PlayGamePage: React.FC = () => {
  const { type, slug, id } = useParams<keyof RouteParams>() as RouteParams;
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadGame = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (type === 'history') {
          // Load game from history
          const storedGames = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
          if (storedGames) {
            const games: StoredGame[] = JSON.parse(storedGames);
            const found = games.find(game => game.id === id);
            
            if (found) {
              setGame(found);
            } else {
              throw new Error('Không tìm thấy game');
            }
          } else {
            throw new Error('Không có lịch sử game');
          }
        } else if (type === 'custom-game') {
          // Here you would fetch from API or another source
          // For now, we'll simulate with a placeholder
          setError('API integration not implemented yet');
        } else {
          throw new Error('Loại game không hợp lệ');
        }
      } catch (error) {
        console.error('Error loading game:', error);
        setError('Không thể tải game. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [type, id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    // Copy current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: "Đã sao chép liên kết",
      description: "Liên kết đã được sao chép vào clipboard",
    });
  };

  if (loading) {
    return <GameLoading topic={slug.replace(/-/g, ' ')} />;
  }

  if (error || !game) {
    return (
      <GameError 
        errorMessage={error || 'Không tìm thấy game'} 
        onRetry={handleBack} 
        topic={slug.replace(/-/g, ' ')} 
      />
    );
  }

  return (
    <div className="h-full">
      <EnhancedGameView 
        miniGame={{
          title: game.title,
          content: game.htmlContent
        }}
        onBack={handleBack}
        extraButton={
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleShare}
            className="text-xs h-7"
          >
            <Share2 className="h-3 w-3 mr-1" />
            Chia sẻ
          </Button>
        }
      />
    </div>
  );
};

export default PlayGamePage;


import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { GameContainer } from '@/components/ui/game';
import EnhancedGameView from '@/components/custom/EnhancedGameView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SharedGameData {
  id: string;
  title: string;
  type: string;
  content: any;
  html: string;
  createdAt: string;
}

const GameSharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameData, setGameData] = useState<SharedGameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGameData = async () => {
      if (!id) {
        setError('ID game không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const storedGames = localStorage.getItem('sharedGames');
        if (!storedGames) {
          setError('Không tìm thấy game được chia sẻ');
          setLoading(false);
          return;
        }

        const games = JSON.parse(storedGames);
        const game = games.find((g: SharedGameData) => g.id === id);
        
        if (!game) {
          setError('Game không tồn tại hoặc đã bị xóa');
          setLoading(false);
          return;
        }

        setGameData(game);
      } catch (error) {
        console.error('Error loading shared game:', error);
        setError('Lỗi khi tải game');
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleShare = async (): Promise<string> => {
    if (!gameData) return '';
    
    const shareUrl = `${window.location.origin}/share/${gameData.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Đã sao chép liên kết",
        description: "Liên kết đã được sao chép vào clipboard.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
    
    return shareUrl;
  };

  if (loading) {
    return (
      <GameContainer 
        title="Đang tải game..."
        showBackButton={true}
        onBack={handleBack}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Đang tải game được chia sẻ...</p>
          </div>
        </div>
      </GameContainer>
    );
  }

  if (error || !gameData) {
    return (
      <GameContainer 
        title="Lỗi"
        showBackButton={true}
        onBack={handleBack}
      >
        <div className="flex items-center justify-center h-full">
          <Card className="p-6 max-w-md">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-xl font-bold mb-2">Không thể tải game</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={handleBack}>Quay lại trang chủ</Button>
            </div>
          </Card>
        </div>
      </GameContainer>
    );
  }

  const miniGame = {
    title: gameData.title,
    content: gameData.html || JSON.stringify(gameData.content)
  };

  return (
    <GameContainer 
      title={gameData.title}
      showBackButton={true}
      onBack={handleBack}
    >
      <EnhancedGameView 
        miniGame={miniGame}
        onBack={handleBack}
        onShare={handleShare}
        hideHeader={false}
      />
    </GameContainer>
  );
};

export default GameSharePage;

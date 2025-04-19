
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Play, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { STORAGE_KEYS } from '@/core/utils/constants';
import { StoredGame } from '@/types/game';

const GameHistoryPage: React.FC = () => {
  const [games, setGames] = useState<StoredGame[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load games from localStorage
    try {
      const storedGames = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
      if (storedGames) {
        setGames(JSON.parse(storedGames));
      }
    } catch (error) {
      console.error('Error loading game history:', error);
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePlayGame = (game: StoredGame) => {
    // Create a slug from the title
    const slug = game.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    navigate(`/play/history/${slug}/${game.id}`);
  };

  const handleDeleteGame = (gameId: string) => {
    const updatedGames = games.filter(game => game.id !== gameId);
    setGames(updatedGames);
    
    // Save updated games to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updatedGames));
      
      toast({
        title: "Game đã xóa",
        description: "Game đã được xóa khỏi lịch sử",
      });
    } catch (error) {
      console.error('Error saving game history:', error);
      
      toast({
        title: "Lỗi",
        description: "Không thể xóa game khỏi lịch sử",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: number | Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Lịch Sử Game</h1>
        </div>
        
        <div className="space-y-4">
          {games.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">Bạn chưa có game nào trong lịch sử</p>
              <Button onClick={() => navigate('/custom-games')}>
                Tạo Game Mới
              </Button>
            </Card>
          ) : (
            games.map(game => (
              <Card key={game.id} className="p-4 hover:bg-primary/5 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium">{game.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(game.createdAt)}</span>
                    </div>
                    {game.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {game.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayGame(game)}
                      className="bg-primary/5 border-primary/20"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Chơi
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGame(game.id)}
                      className="bg-destructive/5 border-destructive/20 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHistoryPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cleanupExpiredGames, getRemainingTime, StoredGame } from '@/services/storage';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Button } from '@/components/ui/button';
import { Plus, Clock, ExternalLink } from 'lucide-react';

const GameHistoryPage: React.FC = () => {
  const [games, setGames] = useState<StoredGame[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    cleanupExpiredGames();
    loadGames();
  }, []);
  
  const loadGames = () => {
    const gamesJson = localStorage.getItem('shared_games');
    if (gamesJson) {
      const parsedGames: StoredGame[] = JSON.parse(gamesJson);
      const now = Date.now();
      const validGames = parsedGames.filter(game => game.expiresAt > now);
      setGames(validGames);
    } else {
      setGames([]);
    }
  };
  
  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };
  
  const handleCreateNew = () => {
    navigate('/custom-game');
  };
  
  return (
    <QuizContainer
      title="Lịch Sử Game"
      showBackButton={true}
      onBack={() => navigate('/')}
    >
      <div className="p-4 h-full overflow-auto">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center mb-4 text-muted-foreground">Chưa có game nào được tạo</p>
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus size={16} />
              Tạo Game Mới
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {games.map(game => (
              <div 
                key={game.id}
                className="border rounded-lg p-4 hover:bg-accent/40 transition-colors cursor-pointer"
                onClick={() => handleGameClick(game.id)}
              >
                <h3 className="font-medium mb-1">{game.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{game.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>Còn lại: {getRemainingTime(game.expiresAt)}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game.id);
                    }}
                  >
                    <ExternalLink size={12} className="mr-1" />
                    Mở
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </QuizContainer>
  );
};

export default GameHistoryPage;

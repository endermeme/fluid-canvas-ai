
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bookmark } from 'lucide-react';
import { StoredGame, cleanupExpiredGames, getRemainingTime } from '@/utils/gameExport';
import { useNavigate } from 'react-router-dom';

interface HistoryPanelProps {
  onSelectGame?: (game: StoredGame) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onSelectGame }) => {
  const [games, setGames] = useState<StoredGame[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Load games when opening the panel
  const loadGames = () => {
    cleanupExpiredGames(); // First clean up expired games
    const gamesJson = localStorage.getItem('shared_games');
    if (gamesJson) {
      const parsedGames: StoredGame[] = JSON.parse(gamesJson);
      const now = Date.now();
      // Only show non-expired games
      const validGames = parsedGames.filter(game => game.expiresAt > now);
      setGames(validGames);
    } else {
      setGames([]);
    }
  };

  // Handle game selection
  const handleSelectGame = (game: StoredGame) => {
    if (onSelectGame) {
      onSelectGame(game);
    } else {
      navigate(`/quiz/shared/${game.id}`);
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        loadGames();
      }
      // Prevent scroll issues when sheet is open
      document.body.style.overflow = open ? 'hidden' : '';
    }}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="fixed right-4 top-4 z-50 bg-primary/10 hover:bg-primary/20 shadow-sm"
          title="Lịch sử game"
          onClick={() => {
            loadGames();
          }}
        >
          <Bookmark className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Lịch sử game</h2>
          </div>
          
          <div className="space-y-4">
            {games.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có game nào được tạo</p>
            ) : (
              games.map((game) => (
                <div
                  key={game.id}
                  className="group relative rounded-lg border p-4 hover:bg-accent/40 transition-colors"
                >
                  <h3 className="font-medium">{game.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{game.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Hết hạn trong: {getRemainingTime(game.expiresAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectGame(game)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Mở lại
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryPanel;

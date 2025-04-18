
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bookmark } from 'lucide-react';
import { getRemainingTime } from '@/utils/gameExport';
import { StoredGame } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

interface HistoryPanelProps {
  onSelectGame?: (game: StoredGame) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  onSelectGame,
  isOpen = false,
  onClose 
}) => {
  const [games, setGames] = useState<StoredGame[]>([]);
  const navigate = useNavigate();
  
  // Load games when opening the panel
  const loadGames = () => {
    // Using local storage as fallback until Supabase implementation is complete
    const gamesJson = localStorage.getItem('shared_games');
    if (gamesJson) {
      const parsedGames: StoredGame[] = JSON.parse(gamesJson);
      const now = Date.now();
      // Only show non-expired games
      const validGames = parsedGames.filter(game => {
        const expireDate = typeof game.expiresAt === 'number' ? 
          game.expiresAt : 
          game.expiresAt.getTime();
        return expireDate > now;
      });
      setGames(validGames);
    } else {
      setGames([]);
    }
  };

  // Load games when the panel opens
  useEffect(() => {
    if (isOpen) {
      loadGames();
    }
  }, [isOpen]);

  // Handle game selection
  const handleSelectGame = (game: StoredGame) => {
    if (onSelectGame) {
      onSelectGame(game);
    } else {
      navigate(`/quiz/shared/${game.id}`);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (onClose && !open) {
        onClose();
      }
      // Prevent scroll issues when sheet is open
      document.body.style.overflow = open ? 'hidden' : '';
    }}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto" side="right">
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
                      onClick={() => onSelectGame?.(game)}
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

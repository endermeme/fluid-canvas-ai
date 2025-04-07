
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Copy, ExternalLink } from 'lucide-react';
import { StoredGame, cleanupExpiredGames, getRemainingTime } from '@/utils/gameExport';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SourceCodeViewer from '@/components/quiz/SourceCodeViewer';

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
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  // Toggle expanded state for a game
  const toggleExpandGame = (gameId: string) => {
    setExpandedGameId(expandedGameId === gameId ? null : gameId);
  };

  // Copy share link
  const copyShareLink = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/quiz/shared/${gameId}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link Chia Sẻ Đã Được Sao Chép",
      description: "Đã sao chép liên kết vào clipboard.",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (onClose && !open) {
        onClose();
      }
      // Prevent scroll issues when sheet is open
      document.body.style.overflow = open ? 'hidden' : '';
    }}>
      <SheetContent className="w-[90%] sm:w-[540px] overflow-y-auto">
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
                  className="group relative rounded-lg border border-border p-4 hover:bg-accent/20 transition-colors cursor-pointer"
                  onClick={() => toggleExpandGame(game.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{game.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{getRemainingTime(game.expiresAt)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">{game.description}</p>
                  
                  {expandedGameId === game.id && (
                    <div className="mt-4 border-t pt-3">
                      <div className="mb-3">
                        <SourceCodeViewer htmlContent={game.htmlContent} />
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => copyShareLink(game.id, e)}
                      className="h-8"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Sao chép link
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectGame(game);
                      }}
                      className="h-8"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Mở game
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

import React from 'react';
import PresetGameRenderer from '../PresetGameRenderer';
import PresetGameHeader from '../../preset-games/PresetGameHeader';
import { useToast } from '@/hooks/use-toast';
import { useGameShareManager } from '../../hooks/useGameShareManager';
import { useGameScoreManager } from '../../hooks/useGameScoreManager';
import { Card } from "@/components/ui/card";
import { useParams } from 'react-router-dom';

interface PresetGameViewProps {
  miniGame: {
    title?: string;
    content: string;
    gameType?: string;
    data?: any;
  };
  onReload?: () => void;
  className?: string;
  onBack?: () => void;
  hideHeader?: boolean;
  onShare?: () => Promise<string>;
  onNewGame?: () => void;
  extraButton?: React.ReactNode;
  isTeacher?: boolean;
  gameExpired?: boolean;
  gameId?: string;
}

const PresetGameView: React.FC<PresetGameViewProps> = ({ 
  miniGame, 
  onReload,
  className,
  onBack,
  hideHeader = false,
  onShare,
  onNewGame,
  extraButton,
  isTeacher = false,
  gameExpired = false,
  gameId
}) => {
  const { toast } = useToast();
  const { isSharing, handleShare } = useGameShareManager(miniGame, toast, onShare);
  const { saveGameScore } = useGameScoreManager();
  const { gameId: urlGameId } = useParams();
  const currentGameId = gameId || urlGameId;

  const refreshGame = () => {
    onReload?.();
  };

  const handleGameComplete = async (result: any) => {
    if (currentGameId && result && typeof result.score === 'number') {
      const registeredGamesStr = localStorage.getItem('registered_games');
      let playerName = 'Người chơi';
      
      if (registeredGamesStr) {
        const registeredGames = JSON.parse(registeredGamesStr);
        if (registeredGames.includes(currentGameId)) {
          const gameSessionsStr = localStorage.getItem('game_sessions');
          if (gameSessionsStr) {
            const sessions = JSON.parse(gameSessionsStr);
            const session = sessions.find((s: any) => s.id === currentGameId);
            if (session && session.participants && session.participants.length > 0) {
              playerName = session.participants[session.participants.length - 1].name;
            }
          }
        }
      }

      await saveGameScore({
        gameId: currentGameId,
        playerName,
        score: result.score,
        totalQuestions: result.totalQuestions || result.total || 10,
        completionTime: result.completionTime,
        gameType: miniGame.gameType || 'preset'
      });
    }
  };

  return (
    <div className={`w-full h-screen max-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-blue-50/80 via-sky-50/80 to-blue-100/80 dark:from-blue-950/80 dark:via-sky-950/80 dark:to-blue-950/80 ${className || ''}`}>
      {!hideHeader && (
        <PresetGameHeader
          onBack={onBack}
          onShare={handleShare}
          showShare={!!onShare}
          isGameCreated={true}
        />
      )}
      
      <div className="flex-1 relative overflow-hidden p-2 sm:p-4">
        <Card className="relative w-full h-full overflow-hidden shadow-xl border-2 border-blue-200/40 dark:border-blue-700/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <PresetGameRenderer 
            gameType={miniGame.gameType!}
            data={miniGame.data}
            onBack={onBack}
            onGameComplete={handleGameComplete}
          />
        </Card>
        
        {extraButton && (
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10">
            {extraButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetGameView;
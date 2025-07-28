import React from 'react';
import GameErrorDisplay from '../game-components/GameErrorDisplay';
import GameLoadingIndicator from '../game-components/GameLoadingIndicator';
import GameIframeRenderer from './GameIframeRenderer';
import { useToast } from '@/hooks/use-toast';
import { useIframeManager } from '../../hooks/useIframeManager';
import { Card } from "@/components/ui/card";

interface CustomGameViewProps {
  miniGame: {
    title?: string;
    content: string;
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
  playerName?: string;
}

const CustomGameView: React.FC<CustomGameViewProps> = ({ 
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
  gameId,
  playerName
}) => {
  const { toast } = useToast();
  
  const handleGameComplete = () => {
    toast({
      title: "Hoàn thành! 🎉",
      description: "Game đã hoàn tất!",
    });
  };
  const { 
    iframeRef, 
    iframeError, 
    isIframeLoaded, 
    loadingProgress,
    refreshGame,
    handleFullscreen 
  } = useIframeManager(
    miniGame, 
    onReload, 
    gameExpired,
    handleGameComplete
  );

  return (
    <div className={`w-full h-screen max-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-blue-50/80 via-sky-50/80 to-blue-100/80 dark:from-blue-950/80 dark:via-sky-950/80 dark:to-blue-950/80 ${className || ''}`}>
      
      <div className="flex-1 relative overflow-hidden p-2 sm:p-4">
        {iframeError ? (
          <GameErrorDisplay 
            error={iframeError} 
            onRetry={refreshGame} 
          />
        ) : (
          <Card className="relative w-full h-full overflow-hidden shadow-xl border-2 border-blue-200/40 dark:border-blue-700/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            {!isIframeLoaded && (
              <GameLoadingIndicator 
                progress={loadingProgress}
              />
            )}
            <GameIframeRenderer 
              ref={iframeRef} 
              title={miniGame.title || "Game tương tác"} 
              isLoaded={isIframeLoaded}
            />
          </Card>
        )}
        
        {extraButton && (
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10">
            {extraButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomGameView;
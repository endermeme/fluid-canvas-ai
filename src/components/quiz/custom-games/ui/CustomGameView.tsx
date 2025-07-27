import React from 'react';
import GameErrorDisplay from '../game-components/GameErrorDisplay';
import GameLoadingIndicator from '../game-components/GameLoadingIndicator';
import GameIframeRenderer from './GameIframeRenderer';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { useGameShareManager } from '../../hooks/useGameShareManager';
import { useIframeManager } from '../../hooks/useIframeManager';
import { useCustomGameScoreManager } from '@/hooks/useCustomGameScoreManager';
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
  const { isSharing, handleShare } = useGameShareManager(miniGame, toast, onShare);
  const { saveCustomGameScore } = useCustomGameScoreManager();
  
  const handleScoreUpdate = (score: number, totalQuestions: number) => {
    console.log('Score updated:', score, '/', totalQuestions);
  };
  
  const handleGameComplete = async (finalScore: number, completionTime: number, extraData?: any) => {
    if (gameId && playerName) {
      const success = await saveCustomGameScore({
        gameId,
        playerName,
        score: finalScore,
        totalQuestions: extraData?.totalQuestions || Math.ceil(finalScore / 10),
        completionTime
      });
      
      if (success) {
        toast({
          title: "Điểm đã được lưu! 🎉",
          description: `Bạn đạt ${finalScore} điểm trong ${Math.round(completionTime)} giây`,
        });
      }
    }
  };
  
  const handleProgressUpdate = (progress: number, currentLevel: number) => {
    console.log('Progress updated:', progress, '% - Level:', currentLevel);
  };
  const { 
    iframeRef,
    iframeError, 
    isIframeLoaded, 
    loadingProgress,
    gameScore,
    gameProgress,
    refreshGame,
    handleFullscreen 
  } = useIframeManager(
    miniGame, 
    onReload, 
    gameExpired,
    handleScoreUpdate,
    handleGameComplete,
    handleProgressUpdate
  );

  return (
    <div className={`w-full h-screen max-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-blue-50/80 via-sky-50/80 to-blue-100/80 dark:from-blue-950/80 dark:via-sky-950/80 dark:to-blue-950/80 ${className || ''}`}>
      {!hideHeader && (
        <CustomGameHeader
          onBack={onBack}
          onRefresh={refreshGame}
          onFullscreen={handleFullscreen}
          onShare={handleShare}
          onNewGame={onNewGame}
          showGameControls={true}
          isSharing={isSharing}
          isTeacher={isTeacher}
          gameType={miniGame?.title}
        />
      )}
      
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
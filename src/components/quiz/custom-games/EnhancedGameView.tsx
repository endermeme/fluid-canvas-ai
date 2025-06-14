
import React from 'react';
import GameErrorDisplay from './game-components/GameErrorDisplay';
import GameLoadingIndicator from './game-components/GameLoadingIndicator';
import GameIframeRenderer from './game-components/GameIframeRenderer';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { useGameShareManager } from '../hooks/useGameShareManager';
import { useIframeManager } from '../hooks/useIframeManager';
import { Card } from "@/components/ui/card";

interface EnhancedGameViewProps {
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
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onReload,
  className,
  onBack,
  hideHeader = false,
  onShare,
  onNewGame,
  extraButton,
  isTeacher = false,
  gameExpired = false
}) => {
  const { toast } = useToast();
  const { isSharing, handleShare } = useGameShareManager(miniGame, toast, onShare);
  const { 
    iframeRef,
    iframeError, 
    isIframeLoaded, 
    loadingProgress,
    refreshGame,
    handleFullscreen 
  } = useIframeManager(miniGame, onReload, gameExpired);

  return (
    <div className={`w-full h-full flex flex-col bg-gradient-to-br from-background via-background/98 to-primary/3 ${className || ''}`}>
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
      
      <div className="flex-1 relative overflow-hidden p-4">
        {iframeError ? (
          <GameErrorDisplay 
            error={iframeError} 
            onRetry={refreshGame} 
          />
        ) : (
          <Card className={`relative w-full h-full overflow-hidden shadow-xl border-primary/20 transition-all duration-500 ${
            isIframeLoaded ? 'shadow-2xl scale-100' : 'shadow-lg scale-[0.98]'
          }`}>
            {!isIframeLoaded && (
              <GameLoadingIndicator 
                progress={loadingProgress}
              />
            )}
            <div className={`w-full h-full transition-opacity duration-700 ${
              isIframeLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
              <GameIframeRenderer 
                ref={iframeRef} 
                title={miniGame.title || "Game tương tác"} 
                isLoaded={isIframeLoaded}
              />
            </div>
          </Card>
        )}
        
        {extraButton && (
          <div className="absolute bottom-6 right-6 z-10 transform transition-all duration-300 hover:scale-105">
            {extraButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGameView;

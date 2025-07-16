
import React from 'react';
import GameErrorDisplay from '../game-components/GameErrorDisplay';
import GameLoadingIndicator from '../game-components/GameLoadingIndicator';
import GameIframeRenderer from './GameIframeRenderer';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { useGameShareManager } from '../../hooks/useGameShareManager';
import { useIframeManager } from '../../hooks/useIframeManager';

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
    <div className={`w-full h-full flex flex-col ${className || ''}`} style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
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
      
      <div className="flex-1 relative overflow-hidden">
        {iframeError ? (
          <GameErrorDisplay 
            error={iframeError} 
            onRetry={refreshGame} 
          />
        ) : (
          <div className="absolute inset-0 w-full h-full">
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
          </div>
        )}
        
        {extraButton && (
          <div className="absolute bottom-3 right-3 z-10">
            {extraButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGameView;

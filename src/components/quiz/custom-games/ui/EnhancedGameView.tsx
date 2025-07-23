
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

  // Check if this is a preset game
  const isPresetGame = miniGame.content && (() => {
    try {
      const parsed = JSON.parse(miniGame.content);
      return parsed.type === 'preset-game';
    } catch {
      return false;
    }
  })();

  if (isPresetGame) {
    let gameData;
    try {
      gameData = JSON.parse(miniGame.content);
    } catch (error) {
      console.error('Error parsing preset game data:', error);
      return <GameErrorDisplay error="Không thể tải dữ liệu game" onRetry={onReload} />;
    }

    const PresetGameRenderer = React.lazy(() => import('../PresetGameRenderer'));
    
    return (
      <div className={`w-full h-full flex flex-col ${className || ''}`}>
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
            gameType={gameData.gameType}
          />
        )}
        
        <div className="flex-1 overflow-hidden">
          <React.Suspense fallback={<GameLoadingIndicator progress={50} />}>
            <PresetGameRenderer
              gameType={gameData.gameType}
              data={gameData.data}
              onBack={onBack}
            />
          </React.Suspense>
        </div>
        
        {extraButton && (
          <div className="absolute bottom-3 right-3 z-10">
            {extraButton}
          </div>
        )}
      </div>
    );
  }

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

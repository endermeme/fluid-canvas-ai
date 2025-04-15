
import React from 'react';
import BackButton from './header-buttons/BackButton';
import ReloadButton from './header-buttons/ReloadButton';
import ShareButton from './header-buttons/ShareButton';
import ScoreDisplay from './header-buttons/ScoreDisplay';

interface GameViewHeaderProps {
  onBack: () => void;
  onReload: () => void;
  onShare: () => void;
  score?: number;
  shareInProgress?: boolean;
  extraButton?: React.ReactNode;
}

const GameViewHeader: React.FC<GameViewHeaderProps> = ({
  onBack,
  onReload,
  onShare,
  score,
  shareInProgress,
  extraButton
}) => {
  return (
    <div className="flex justify-between items-center p-2 bg-background/80 backdrop-blur-md border-b border-primary/10 z-10">
      <BackButton onClick={onBack} />
      
      <div className="flex items-center gap-1.5">
        {score !== undefined && (
          <ScoreDisplay score={score} />
        )}
        
        <ReloadButton onClick={onReload} />
        
        <ShareButton 
          onClick={onShare}
          disabled={shareInProgress}
        />
        
        {extraButton}
      </div>
    </div>
  );
};

export default GameViewHeader;

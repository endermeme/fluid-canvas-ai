
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, RefreshCw, Trophy, ArrowLeft } from 'lucide-react';

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
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack} 
        className="gap-1 text-xs"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Quay lại
      </Button>
        
      <div className="flex items-center gap-1.5">
        {score !== undefined && (
          <div className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium flex items-center">
            <Trophy className="h-3 w-3 text-primary mr-1" />
            {score} điểm
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReload}
          className="w-8 h-8 p-0"
          title="Chơi lại"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShare}
          disabled={shareInProgress}
          className="gap-1 text-xs"
        >
          <Share2 className="h-3.5 w-3.5" />
          Chia Sẻ
        </Button>
        
        {extraButton}
      </div>
    </div>
  );
};

export default GameViewHeader;

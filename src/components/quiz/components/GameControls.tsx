
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronRight, Lightbulb } from 'lucide-react';

interface GameControlsProps {
  onRestart: () => void;
  onNext?: () => void;
  onHint?: () => void;
  showHint?: boolean;
  isLastItem?: boolean;
  disabled?: boolean;
  className?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onRestart,
  onNext,
  onHint,
  showHint = false,
  isLastItem = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {showHint && onHint && (
        <Button 
          variant="outline"
          onClick={onHint}
          size="sm"
          className="flex-1 bg-background/70 border-primary/20"
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          Gợi ý
        </Button>
      )}
      
      {onNext && (
        <Button 
          onClick={onNext}
          disabled={disabled}
          size="sm"
          className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
        >
          {isLastItem ? 'Xem kết quả' : 'Tiếp theo'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
      
      <Button
        variant="outline"
        onClick={onRestart}
        size="sm"
        className={`${!onNext ? 'w-full' : 'flex-1'} bg-background/70 border-primary/20`}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Làm lại
      </Button>
    </div>
  );
};

export default GameControls;

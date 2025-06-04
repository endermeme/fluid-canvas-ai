
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onCheckSequence: () => void;
  onToggleHint: () => void;
  onRestart: () => void;
  onBack?: () => void;
  canCheck: boolean;
  allowHints: boolean;
  showHintText: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onCheckSequence,
  onToggleHint,
  onRestart,
  onBack,
  canCheck,
  allowHints,
  showHintText
}) => {
  return (
    <div className="game-controls">
      <div className="main-controls">
        <Button 
          onClick={onCheckSequence}
          disabled={!canCheck}
          size="lg"
          className="check-btn"
        >
          Kiểm tra thứ tự
        </Button>
        
        {allowHints && (
          <Button onClick={onToggleHint} variant="outline" className="hint-btn">
            <Lightbulb className="h-4 w-4 mr-2" />
            {showHintText}
          </Button>
        )}
      </div>

      <div className="side-controls">
        <Button onClick={onRestart} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Chơi lại
        </Button>
        {onBack && (
          <Button onClick={onBack} variant="outline" size="sm">
            Về trang chủ
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameControls;

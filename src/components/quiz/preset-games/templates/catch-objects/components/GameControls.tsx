
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  gameState: 'ready' | 'playing' | 'paused' | 'finished';
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
  onNext: () => void;
  onBack?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onStart,
  onPause,
  onRestart,
  onNext,
  onBack
}) => {
  return (
    <div className="game-controls">
      <div className="main-controls">
        {gameState === 'ready' && (
          <Button onClick={onStart} size="lg" className="start-btn">
            <Play className="h-5 w-5 mr-2" />
            Bắt đầu
          </Button>
        )}
        {(gameState === 'playing' || gameState === 'paused') && (
          <Button onClick={onPause} variant="outline" className="pause-btn">
            {gameState === 'playing' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {gameState === 'playing' ? 'Tạm dừng' : 'Tiếp tục'}
          </Button>
        )}
        <Button onClick={onRestart} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Chơi lại
        </Button>
        {gameState !== 'ready' && (
          <Button onClick={onNext} variant="outline">
            Câu tiếp theo
          </Button>
        )}
      </div>

      <div className="side-controls">
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

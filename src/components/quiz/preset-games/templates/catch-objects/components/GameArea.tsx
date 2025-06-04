
import React, { forwardRef } from 'react';
import FallingObject from './FallingObject';
import Basket from './Basket';

interface FallingObjectType {
  id: string;
  content: string;
  x: number;
  y: number;
  isCorrect: boolean;
  speed: number;
}

interface GameAreaProps {
  gameState: 'ready' | 'playing' | 'paused' | 'finished';
  fallingObjects: FallingObjectType[];
  basketPosition: number;
  basketSize: number;
  objectSize: number;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const GameArea = forwardRef<HTMLDivElement, GameAreaProps>(({
  gameState,
  fallingObjects,
  basketPosition,
  basketSize,
  objectSize,
  onMouseMove
}, ref) => {
  return (
    <div 
      ref={ref}
      className="game-area-container"
      onMouseMove={onMouseMove}
    >
      {/* Falling Objects */}
      {fallingObjects.map((obj) => (
        <FallingObject
          key={obj.id}
          object={obj}
          objectSize={objectSize}
        />
      ))}

      {/* Basket */}
      <Basket
        position={basketPosition}
        size={basketSize}
      />

      {/* Instructions */}
      {gameState === 'ready' && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <h2 className="instructions-title">Cách chơi:</h2>
            <p className="instructions-text">Di chuyển chuột để điều khiển rổ</p>
            <p className="instructions-text">Bắt các vật thể đúng, tránh vật thể sai!</p>
          </div>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h2 className="pause-title">Tạm dừng</h2>
          </div>
        </div>
      )}
    </div>
  );
});

GameArea.displayName = 'GameArea';

export default GameArea;

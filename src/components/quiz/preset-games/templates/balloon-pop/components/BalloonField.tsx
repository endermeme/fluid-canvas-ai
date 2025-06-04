
import React, { useState, useEffect } from 'react';
import Balloon from './Balloon';

interface BalloonFieldProps {
  balloons: any[];
  poppedBalloons: number[];
  onBalloonPop: (index: number) => void;
}

const BalloonField: React.FC<BalloonFieldProps> = ({
  balloons,
  poppedBalloons,
  onBalloonPop
}) => {
  const [balloonPositions, setBalloonPositions] = useState<{x: number, y: number, color: string}[]>([]);
  
  const balloonColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#FF8A80', '#80CBC4', '#81C784', '#FFB74D'
  ];

  useEffect(() => {
    if (balloons) {
      const positions = balloons.map((_, index) => ({
        x: Math.random() * 70 + 15,
        y: Math.random() * 60 + 20,
        color: balloonColors[index % balloonColors.length]
      }));
      setBalloonPositions(positions);
    }
  }, [balloons]);

  return (
    <div className="balloon-field">
      {balloons.map((balloon, index) => {
        const position = balloonPositions[index];
        const isPopped = poppedBalloons.includes(index);
        
        if (!position) return null;
        
        return (
          <Balloon
            key={balloon.id}
            color={position.color}
            x={position.x}
            y={position.y}
            isPopped={isPopped}
            onClick={() => !isPopped && onBalloonPop(index)}
          />
        );
      })}
    </div>
  );
};

export default BalloonField;

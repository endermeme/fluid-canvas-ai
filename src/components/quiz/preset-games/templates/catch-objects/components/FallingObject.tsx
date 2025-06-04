
import React from 'react';

interface FallingObjectType {
  id: string;
  content: string;
  x: number;
  y: number;
  isCorrect: boolean;
  speed: number;
}

interface FallingObjectProps {
  object: FallingObjectType;
  objectSize: number;
}

const FallingObject: React.FC<FallingObjectProps> = ({ object, objectSize }) => {
  return (
    <div
      className={`falling-object ${object.isCorrect ? 'correct' : 'wrong'}`}
      style={{
        left: `${object.x}%`,
        top: `${object.y}%`,
        width: `${objectSize}px`,
        height: `${objectSize}px`,
      }}
    >
      <div className="object-content">
        {object.content}
      </div>
    </div>
  );
};

export default FallingObject;

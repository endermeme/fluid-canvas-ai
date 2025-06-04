import React from 'react';

interface BalloonProps {
  color: string;
  x: number;
  y: number;
  isPopped: boolean;
  onClick: () => void;
  index?: number;
}

const Balloon: React.FC<BalloonProps> = ({ color, x, y, isPopped, onClick, index = 0 }) => {
  if (isPopped) {
    return (
      <div 
        className="balloon-popped"
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
      >
        <div className="explosion-effect">
          <span>💥</span>
          <div className="particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate movement boundaries to keep balloons on screen
  const safeX = Math.max(5, Math.min(95, x));
  const safeY = Math.max(10, Math.min(85, y));

  // Different animation patterns based on index
  const getAnimationStyle = () => {
    const patterns = [
      'balloon-float 8s ease-in-out infinite',
      'balloon-sway 6s ease-in-out infinite 1s',
      'balloon-vertical 7s ease-in-out infinite 2s',
      'balloon-diagonal 9s ease-in-out infinite 0.5s',
      'balloon-float 10s ease-in-out infinite 1.5s'
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div 
      className="balloon-container"
      style={{
        left: `${safeX}%`,
        top: `${safeY}%`,
        animation: getAnimationStyle(),
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
    >
      <div className="balloon-wrapper">
        <div 
          className="balloon"
          style={{ 
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            boxShadow: `0 8px 25px ${color}40`,
            borderTopColor: color
          }}
        >
          <div className="balloon-highlight"></div>
          <div className="balloon-shine"></div>
        </div>
        <div className="balloon-string"></div>
      </div>
    </div>
  );
};

export default Balloon;

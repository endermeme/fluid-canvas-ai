
import React from 'react';

interface BalloonProps {
  color: string;
  x: number;
  y: number;
  isPopped: boolean;
  onClick: () => void;
}

const Balloon: React.FC<BalloonProps> = ({ color, x, y, isPopped, onClick }) => {
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

  return (
    <div 
      className="balloon-container"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={onClick}
    >
      <div className="balloon-wrapper">
        <div 
          className="balloon"
          style={{ 
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            boxShadow: `0 8px 25px ${color}40`
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

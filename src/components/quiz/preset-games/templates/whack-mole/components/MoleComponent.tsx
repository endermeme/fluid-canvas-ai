
import React from 'react';

interface Mole {
  id: string;
  holeIndex: number;
  answer: string;
  isCorrect: boolean;
  showTime: number;
}

interface MoleComponentProps {
  mole: Mole;
  isHit: boolean;
  onClick: () => void;
}

const MoleComponent: React.FC<MoleComponentProps> = ({ mole, isHit, onClick }) => {
  if (isHit) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-6xl animate-ping z-10 pointer-events-none">
        💥
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer transform hover:scale-110 transition-transform animate-bounce z-10"
      onClick={onClick}
    >
      {/* Mole Body */}
      <div className={`mole-body w-20 h-16 rounded-full relative shadow-lg transition-all ${
        mole.isCorrect ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gradient-to-b from-red-400 to-red-600'
      }`}>
        {/* Face */}
        <div className="absolute inset-2 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full">
          {/* Eyes */}
          <div className="absolute top-2 left-3 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-2 right-3 w-2 h-2 bg-black rounded-full"></div>
          
          {/* Nose */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>
          
          {/* Mouth */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-white rounded-full"></div>
          
          {/* Ears */}
          <div className="absolute -top-1 left-2 w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="absolute -top-1 right-2 w-3 h-3 bg-gray-600 rounded-full"></div>
          
          {/* Whiskers */}
          <div className="absolute top-3 left-0 w-2 h-px bg-black"></div>
          <div className="absolute top-4 left-0 w-2 h-px bg-black"></div>
          <div className="absolute top-3 right-0 w-2 h-px bg-black"></div>
          <div className="absolute top-4 right-0 w-2 h-px bg-black"></div>
        </div>
      </div>
      
      {/* Answer Label */}
      <div className="absolute -bottom-10 bg-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md max-w-24 truncate border-2 border-gray-300">
        {mole.answer}
      </div>
    </div>
  );
};

export default MoleComponent;

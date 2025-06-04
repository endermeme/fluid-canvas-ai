
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
      {/* Mole Body - Thiết kế mới đẹp hơn */}
      <div className="mole-body w-24 h-20 relative">
        {/* Main body */}
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-amber-800 to-amber-900 rounded-full shadow-lg border-2 border-amber-700">
          {/* Face */}
          <div className="absolute inset-2 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full">
            {/* Eyes */}
            <div className="absolute top-3 left-4 w-2.5 h-2.5 bg-black rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-3 right-4 w-2.5 h-2.5 bg-black rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full"></div>
            </div>
            
            {/* Nose */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-1.5 bg-pink-500 rounded-full"></div>
            
            {/* Mouth */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-700 rounded-full"></div>
            
            {/* Cheeks */}
            <div className="absolute top-5 left-2 w-2 h-2 bg-red-400 rounded-full opacity-50"></div>
            <div className="absolute top-5 right-2 w-2 h-2 bg-red-400 rounded-full opacity-50"></div>
          </div>
          
          {/* Ears */}
          <div className="absolute -top-2 left-3 w-4 h-4 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full border border-amber-600"></div>
          <div className="absolute -top-2 right-3 w-4 h-4 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full border border-amber-600"></div>
          
          {/* Inner ears */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-pink-400 rounded-full"></div>
          <div className="absolute -top-1 right-4 w-2 h-2 bg-pink-400 rounded-full"></div>
          
          {/* Whiskers */}
          <div className="absolute top-6 left-0 w-3 h-0.5 bg-gray-800 rounded"></div>
          <div className="absolute top-7 left-0 w-2.5 h-0.5 bg-gray-800 rounded"></div>
          <div className="absolute top-6 right-0 w-3 h-0.5 bg-gray-800 rounded"></div>
          <div className="absolute top-7 right-0 w-2.5 h-0.5 bg-gray-800 rounded"></div>
        </div>
        
        {/* Shadow under mole */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-black opacity-30 rounded-full blur-sm"></div>
      </div>
      
      {/* KHÔNG hiển thị đáp án trên chuột nữa - làm game khó hơn */}
    </div>
  );
};

export default MoleComponent;

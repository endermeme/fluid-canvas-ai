
import React from 'react';
import { Card } from '@/components/ui/card';
import MoleComponent from './MoleComponent';

interface Question {
  id: number;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
}

interface Mole {
  id: string;
  holeIndex: number;
  answer: string;
  isCorrect: boolean;
  showTime: number;
}

interface GameFieldProps {
  question: Question;
  activeMoles: Mole[];
  hitMoles: string[];
  holesCount: number;
  onMoleClick: (mole: Mole) => void;
  gameState: 'playing' | 'paused';
}

const GameField: React.FC<GameFieldProps> = ({
  question,
  activeMoles,
  hitMoles,
  holesCount,
  onMoleClick,
  gameState
}) => {
  return (
    <div className="p-6">
      {/* Question Card */}
      <Card className="p-6 mb-6 text-center bg-blue-50 border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-2">{question.question}</h3>
        <p className="text-sm text-blue-600">Đập chuột có đáp án đúng! 3 con chuột sẽ xuất hiện cùng lúc.</p>
      </Card>

      {/* Game Field */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: holesCount }, (_, index) => {
            const moleInHole = activeMoles.find(mole => mole.holeIndex === index);
            const isHit = moleInHole && hitMoles.includes(moleInHole.id);
            
            return (
              <div 
                key={index}
                className="relative w-32 h-32 mx-auto"
              >
                {/* Hole */}
                <div className="hole w-32 h-32 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full border-4 border-amber-800 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-3 bg-black rounded-full opacity-50"></div>
                  <div className="absolute inset-4 bg-gradient-to-b from-gray-800 to-black rounded-full"></div>
                </div>
                
                {/* Mole */}
                {moleInHole && gameState === 'playing' && (
                  <MoleComponent
                    mole={moleInHole}
                    isHit={isHit}
                    onClick={() => onMoleClick(moleInHole)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {gameState === 'paused' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Game đã tạm dừng</h3>
            <p className="text-muted-foreground">Nhấn nút Play để tiếp tục</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameField;

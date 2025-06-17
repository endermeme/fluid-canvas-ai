
import React from 'react';
import { Card } from '@/components/ui/card';

interface MatchingItem {
  id: number;
  text: string;
  matched: boolean;
}

interface MatchingGameAreaProps {
  leftItems: MatchingItem[];
  rightItems: MatchingItem[];
  selectedLeft: number | null;
  selectedRight: number | null;
  onLeftItemClick: (id: number) => void;
  onRightItemClick: (id: number) => void;
  difficulty: string;
  gameOver: boolean;
  gameWon: boolean;
}

const MatchingGameArea: React.FC<MatchingGameAreaProps> = ({
  leftItems,
  rightItems,
  selectedLeft,
  selectedRight,
  onLeftItemClick,
  onRightItemClick,
  difficulty,
  gameOver,
  gameWon
}) => {
  const getItemSize = (text: string) => {
    if (difficulty === "hard") return "min-h-8 sm:min-h-10 text-xs";
    if (difficulty === "easy") return "min-h-10 sm:min-h-12 text-sm";
    
    return text.length > 15 
      ? "min-h-8 sm:min-h-10 text-xs" 
      : text.length > 8 
        ? "min-h-9 sm:min-h-11 text-xs" 
        : "min-h-8 sm:min-h-10 text-sm";
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 min-h-0 overflow-hidden">
      <Card className="p-2 bg-background/50 border border-primary/10 overflow-hidden flex flex-col">
        <h3 className="text-sm font-medium mb-2 text-center bg-primary/10 py-1 px-2 rounded-md">Cột A</h3>
        <div className="space-y-1 overflow-auto flex-1">
          {leftItems.map((item) => (
            <button
              key={`left-${item.id}`}
              className={`w-full p-2 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center ${
                item.matched 
                  ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                  : selectedLeft === item.id
                    ? 'bg-primary/20 border-primary border'
                    : 'bg-secondary hover:bg-secondary/80 border-transparent border'
              }`}
              onClick={() => onLeftItemClick(item.id)}
              disabled={item.matched || gameOver || gameWon}
            >
              <span className="line-clamp-2 text-xs">{item.text}</span>
            </button>
          ))}
        </div>
      </Card>
      
      <Card className="p-2 bg-background/50 border border-primary/10 overflow-hidden flex flex-col">
        <h3 className="text-sm font-medium mb-2 text-center bg-primary/10 py-1 px-2 rounded-md">Cột B</h3>
        <div className="space-y-1 overflow-auto flex-1">
          {rightItems.map((item) => (
            <button
              key={`right-${item.id}`}
              className={`w-full p-2 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center ${
                item.matched 
                  ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                  : selectedRight === item.id
                    ? 'bg-primary/20 border-primary border'
                    : 'bg-secondary hover:bg-secondary/80 border-transparent border'
              }`}
              onClick={() => onRightItemClick(item.id)}
              disabled={item.matched || gameOver || gameWon}
            >
              <span className="line-clamp-2 text-xs">{item.text}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MatchingGameArea;


import React from 'react';

interface MemoryCard {
  id: number;
  content: string;
  matched: boolean;
  flipped: boolean;
}

interface MemoryGameAreaProps {
  cards: MemoryCard[];
  canFlip: boolean;
  onCardClick: (index: number) => void;
}

const MemoryGameArea: React.FC<MemoryGameAreaProps> = ({
  cards,
  canFlip,
  onCardClick
}) => {
  return (
    <div className="flex-1 p-2 min-h-0 overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-full overflow-auto">
        {cards.map((card, index) => (
          <div 
            key={index}
            className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${
              card.flipped || card.matched 
                ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 border-2 scale-105' 
                : 'bg-gradient-to-br from-secondary/80 to-secondary/20 border-transparent border-2 hover:scale-105'
            } ${!canFlip ? 'pointer-events-none' : ''}`}
            onClick={() => onCardClick(index)}
          >
            {(card.flipped || card.matched) ? (
              <div className="text-sm font-bold text-primary/90 text-center break-words overflow-hidden p-1">{card.content}</div>
            ) : (
              <div className="text-lg font-bold text-secondary/80">?</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGameArea;

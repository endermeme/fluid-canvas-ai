
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface FlashcardsHeaderProps {
  currentCard: number;
  totalCards: number;
  stats: {
    known: number;
    unknown: number;
    unreviewed: number;
  };
}

const FlashcardsHeader: React.FC<FlashcardsHeaderProps> = ({
  currentCard,
  totalCards,
  stats
}) => {
  const progress = (currentCard + 1) / totalCards * 100;

  return (
    <div className="flex-shrink-0 p-1 sm:p-2 pt-14 sm:pt-16 bg-background/95 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs font-medium px-2 py-1 bg-primary/10 rounded-full">
          {currentCard + 1}/{totalCards}
        </div>
        <div className="text-xs font-medium flex gap-1">
          <span className="px-1 sm:px-2 py-1 bg-green-100/30 text-green-600 rounded-full text-xs">
            <span className="hidden sm:inline">Thuộc: </span>{stats.known}
          </span>
          <span className="px-1 sm:px-2 py-1 bg-red-100/30 text-red-600 rounded-full text-xs">
            <span className="hidden sm:inline">Chưa: </span>{stats.unknown}
          </span>
        </div>
      </div>
      <Progress value={progress} className="h-1 sm:h-1.5" />
    </div>
  );
};

export default FlashcardsHeader;

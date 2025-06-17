
import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface FlashcardsCardProps {
  card: {
    front: string;
    back: string;
  };
  isFlipped: boolean;
  autoFlip: boolean;
  timeRemaining: number;
  onFlip: () => void;
}

const FlashcardsCard: React.FC<FlashcardsCardProps> = ({
  card,
  isFlipped,
  autoFlip,
  timeRemaining,
  onFlip
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
      <div 
        className="w-full max-w-4xl h-full max-h-[60vh] cursor-pointer relative group" 
        onClick={onFlip}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front card */}
        <Card 
          className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-background border-2 border-primary/20 overflow-auto"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center max-w-full h-full flex flex-col justify-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Nhấn để lật
              {autoFlip && !isFlipped && (
                <div className="mt-1 flex items-center justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Tự động lật sau {timeRemaining}s</span>
                </div>
              )}
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary/90 break-words overflow-auto">
              {card.front}
            </div>
          </div>
        </Card>
        
        {/* Back card */}
        <Card 
          className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 overflow-auto"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center max-w-full h-full flex flex-col justify-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mặt sau</div>
            <div className="text-base sm:text-lg text-primary/90 break-words overflow-auto">
              {card.back}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardsCard;

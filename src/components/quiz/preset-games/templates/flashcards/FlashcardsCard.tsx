
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
    <div className="h-full flex items-center justify-center p-4">
      <div 
        className="w-full max-w-4xl cursor-pointer relative group" 
        style={{ 
          height: 'min(60vh, 400px)',
          minHeight: '300px'
        }}
        onClick={onFlip}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            height: '100%'
          }}
        >
          {/* Front card */}
          <Card 
            className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-background border-2 border-primary/20"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center max-w-full h-full flex flex-col justify-center overflow-auto">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                Nhấn để lật
                {autoFlip && !isFlipped && (
                  <div className="mt-2 flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Tự động lật sau {timeRemaining}s</span>
                  </div>
                )}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary/90 break-words">
                {card.front}
              </div>
            </div>
          </Card>
          
          {/* Back card */}
          <Card 
            className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center max-w-full h-full flex flex-col justify-center overflow-auto">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Mặt sau</div>
              <div className="text-base sm:text-lg md:text-xl text-primary/90 break-words">
                {card.back}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsCard;


import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X, Clock, RotateCcw } from 'lucide-react';

interface FlashcardsFooterProps {
  currentCard: number;
  totalCards: number;
  isFlipped: boolean;
  autoFlip: boolean;
  onPrevCard: () => void;
  onNextCard: () => void;
  onFlip: () => void;
  onToggleAutoFlip: () => void;
  onRestart: () => void;
  onMarkCard: (status: 'known' | 'unknown') => void;
}

const FlashcardsFooter: React.FC<FlashcardsFooterProps> = ({
  currentCard,
  totalCards,
  isFlipped,
  autoFlip,
  onPrevCard,
  onNextCard,
  onFlip,
  onToggleAutoFlip,
  onRestart,
  onMarkCard
}) => {
  return (
    <div className="bg-background/95 backdrop-blur-sm border-t border-primary/10 p-2 sm:p-3">
      <div className="flex flex-col gap-2 max-w-4xl mx-auto">
        {/* Navigation and Flip - Row 1 */}
        <div className="grid grid-cols-5 gap-2">
          <Button 
            variant="outline" 
            onClick={onPrevCard} 
            disabled={currentCard === 0} 
            className="text-xs h-9 px-2" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Trước</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onFlip} 
            className="col-span-2 text-xs h-9 px-2" 
            size="sm"
          >
            <RotateCcw className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">{isFlipped ? "Mặt trước" : "Lật thẻ"}</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onNextCard} 
            disabled={currentCard === totalCards - 1} 
            className="text-xs h-9 px-2" 
            size="sm"
          >
            <span className="hidden sm:inline">Tiếp</span>
            <ArrowRight className="h-4 w-4 sm:ml-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRestart} 
            className="text-xs h-9 px-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Auto Flip and Mark buttons - Row 2 */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant={autoFlip ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-9 px-2" 
            onClick={onToggleAutoFlip}
          >
            <Clock className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">{autoFlip ? "Tắt" : "Auto"}</span>
          </Button>
          
          <Button
            onClick={() => onMarkCard('unknown')}
            variant="outline"
            className="border border-red-300 text-red-600 hover:bg-red-50 text-xs h-9 px-2"
            size="sm"
          >
            <X className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Chưa</span>
          </Button>
          
          <Button
            onClick={() => onMarkCard('known')}
            variant="outline"
            className="border border-green-300 text-green-600 hover:bg-green-50 text-xs h-9 px-2"
            size="sm"
          >
            <Check className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Thuộc</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsFooter;

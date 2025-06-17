
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X, Clock } from 'lucide-react';

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
    <div className="flex-shrink-0 p-2 border-t border-primary/10">
      <div className="flex flex-col gap-2">
        {/* Navigation */}
        <div className="grid grid-cols-4 gap-1">
          <Button variant="outline" onClick={onPrevCard} disabled={currentCard === 0} className="text-xs h-8" size="sm">
            <ArrowLeft className="h-3 w-3 mr-1" />
            Trước
          </Button>
          
          <Button variant="outline" onClick={onFlip} className="col-span-2 text-xs h-8" size="sm">
            {isFlipped ? "Xem mặt trước" : "Lật thẻ"}
          </Button>
          
          <Button variant="outline" onClick={onNextCard} disabled={currentCard === totalCards - 1} className="text-xs h-8" size="sm">
            Tiếp
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        
        {/* Controls */}
        <div className="flex gap-1">
          <Button variant={autoFlip ? "default" : "outline"} size="sm" className="flex-1 text-xs h-8" onClick={onToggleAutoFlip}>
            <Clock className="h-3 w-3 mr-1" />
            {autoFlip ? "Tắt tự động" : "Bật tự động"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={onRestart} className="flex-1 text-xs h-8">
            <RefreshCw className="h-3 w-3 mr-1" />
            Làm lại
          </Button>
        </div>
        
        {/* Mark buttons */}
        <ToggleGroup type="single" variant="outline" className="grid grid-cols-2 gap-1">
          <ToggleGroupItem 
            value="unknown" 
            onClick={() => onMarkCard('unknown')} 
            className="border border-red-300 text-red-600 data-[state=on]:bg-red-100 text-xs h-8"
          >
            <X className="mr-1 h-3 w-3" />
            Chưa thuộc
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="known" 
            onClick={() => onMarkCard('known')} 
            className="border border-green-300 text-green-600 data-[state=on]:bg-green-100 text-xs h-8"
          >
            <Check className="mr-1 h-3 w-3" />
            Đã thuộc
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default FlashcardsFooter;

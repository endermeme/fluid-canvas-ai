
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X } from 'lucide-react';

interface FlashcardsTemplateProps {
  content: any;
  topic: string;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ content, topic }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsState, setCardsState] = useState<Array<'unreviewed' | 'known' | 'unknown'>>([]);
  const [autoFlip, setAutoFlip] = useState(content?.settings?.autoFlip || false);
  const [flipTimer, setFlipTimer] = useState<NodeJS.Timeout | null>(null);

  const cards = content?.cards || [];
  const progress = ((currentCard + 1) / cards.length) * 100;

  // Initialize cards state
  useEffect(() => {
    if (cards.length > 0) {
      setCardsState(new Array(cards.length).fill('unreviewed'));
    }
  }, [cards.length]);

  // Handle auto flip timer
  useEffect(() => {
    if (autoFlip && !isFlipped) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, (content?.settings?.flipTime || 5) * 1000);
      setFlipTimer(timer);
    }

    return () => {
      if (flipTimer) clearTimeout(flipTimer);
    };
  }, [currentCard, isFlipped, autoFlip, content?.settings?.flipTime]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const handleNextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handleMarkCard = (status: 'known' | 'unknown') => {
    const newCardsState = [...cardsState];
    newCardsState[currentCard] = status;
    setCardsState(newCardsState);
    
    // Move to next card if not at the end
    if (currentCard < cards.length - 1) {
      handleNextCard();
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setCardsState(new Array(cards.length).fill('unreviewed'));
  };

  if (!content || !cards.length) {
    return <div className="p-4">Không có dữ liệu thẻ ghi nhớ</div>;
  }

  const stats = {
    known: cardsState.filter(state => state === 'known').length,
    unknown: cardsState.filter(state => state === 'unknown').length,
    unreviewed: cardsState.filter(state => state === 'unreviewed').length
  };

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Header with progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            Thẻ {currentCard + 1}/{cards.length}
          </div>
          <div className="text-sm font-medium flex space-x-3">
            <span className="text-green-600">Đã thuộc: {stats.known}</span>
            <span className="text-red-600">Chưa thuộc: {stats.unknown}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="flex-grow flex items-center justify-center mb-4">
        <div 
          className={`w-full max-w-md aspect-[3/2] cursor-pointer perspective-1000 transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotateY-180' : ''}`}
          onClick={handleFlip}
        >
          <Card className={`absolute inset-0 flex items-center justify-center p-6 backface-hidden ${isFlipped ? 'hidden' : ''} bg-background border-2 border-primary/30`}>
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Nhấn để lật thẻ</div>
              <div className="text-2xl font-bold">{cards[currentCard].front}</div>
            </div>
          </Card>
          
          <Card className={`absolute inset-0 flex items-center justify-center p-6 backface-hidden ${isFlipped ? '' : 'hidden'} bg-primary/10 border-2 border-primary/30`}>
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mặt sau</div>
              <div className="text-xl">{cards[currentCard].back}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          variant="outline"
          onClick={handlePrevCard}
          disabled={currentCard === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Thẻ trước
        </Button>
        <Button
          variant="outline"
          onClick={handleNextCard}
          disabled={currentCard === cards.length - 1}
        >
          Thẻ sau
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Memorization controls */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => handleMarkCard('unknown')}
        >
          <X className="mr-2 h-4 w-4" />
          Chưa thuộc
        </Button>
        <Button
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-50"
          onClick={() => handleMarkCard('known')}
        >
          <Check className="mr-2 h-4 w-4" />
          Đã thuộc
        </Button>
      </div>

      {/* Restart button */}
      <Button
        variant="ghost"
        className="mt-4"
        onClick={handleRestart}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Làm lại từ đầu
      </Button>
    </div>
  );
};

export default FlashcardsTemplate;

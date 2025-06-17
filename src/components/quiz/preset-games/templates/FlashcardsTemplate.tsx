import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X, Clock, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();

  const cards = content?.cards || [];
  const progress = ((currentCard + 1) / cards.length) * 100;
  const flipTime = content?.settings?.flipTime || 5;

  useEffect(() => {
    if (cards.length > 0) {
      setCardsState(new Array(cards.length).fill('unreviewed'));
    }
  }, [cards.length]);

  useEffect(() => {
    if (autoFlip && !isFlipped) {
      setTimeRemaining(flipTime);
      const countdownTimer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const timer = setTimeout(() => {
        setIsFlipped(true);
        clearInterval(countdownTimer);
      }, flipTime * 1000);
      
      setFlipTimer(timer);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }

    return () => {
      if (flipTimer) clearTimeout(flipTimer);
    };
  }, [currentCard, isFlipped, autoFlip, flipTime]);

  const handleFlip = () => {
    if (flipTimer) {
      clearTimeout(flipTimer);
    }
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
    
    if (status === 'known') {
      toast({
        title: "Đã thuộc!",
        description: "Đã đánh dấu thẻ này là đã thuộc.",
        variant: "default",
      });
    } else {
      toast({
        title: "Chưa thuộc!",
        description: "Đã đánh dấu thẻ này là chưa thuộc.",
        variant: "destructive",
      });
    }
    
    if (currentCard < cards.length - 1) {
      handleNextCard();
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setCardsState(new Array(cards.length).fill('unreviewed'));
    toast({
      title: "Làm lại từ đầu",
      description: "Đã đặt lại tất cả thẻ ghi nhớ.",
      variant: "default",
    });
  };

  const handleShuffle = () => {
    // Shuffle only the remaining cards
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    // Reset current card position
    setCurrentCard(0);
    setIsFlipped(false);
    
    toast({
      title: "Đã xáo trộn thẻ",
      description: "Thứ tự các thẻ đã được xáo trộn.",
      variant: "default",
    });
  };

  const toggleAutoFlip = () => {
    setAutoFlip(!autoFlip);
    toast({
      title: autoFlip ? "Đã tắt tự động lật" : "Đã bật tự động lật",
      description: autoFlip ? "Thẻ sẽ không tự động lật." : `Thẻ sẽ tự động lật sau ${flipTime} giây.`,
      variant: "default",
    });
  };

  if (!content || !cards.length) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">Không có dữ liệu thẻ ghi nhớ</p>
        </div>
      </div>
    );
  }

  const stats = {
    known: cardsState.filter(state => state === 'known').length,
    unknown: cardsState.filter(state => state === 'unknown').length,
    unreviewed: cardsState.filter(state => state === 'unreviewed').length
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-b border-border">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 py-1 bg-muted rounded-full">
            Thẻ {currentCard + 1}/{cards.length}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
            <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">
              Thuộc: {stats.known}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full">
              Chưa: {stats.unknown}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5 sm:h-2" />
      </div>

      {/* Card area - main content */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-2xl lg:max-w-3xl">
          <div 
            className="relative w-full aspect-[4/3] sm:aspect-[3/2] cursor-pointer group"
            onClick={handleFlip}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front of card */}
            <Card 
              className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-white border-2 border-border shadow-lg group-hover:shadow-xl transition-all duration-300"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center w-full">
                <div className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3">
                  Nhấn để lật thẻ
                  {autoFlip && !isFlipped && (
                    <div className="mt-1 flex items-center justify-center">
                      <Clock className="h-3 w-3 mr-1 text-foreground/60" />
                      <span>Tự động lật sau {timeRemaining}s</span>
                    </div>
                  )}
                </div>
                <ScrollArea className="max-h-40 sm:max-h-60 lg:max-h-80">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words whitespace-pre-wrap px-2">
                    {cards[currentCard].front}
                  </div>
                </ScrollArea>
              </div>
            </Card>
            
            {/* Back of card */}
            <Card 
              className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-muted border-2 border-border shadow-lg"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center w-full">
                <div className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3">
                  Mặt sau
                </div>
                <ScrollArea className="max-h-40 sm:max-h-60 lg:max-h-80">
                  <div className="text-base sm:text-lg lg:text-xl text-foreground break-words whitespace-pre-wrap px-2">
                    {cards[currentCard].back}
                  </div>
                </ScrollArea>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-border bg-white">
        <div className="max-w-2xl lg:max-w-3xl mx-auto space-y-2 sm:space-y-3">
          {/* Auto-flip toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Toggle
                pressed={autoFlip}
                onPressedChange={toggleAutoFlip}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Tự động lật
              </Toggle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffle}
                className="text-xs sm:text-sm"
              >
                <Shuffle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Xáo trộn
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestart}
              className="text-xs sm:text-sm"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Làm lại
            </Button>
          </div>

          {/* Mark card buttons (only when flipped) */}
          {isFlipped && (
            <div className="flex gap-2 sm:gap-3">
              <Button
                onClick={() => handleMarkCard('unknown')}
                variant="outline"
                className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 text-xs sm:text-sm"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Chưa thuộc
              </Button>
              <Button
                onClick={() => handleMarkCard('known')}
                variant="outline"
                className="flex-1 border-green-200 hover:bg-green-50 hover:border-green-300 text-green-600 text-xs sm:text-sm"
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Đã thuộc
              </Button>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={handlePrevCard}
              disabled={currentCard === 0}
              variant="outline"
              className="flex-1 text-xs sm:text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Trước
            </Button>
            <Button
              onClick={handleNextCard}
              disabled={currentCard === cards.length - 1}
              variant="outline"
              className="flex-1 text-xs sm:text-sm"
            >
              Sau
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsTemplate;

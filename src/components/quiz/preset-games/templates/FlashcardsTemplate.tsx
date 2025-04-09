
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  // Initialize cards state
  useEffect(() => {
    if (cards.length > 0) {
      setCardsState(new Array(cards.length).fill('unreviewed'));
    }
  }, [cards.length]);

  // Handle auto flip timer
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
    
    // Show toast notification
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
    
    // Move to next card if not at the end
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

  const toggleAutoFlip = () => {
    setAutoFlip(!autoFlip);
    toast({
      title: autoFlip ? "Đã tắt tự động lật" : "Đã bật tự động lật",
      description: autoFlip ? "Thẻ sẽ không tự động lật." : `Thẻ sẽ tự động lật sau ${flipTime} giây.`,
      variant: "default",
    });
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
      <div className="flex-grow flex items-center justify-center mb-4 perspective-1000">
        <div 
          className={`w-full max-w-md aspect-[3/2] cursor-pointer relative ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front of card */}
          <Card 
            className="absolute inset-0 flex items-center justify-center p-6 bg-background border-2 border-primary/30 backface-hidden"
            style={{
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Nhấn để lật thẻ
                {autoFlip && !isFlipped && (
                  <div className="mt-1 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Tự động lật sau {timeRemaining}s</span>
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold">{cards[currentCard].front}</div>
            </div>
          </Card>
          
          {/* Back of card */}
          <Card 
            className="absolute inset-0 flex items-center justify-center p-6 bg-primary/10 border-2 border-primary/30 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
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

      {/* Settings */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Button
          variant={autoFlip ? "default" : "outline"}
          className="flex-1"
          onClick={toggleAutoFlip}
        >
          <Clock className="mr-2 h-4 w-4" />
          {autoFlip ? "Tắt tự động lật" : "Bật tự động lật"}
        </Button>
        
        <Button
          variant="ghost"
          className="flex-1"
          onClick={handleRestart}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm lại từ đầu
        </Button>
      </div>
    </div>
  );
};

export default FlashcardsTemplate;

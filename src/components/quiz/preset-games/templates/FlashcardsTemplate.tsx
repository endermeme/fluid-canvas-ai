import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X, Clock, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
            Thẻ {currentCard + 1}/{cards.length}
          </div>
          <div className="text-sm font-medium flex space-x-3">
            <span className="px-3 py-1 bg-green-100/30 text-green-600 rounded-full">Đã thuộc: {stats.known}</span>
            <span className="px-3 py-1 bg-red-100/30 text-red-600 rounded-full">Chưa thuộc: {stats.unknown}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>

      <div className="flex-grow flex items-center justify-center mb-4 perspective-1000 overflow-hidden">
        <div 
          className="w-full max-w-4xl aspect-[3/2] cursor-pointer relative group px-4"
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <Card 
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-2 border-primary/20 shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-auto"
            style={{
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center max-w-full">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Nhấn để lật thẻ
                {autoFlip && !isFlipped && (
                  <div className="mt-1 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1 text-primary/60" />
                    <span>Tự động lật sau {timeRemaining}s</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-primary/90 break-words whitespace-pre-wrap">
                {cards[currentCard].front}
              </div>
            </div>
          </Card>
          
          <Card 
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/30 shadow-lg overflow-auto"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center max-w-full">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mặt sau</div>
              <div className="text-2xl text-primary/90 break-words whitespace-pre-wrap">
                {cards[currentCard].back}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-background/40 p-3 rounded-lg backdrop-blur-sm border border-primary/10 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={handlePrevCard}
            disabled={currentCard === 0}
            className="bg-background/70 border-primary/20"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Trước
          </Button>
          
          <Button
            variant="outline"
            onClick={handleFlip}
            className="col-span-2 bg-background/70 border-primary/20"
            size="sm"
          >
            {isFlipped ? "Xem mặt trước" : "Lật thẻ"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextCard}
            disabled={currentCard === cards.length - 1}
            className="bg-background/70 border-primary/20"
            size="sm"
          >
            Tiếp
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex gap-2 justify-between">
          <Button
            variant={autoFlip ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${autoFlip ? 'bg-primary/90' : 'bg-background/70 border-primary/20'}`}
            onClick={toggleAutoFlip}
          >
            <Clock className="h-4 w-4 mr-1" />
            {autoFlip ? "Tắt lật tự động" : "Bật lật tự động"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="bg-background/70 border-primary/20 flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Làm lại
          </Button>
        </div>
        
        <ToggleGroup type="single" variant="outline" className="grid grid-cols-2">
          <ToggleGroupItem
            value="unknown"
            onClick={() => handleMarkCard('unknown')}
            className="border border-red-300 text-red-600 data-[state=on]:bg-red-100 data-[state=on]:text-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            Chưa thuộc
          </ToggleGroupItem>
          
          <ToggleGroupItem
            value="known"
            onClick={() => handleMarkCard('known')}
            className="border border-green-300 text-green-600 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Đã thuộc
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default FlashcardsTemplate;

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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gradient-to-b from-background to-background/80">
      <div className="flex-shrink-0 p-3 sm:p-4 pt-16 sm:pt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
          <div className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
            Thẻ {currentCard + 1}/{cards.length}
          </div>
          <div className="text-xs sm:text-sm font-medium flex flex-wrap gap-2">
            <span className="px-2 sm:px-3 py-1 bg-green-100/30 text-green-600 rounded-full">Đã thuộc: {stats.known}</span>
            <span className="px-2 sm:px-3 py-1 bg-red-100/30 text-red-600 rounded-full">Chưa thuộc: {stats.unknown}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>

      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 min-h-0 overflow-hidden">
        <div 
          className="w-full max-w-5xl h-full max-h-[50vh] sm:max-h-[60vh] cursor-pointer relative group"
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <Card 
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-2 border-primary/20 shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-auto"
            style={{
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center max-w-full h-full flex flex-col justify-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Nhấn để lật thẻ
                {autoFlip && !isFlipped && (
                  <div className="mt-1 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1 text-primary/60" />
                    <span>Tự động lật sau {timeRemaining}s</span>
                  </div>
                )}
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-primary/90 break-words whitespace-pre-wrap overflow-auto">
                {cards[currentCard].front}
              </div>
            </div>
          </Card>
          
          <Card 
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/30 shadow-lg overflow-auto"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center max-w-full h-full flex flex-col justify-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mặt sau</div>
              <div className="text-base sm:text-xl md:text-2xl text-primary/90 break-words whitespace-pre-wrap overflow-auto">
                {cards[currentCard].back}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex-shrink-0 p-3 sm:p-4 bg-background/40 backdrop-blur-sm border-t border-primary/10">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="grid grid-cols-4 gap-1 sm:gap-2">
            <Button
              variant="outline"
              onClick={handlePrevCard}
              disabled={currentCard === 0}
              className="bg-background/70 border-primary/20 text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Trước</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFlip}
              className="col-span-2 bg-background/70 border-primary/20 text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              {isFlipped ? "Xem mặt trước" : "Lật thẻ"}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNextCard}
              disabled={currentCard === cards.length - 1}
              className="bg-background/70 border-primary/20 text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <span className="hidden sm:inline">Tiếp</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-1" />
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <Button
              variant={autoFlip ? "default" : "outline"}
              size="sm"
              className={`flex-1 text-xs sm:text-sm ${autoFlip ? 'bg-primary/90' : 'bg-background/70 border-primary/20'}`}
              onClick={toggleAutoFlip}
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">{autoFlip ? "Tắt lật tự động" : "Bật lật tự động"}</span>
              <span className="sm:hidden">{autoFlip ? "Tắt tự động" : "Bật tự động"}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestart}
              className="bg-background/70 border-primary/20 flex-1 text-xs sm:text-sm"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Làm lại</span>
              <span className="sm:hidden">Reset</span>
            </Button>
          </div>
          
          <ToggleGroup type="single" variant="outline" className="grid grid-cols-2 gap-1 sm:gap-2">
            <ToggleGroupItem
              value="unknown"
              onClick={() => handleMarkCard('unknown')}
              className="border border-red-300 text-red-600 data-[state=on]:bg-red-100 data-[state=on]:text-red-700 text-xs sm:text-sm p-2"
            >
              <X className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Chưa thuộc</span>
              <span className="sm:hidden">Chưa thuộc</span>
            </ToggleGroupItem>
            
            <ToggleGroupItem
              value="known"
              onClick={() => handleMarkCard('known')}
              className="border border-green-300 text-green-600 data-[state=on]:bg-green-100 data-[state=on]:text-green-700 text-xs sm:text-sm p-2"
            >
              <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Đã thuộc</span>
              <span className="sm:hidden">Đã thuộc</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsTemplate;

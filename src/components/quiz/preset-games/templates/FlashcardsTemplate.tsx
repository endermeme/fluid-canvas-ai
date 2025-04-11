
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
  onBack?: () => void;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ content, topic, onBack }) => {
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
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80 relative">
      {/* Back button */}
      {onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      )}

      {/* Header with progress */}
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

      {/* Flashcard */}
      <div className="flex-grow flex items-center justify-center mb-4 perspective-1000">
        <div 
          className="w-full max-w-md aspect-[3/2] cursor-pointer relative group"
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front of card */}
          <Card 
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-2 border-primary/20 shadow-lg group-hover:shadow-xl transition-all duration-300"
            style={{
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Nhấn để lật thẻ
                {autoFlip && !isFlipped && (
                  <div className="mt-1 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1 text-primary/60" />
                    <span>Tự động lật sau {timeRemaining}s</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-primary/90">{cards[currentCard].front}</div>
            </div>
          </Card>
          
          {/* Back of card */}
          <Card 
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/30 shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mặt sau</div>
              <div className="text-2xl text-primary/90">{cards[currentCard].back}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Simplified Controls */}
      <div className="flex flex-col gap-4">
        {/* Navigation control row */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrevCard}
            disabled={currentCard === 0}
            className="bg-background/70 border-primary/20"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant={autoFlip ? "default" : "outline"}
            size="sm"
            className={`${autoFlip ? 'bg-primary/90' : 'bg-background/70 border-primary/20'}`}
            onClick={toggleAutoFlip}
          >
            <Clock className="h-4 w-4 mr-1" />
            {autoFlip ? "Tắt lật tự động" : "Bật lật tự động"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="bg-background/70 border-primary/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextCard}
            disabled={currentCard === cards.length - 1}
            className="bg-background/70 border-primary/20"
            size="sm"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Knowledge status row */}
        <ToggleGroup type="single" className="justify-center">
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


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X, Clock, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FlashcardsTemplateProps {
  content: any;
  topic: string;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ content, topic }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsState, setCardsState] = useState<Array<'unreviewed' | 'known' | 'unknown'>>([]);
  const [autoFlip, setAutoFlip] = useState(false);
  const [flipTimer, setFlipTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const { toast } = useToast();

  const cards = content?.cards || [];
  const progress = cards.length > 0 ? ((currentCard + 1) / cards.length) * 100 : 0;
  const flipTime = content?.settings?.flipTime || 5;
  const useAutoFlip = content?.settings?.autoFlip || false;

  // Initialize cards state
  useEffect(() => {
    if (cards.length > 0) {
      setCardsState(new Array(cards.length).fill('unreviewed'));
      setAutoFlip(useAutoFlip);
    }
  }, [cards.length, useAutoFlip]);

  useEffect(() => {
    if (autoFlip && !isFlipped && cards.length > 0) {
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
        setTimeRemaining(0);
      }, flipTime * 1000);
      
      setFlipTimer(timer);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }

    return () => {
      if (flipTimer) {
        clearTimeout(flipTimer);
        setFlipTimer(null);
      }
    };
  }, [currentCard, isFlipped, autoFlip, flipTime]);

  const handleFlip = () => {
    if (flipTimer) {
      clearTimeout(flipTimer);
      setFlipTimer(null);
    }
    setTimeRemaining(0);
    setIsFlipped(!isFlipped);
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
      setIsAnswering(false);
      if (flipTimer) {
        clearTimeout(flipTimer);
        setFlipTimer(null);
      }
      setTimeRemaining(0);
    }
  };

  const handleNextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
      setIsAnswering(false);
      if (flipTimer) {
        clearTimeout(flipTimer);
        setFlipTimer(null);
      }
      setTimeRemaining(0);
    }
  };

  const handleMarkCard = (status: 'known' | 'unknown') => {
    if (currentCard >= cardsState.length) return;
    
    setIsAnswering(true);
    
    const newCardsState = [...cardsState];
    newCardsState[currentCard] = status;
    setCardsState(newCardsState);
    
    toast({
      title: status === 'known' ? "Tuyệt vời! 🎉" : "Tiếp tục luyện tập! 💪",
      description: status === 'known' 
        ? "Bạn đã nắm vững thẻ này rồi!" 
        : "Đừng lo, thực hành sẽ hoàn hảo!",
      variant: status === 'known' ? "default" : "destructive",
    });
    
    setTimeout(() => {
      setIsAnswering(false);
      if (currentCard < cards.length - 1) {
        handleNextCard();
      }
    }, 800);
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setIsAnswering(false);
    setCardsState(new Array(cards.length).fill('unreviewed'));
    if (flipTimer) {
      clearTimeout(flipTimer);
      setFlipTimer(null);
    }
    setTimeRemaining(0);
    
    toast({
      title: "Bắt đầu lại! ✨",
      description: "Đã đặt lại tất cả thẻ ghi nhớ.",
      variant: "default",
    });
  };

  const toggleAutoFlip = () => {
    const newAutoFlip = !autoFlip;
    setAutoFlip(newAutoFlip);
    
    if (!newAutoFlip && flipTimer) {
      clearTimeout(flipTimer);
      setFlipTimer(null);
      setTimeRemaining(0);
    }
    
    toast({
      title: newAutoFlip ? "Đã bật tự động lật ⏱️" : "Đã tắt tự động lật",
      description: newAutoFlip 
        ? `Thẻ sẽ tự động lật sau ${flipTime} giây.` 
        : "Thẻ sẽ không tự động lật.",
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
    <div className="flex flex-col p-4 h-full bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
            <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
            Thẻ {currentCard + 1}/{cards.length}
          </div>
          <div className="text-sm font-medium flex space-x-3">
            <span className="px-3 py-2 bg-gradient-to-r from-green-500/15 to-green-400/10 text-green-700 rounded-full border border-green-300/30 backdrop-blur-sm animate-pulse-soft">
              ✓ {stats.known}
            </span>
            <span className="px-3 py-2 bg-gradient-to-r from-red-500/15 to-red-400/10 text-red-700 rounded-full border border-red-300/30 backdrop-blur-sm">
              ✗ {stats.unknown}
            </span>
          </div>
        </div>
        <Progress 
          value={progress} 
          className="h-3 shadow-lg" 
          indicatorColor="bg-gradient-to-r from-primary via-primary/90 to-primary/80"
          showPercentage={false}
        />
      </div>

      <div className="flex-grow flex items-center justify-center mb-6 perspective-1000">
        <div 
          className="w-full max-w-4xl aspect-[3/2] cursor-pointer relative group px-4"
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front Card */}
          <Card 
            className={`absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-card via-card/95 to-primary/5 backdrop-blur-sm border-2 border-primary/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 overflow-auto ${
              isAnswering ? 'animate-pulse' : 'group-hover:scale-[1.02]'
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center max-w-full relative">
              {!isFlipped && (
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-subtle">
                  <div className="w-3 h-3 bg-primary/40 rounded-full"></div>
                </div>
              )}
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
                {!isFlipped ? "Nhấn để lật thẻ" : "Mặt trước"}
                {autoFlip && !isFlipped && timeRemaining > 0 && (
                  <div className="mt-2 flex items-center justify-center animate-pulse">
                    <Clock className="h-4 w-4 mr-2 text-primary/70 animate-spin" />
                    <span className="text-primary font-bold">Tự động lật sau {timeRemaining}s</span>
                  </div>
                )}
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-primary/90 break-words whitespace-pre-wrap leading-relaxed">
                {cards[currentCard]?.front || ''}
              </div>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-shimmer"></div>
          </Card>
          
          {/* Back Card */}
          <Card 
            className={`absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-primary/8 to-primary/5 backdrop-blur-sm border-2 border-primary/30 shadow-2xl overflow-auto ${
              isAnswering ? 'animate-glow' : ''
            }`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center max-w-full relative">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold flex items-center justify-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Đáp án
              </div>
              <div className="text-2xl lg:text-3xl text-primary/90 break-words whitespace-pre-wrap leading-relaxed font-semibold">
                {cards[currentCard]?.back || ''}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-card/40 p-4 rounded-xl backdrop-blur-md border border-primary/10 shadow-lg">
        <div className="grid grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={handlePrevCard}
            disabled={currentCard === 0}
            className="bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Trước
          </Button>
          
          <Button
            variant="outline"
            onClick={handleFlip}
            className="col-span-2 bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105"
            size="sm"
          >
            {isFlipped ? "⬅ Mặt trước" : "➡ Lật thẻ"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextCard}
            disabled={currentCard === cards.length - 1}
            className="bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105"
            size="sm"
          >
            Tiếp
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex gap-3 justify-between">
          <Button
            variant={autoFlip ? "default" : "outline"}
            size="sm"
            className={`flex-1 transition-all duration-300 hover:scale-105 ${
              autoFlip 
                ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg' 
                : 'bg-card/70 border-primary/20 hover:bg-primary/10'
            }`}
            onClick={toggleAutoFlip}
          >
            <Clock className="h-4 w-4 mr-2" />
            {autoFlip ? "Tắt tự động" : "Bật tự động"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40 flex-1 transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Làm lại
          </Button>
        </div>
        
        <ToggleGroup type="single" variant="outline" className="grid grid-cols-2 gap-3">
          <ToggleGroupItem
            value="unknown"
            onClick={() => handleMarkCard('unknown')}
            className={`border-2 transition-all duration-300 hover:scale-105 ${
              isAnswering 
                ? 'animate-pulse' 
                : 'border-red-300/50 text-red-600 hover:bg-red-50 hover:border-red-400 data-[state=on]:bg-red-100 data-[state=on]:text-red-700 data-[state=on]:border-red-500'
            }`}
            disabled={isAnswering}
          >
            <X className="mr-2 h-4 w-4" />
            Chưa thuộc
          </ToggleGroupItem>
          
          <ToggleGroupItem
            value="known"
            onClick={() => handleMarkCard('known')}
            className={`border-2 transition-all duration-300 hover:scale-105 ${
              isAnswering 
                ? 'animate-pulse' 
                : 'border-green-300/50 text-green-600 hover:bg-green-50 hover:border-green-400 data-[state=on]:bg-green-100 data-[state=on]:text-green-700 data-[state=on]:border-green-500'
            }`}
            disabled={isAnswering}
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

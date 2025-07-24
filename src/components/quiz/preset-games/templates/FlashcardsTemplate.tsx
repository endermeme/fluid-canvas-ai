import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X, Clock, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FlashcardsTemplateProps {
  data?: any;
  content: any;
  topic: string;
  settings?: any;
  onGameComplete?: (result: any) => Promise<void>;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ data, content, topic, settings, onGameComplete }) => {
  const gameContent = content || data;
  // Use settings from props with proper defaults
  const gameSettings = {
    cardCount: settings?.cardCount || 10,
    autoFlip: settings?.autoFlip || false,
    showHints: settings?.showHints || true,
    allowSkip: settings?.allowSkip || true,
    debugMode: settings?.debugMode || false
  };
  
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsState, setCardsState] = useState<Array<'unreviewed' | 'known' | 'unknown'>>([]);
  const [autoFlip, setAutoFlip] = useState(gameSettings.autoFlip);
  const [showHints, setShowHints] = useState(gameSettings.showHints);
  const [allowSkip, setAllowSkip] = useState(gameSettings.allowSkip);
  const [flipTimer, setFlipTimer] = useState<NodeJS.Timeout | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { toast } = useToast();

  // Filter cards based on cardCount setting
  const allCards = gameContent?.cards || [];
  const cards = allCards.slice(0, gameSettings.cardCount);
  const progress = ((currentCard + 1) / cards.length) * 100;

  useEffect(() => {
    if (cards.length > 0) {
      setCardsState(new Array(cards.length).fill('unreviewed'));
    }
  }, [cards.length]);

  useEffect(() => {
    if (autoFlip && !isFlipped) {
      // Auto flip after 3 seconds when enabled
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 3000);
      
      setFlipTimer(timer);
      
      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      if (flipTimer) clearTimeout(flipTimer);
    };
  }, [currentCard, isFlipped, autoFlip]);

  const checkGameCompletion = async (cardsState: Array<'unreviewed' | 'known' | 'unknown'>) => {
    if (!gameCompleted && cardsState.every(state => state !== 'unreviewed')) {
      setGameCompleted(true);
      const knownCards = cardsState.filter(state => state === 'known').length;
      const totalCards = cardsState.length;
      
      if (onGameComplete) {
        await onGameComplete({
          score: knownCards,
          totalQuestions: totalCards,
          gameType: 'flashcards'
        });
      }
      
      toast({
        title: "Hoàn thành! 🎉",
        description: `Bạn đã thuộc ${knownCards}/${totalCards} thẻ.`,
        variant: "default",
      });
    }
  };

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
    
    // Auto advance to next card if enabled
    if (currentCard < cards.length - 1) {
      handleNextCard();
    } else {
      // Check if all cards have been reviewed
      const newCardsState = [...cardsState];
      newCardsState[currentCard] = status;
      checkGameCompletion(newCardsState);
    }
  };

  const handleSkipCard = () => {
    if (!allowSkip) {
      toast({
        title: "Không thể bỏ qua",
        description: "Tính năng bỏ qua đã bị tắt.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentCard < cards.length - 1) {
      handleNextCard();
      toast({
        title: "Đã bỏ qua thẻ",
        description: "Chuyển sang thẻ tiếp theo.",
        variant: "default",
      });
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setCardsState(new Array(cards.length).fill('unreviewed'));
    setGameCompleted(false);
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
      description: autoFlip ? "Thẻ sẽ không tự động lật." : "Thẻ sẽ tự động lật sau 3 giây.",
      variant: "default",
    });
  };

  const toggleShowHints = () => {
    setShowHints(!showHints);
    toast({
      title: showHints ? "Đã ẩn gợi ý" : "Đã hiển thị gợi ý",
      description: showHints ? "Gợi ý sẽ được ẩn." : "Gợi ý sẽ được hiển thị.",
      variant: "default",
    });
  };

  if (!gameContent || !cards.length) {
    return (
      <div className="game-container">
        <div className="game-content flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-primary">Không có dữ liệu thẻ ghi nhớ</p>
          </div>
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
    <div className="unified-game-container">
      {/* Header */}
      <div className="game-header">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 py-1 bg-muted rounded-full text-primary">
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
      <div className="game-content flex items-center justify-center">
        <div className="responsive-card max-w-2xl mx-auto">
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
              className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-card border-2 border-border shadow-lg group-hover:shadow-xl transition-all duration-300"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center w-full">
                <div className="text-xs sm:text-sm uppercase tracking-wider text-primary/70 mb-2 sm:mb-3">
                  Nhấn để lật thẻ
                </div>
                <ScrollArea className="max-h-32 sm:max-h-48">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-primary break-words whitespace-pre-wrap px-2">
                    {cards[currentCard].front}
                  </div>
                </ScrollArea>
                {showHints && cards[currentCard].hint && (
                  <div className="mt-2 sm:mt-3 p-2 bg-blue-50 rounded text-xs sm:text-sm text-blue-600">
                    💡 {cards[currentCard].hint}
                  </div>
                )}
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
                <div className="text-xs sm:text-sm uppercase tracking-wider text-primary/70 mb-2 sm:mb-3">
                  Mặt sau
                </div>
                <ScrollArea className="max-h-32 sm:max-h-48">
                  <div className="text-sm sm:text-base lg:text-lg text-primary break-words whitespace-pre-wrap px-2">
                    {cards[currentCard].back}
                  </div>
                </ScrollArea>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="game-controls">
        <div className="responsive-card mx-auto space-y-2 sm:space-y-3">
          {/* Settings toggles */}
          <div className="flex items-center justify-between gap-2">
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
              <Toggle
                pressed={showHints}
                onPressedChange={toggleShowHints}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                💡 Gợi ý
              </Toggle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffle}
                className="text-xs sm:text-sm"
              >
                <Shuffle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Xáo trộn
              </Button>
              {allowSkip && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkipCard}
                  disabled={currentCard === cards.length - 1}
                  className="text-xs sm:text-sm text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  Bỏ qua
                </Button>
              )}
            </div>
          </div>
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
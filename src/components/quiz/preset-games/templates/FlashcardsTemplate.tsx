import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GameHeader from '../../components/GameHeader';
import GameControls from '../../components/GameControls';

interface FlashcardsTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsContent {
  cards: Flashcard[];
  settings: {
    autoFlip: boolean;
    flipTime: number;
  };
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
  const flipTime = content?.settings?.flipTime || 5;

  const progress = ((currentCard + 1) / cards.length) * 100;

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

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      <GameHeader 
        onBack={onBack}
        progress={progress}
        timeLeft={timeRemaining}
        currentItem={currentCard}
        totalItems={cards.length}
        title={`Thẻ ${currentCard + 1}/${cards.length}`}
      />

      <div className="flex-grow flex items-center justify-center mb-4 perspective-1000">
        <div 
          className="w-full max-w-4xl aspect-[3/2] cursor-pointer relative group"
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <Card 
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-2 border-primary/20 shadow-lg group-hover:shadow-xl transition-all duration-300"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center max-w-full">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Nhấn để lật thẻ
                {autoFlip && !isFlipped && (
                  <div className="mt-1 flex items-center justify-center gap-1">
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
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/30 shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center max-w-full">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Mặt sau
              </div>
              <div className="text-2xl text-primary/90 break-words whitespace-pre-wrap">
                {cards[currentCard].back}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={handlePrevCard}
            disabled={currentCard === 0}
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-background/70 border border-primary/20 hover:bg-background/90 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Trước
          </button>
          
          <button
            onClick={handleFlip}
            className="col-span-2 px-4 py-2 rounded-lg bg-background/70 border border-primary/20 hover:bg-background/90 transition-colors"
          >
            {isFlipped ? "Xem mặt trước" : "Lật thẻ"}
          </button>
          
          <button
            onClick={handleNextCard}
            disabled={currentCard === cards.length - 1}
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-background/70 border border-primary/20 hover:bg-background/90 transition-colors disabled:opacity-50"
          >
            Tiếp
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <GameControls 
          onRestart={handleRestart}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default FlashcardsTemplate;

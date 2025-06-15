import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, ArrowRight, ArrowLeft, RefreshCw, BookOpen, CheckCircle, XCircle } from 'lucide-react';

interface FlashcardsTemplateProps {
  data?: any;
  content?: any;
  topic: string;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ data, content, topic }) => {
  const gameContent = content || data;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [autoFlipTimer, setAutoFlipTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const cards = gameContent?.cards || [];
  const autoFlip = gameContent?.settings?.autoFlip;
  const flipTime = gameContent?.settings?.flipTime || 3;

  useEffect(() => {
    if (autoFlip && !autoFlipTimer && !showResult) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
        setAutoFlipTimer(null);
      }, flipTime * 1000);

      setAutoFlipTimer(timer);

      return () => clearTimeout(timer);
    }
  }, [autoFlip, flipTime, isFlipped, autoFlipTimer, showResult]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      clearAutoFlipTimer();
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      clearAutoFlipTimer();
    }
  };

  const handleMarkKnown = () => {
    const newKnownCards = new Set(knownCards);
    newKnownCards.add(currentCardIndex);
    setKnownCards(newKnownCards);
    
    const newUnknownCards = new Set(unknownCards);
    newUnknownCards.delete(currentCardIndex);
    setUnknownCards(newUnknownCards);
    
    toast({
      title: "Đã đánh dấu biết! ✅",
      description: "Thẻ này đã được đánh dấu là đã biết.",
    });
    
    handleNext();
  };

  const handleMarkUnknown = () => {
    const newUnknownCards = new Set(unknownCards);
    newUnknownCards.add(currentCardIndex);
    setUnknownCards(newUnknownCards);
    
    const newKnownCards = new Set(knownCards);
    newKnownCards.delete(currentCardIndex);
    setKnownCards(newKnownCards);
    
    toast({
      title: "Cần ôn lại! 📚",
      description: "Thẻ này đã được đánh dấu cần ôn lại.",
      variant: "destructive",
    });
    
    handleNext();
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setShowResult(false);
    clearAutoFlipTimer();
  };

  const clearAutoFlipTimer = () => {
    if (autoFlipTimer) {
      clearTimeout(autoFlipTimer);
      setAutoFlipTimer(null);
    }
  };

  if (!gameContent || !cards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Không có dữ liệu thẻ ghi nhớ</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const knownCount = knownCards.size;
    const unknownCount = unknownCards.size;
    const percentage = Math.round((knownCount / cards.length) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-2xl">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả Ôn Tập</h2>
          <p className="text-lg mb-4 text-muted-foreground">
            Chủ đề: <span className="font-semibold text-primary">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-muted-foreground">Đã biết</span>
              <span className="font-bold text-primary text-lg">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-4 shadow-lg" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{knownCount}</div>
              <div className="text-sm text-green-600">Đã biết</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">{unknownCount}</div>
              <div className="text-sm text-red-600">Cần ôn</div>
            </div>
          </div>
          
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Ôn Lại
          </Button>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20">
              Thẻ {currentCardIndex + 1}/{cards.length}
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-gradient-to-r from-green-500/15 to-green-400/10 text-green-700 rounded-full border border-green-300/30">
                Biết: <span className="font-bold">{knownCards.size}</span>
              </div>
              <div className="px-3 py-2 bg-gradient-to-r from-red-500/15 to-red-400/10 text-red-700 rounded-full border border-red-300/30">
                Cần ôn: <span className="font-bold">{unknownCards.size}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-3 shadow-lg" />
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <Card 
            className={`relative h-80 cursor-pointer bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-xl transition-all duration-500 hover:shadow-2xl ${
              isFlipped ? 'transform rotateY-180' : ''
            }`}
            onClick={handleFlip}
          >
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">
                  {isFlipped ? 'Mặt sau' : 'Mặt trước'}
                </div>
                <RotateCcw className="h-6 w-6 text-primary mx-auto animate-spin-slow" />
              </div>
              <div className="text-xl font-semibold text-primary">
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              variant="outline"
              className="bg-card/70 border-primary/20 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Trước
            </Button>
            
            <Button
              onClick={handleFlip}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Lật thẻ
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentCardIndex === cards.length - 1}
              variant="outline"
              className="bg-card/70 border-primary/20 hover:bg-primary/10"
            >
              Sau
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {isFlipped && (
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleMarkUnknown}
                variant="destructive"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cần ôn lại
              </Button>
              
              <Button
                onClick={handleMarkKnown}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Đã biết
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsTemplate;

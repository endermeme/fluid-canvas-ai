
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, ArrowRight, ArrowLeft, RefreshCw, BookOpen, CheckCircle, XCircle, Sparkles } from 'lucide-react';

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
      title: "Tuyệt vời! ✅",
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
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-foreground">Không có dữ liệu thẻ ghi nhớ</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const knownCount = knownCards.size;
    const unknownCount = unknownCards.size;
    const percentage = Math.round((knownCount / cards.length) * 100);
    
    return (
      <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-violet-950/30 dark:via-blue-950/30 dark:to-cyan-950/30 overflow-hidden">
        <Card className="max-w-md w-full p-8 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-2xl border border-white/50 dark:border-gray-700/50">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-blue-500/20">
            <BookOpen className="h-10 w-10 text-violet-600 dark:text-violet-400" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Kết Quả Ôn Tập</h2>
          <p className="text-lg mb-4 text-gray-600 dark:text-gray-400">
            Chủ đề: <span className="font-semibold text-foreground">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600 dark:text-gray-400">Đã biết</span>
              <span className="font-bold text-foreground text-lg">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-4" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{knownCount}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Đã biết</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg p-4">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">{unknownCount}</div>
              <div className="text-sm text-red-600 dark:text-red-400">Cần ôn</div>
            </div>
          </div>
          
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
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
    <div className="h-full flex flex-col bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-violet-950/30 dark:via-blue-950/30 dark:to-cyan-950/30 overflow-hidden">
      {/* Fixed Header với điểm số */}
      <div className="flex-shrink-0 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-white/50 dark:border-gray-700/50">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-full border border-violet-300/50 dark:border-violet-700/50">
            <Sparkles className="inline h-4 w-4 mr-1 text-violet-600 dark:text-violet-400" />
            Thẻ {currentCardIndex + 1}/{cards.length}
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full border border-green-300/50 dark:border-green-700/50">
              Biết: <span className="font-bold">{knownCards.size}</span>
            </div>
            <div className="px-3 py-2 bg-red-500/20 text-red-700 dark:text-red-400 rounded-full border border-red-300/50 dark:border-red-700/50">
              Cần ôn: <span className="font-bold">{unknownCards.size}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Main Game Area - Scaled up */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Flashcard - 3D Flip Animation */}
          <div className="mb-8 perspective-1000">
            <div 
              className={`relative w-full h-80 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={handleFlip}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side */}
              <Card 
                className={`absolute inset-0 backface-hidden bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-950/90 
                  shadow-2xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm
                  hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                  <div className="mb-6">
                    <div className="text-sm text-violet-600 dark:text-violet-400 mb-3 font-medium">
                      Mặt trước
                    </div>
                    <RotateCcw className="h-8 w-8 text-violet-500 mx-auto animate-spin-slow" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
                    {currentCard.front}
                  </div>
                  <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Nhấp để lật thẻ
                  </div>
                </div>
              </Card>

              {/* Back Side */}
              <Card 
                className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-cyan-50/90 to-blue-100/90 dark:from-cyan-950/90 dark:to-blue-900/90 
                  shadow-2xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm
                  hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                  <div className="mb-6">
                    <div className="text-sm text-cyan-600 dark:text-cyan-400 mb-3 font-medium">
                      Mặt sau
                    </div>
                    <CheckCircle className="h-8 w-8 text-cyan-500 mx-auto" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
                    {currentCard.back}
                  </div>
                  <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Bạn đã biết chưa?
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Controls */}
      <div className="flex-shrink-0 p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-white/50 dark:border-gray-700/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            {/* Navigation Controls */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handlePrevious}
                disabled={currentCardIndex === 0}
                variant="outline"
                size="lg"
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Trước
              </Button>
              
              <Button
                onClick={handleFlip}
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Lật thẻ
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={currentCardIndex === cards.length - 1}
                variant="outline"
                size="lg"
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90"
              >
                Sau
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Knowledge Assessment Controls */}
            {isFlipped && (
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleMarkUnknown}
                  variant="destructive"
                  size="lg"
                  className="shadow-lg"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cần ôn lại
                </Button>
                
                <Button
                  onClick={handleMarkKnown}
                  className="bg-green-600 hover:bg-green-700 shadow-lg"
                  size="lg"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Đã biết
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsTemplate;

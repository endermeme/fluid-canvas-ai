import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, RotateCw, Repeat } from 'lucide-react';
import GameWrapper from './GameWrapper';

interface FlashcardsTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  gameId?: string;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ data, content, topic, onBack, gameId }) => {
  const gameContent = content || data;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timeLimit || 300);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const rawCards = gameContent?.cards || gameContent?.flashcards || [];
  const [processedCards, setProcessedCards] = useState<any[]>([]);
  const totalCards = processedCards.length;

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (gameContent) {
      try {
        let formatted = [];
        
        if (rawCards?.length === 0) {
          setError("Không có dữ liệu thẻ học.");
          setProcessedCards([]);
        } else if (rawCards[0].front !== undefined && rawCards[0].back !== undefined) {
          formatted = rawCards;
        } else if (rawCards[0].term !== undefined && rawCards[0].definition !== undefined) {
          formatted = rawCards.map((card: any) => ({
            front: card.term,
            back: card.definition,
            hint: card.hint
          }));
        } else if (Array.isArray(rawCards) && typeof rawCards[0] === 'object') {
          formatted = rawCards.map((card: any) => {
            const keys = Object.keys(card);
            const frontField = keys.find(k => ['front', 'question', 'term', 'title', 'header'].includes(k.toLowerCase())) || keys[0];
            const backField = keys.find(k => ['back', 'answer', 'definition', 'content', 'description'].includes(k.toLowerCase())) || keys[1];
            return {
              front: card[frontField],
              back: card[backField],
              hint: card.hint || card.clue || null
            };
          });
        } else {
          formatted = rawCards.map((card: any, index: number) => {
            if (typeof card === 'string') {
              return { front: `Thẻ ${index+1}`, back: card };
            }
            return {
              front: JSON.stringify(card).substring(0, 50),
              back: JSON.stringify(card)
            };
          });
        }
        setProcessedCards(formatted);
        setError(null);
      } catch (err) {
        setError("Lỗi xử lý dữ liệu thẻ học.");
      }
    } else {
      setError("Không có dữ liệu thẻ học.");
    }
    setLoading(false);
  }, [gameContent, rawCards]);

  useEffect(() => {
    if (!gameStarted && processedCards.length > 0) {
      setGameStarted(true);
      setTimeLeft(gameContent?.settings?.timeLimit || 300);
    }
  }, [gameContent, processedCards, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
      
      toast({
        title: "Thời gian đã hết",
        description: "Hãy xem kết quả học tập của bạn.",
        variant: "default",
      });
    }
  }, [timeLeft, gameStarted, showResult, toast]);

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    
    if (!isFlipped && !reviewedCards.includes(currentCardIndex)) {
      setReviewedCards([...reviewedCards, currentCardIndex]);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < processedCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setShowResult(true);
      
      toast({
        title: "Hoàn thành",
        description: "Bạn đã xem qua tất cả các thẻ.",
        variant: "default",
      });
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setReviewedCards([]);
    setTimeLeft(gameContent?.settings?.timeLimit || 300);
    setShowResult(false);
    setGameStarted(true);
  };

  if (loading) {
    return (
      <GameWrapper
        gameId={gameId}
        onBack={onBack}
        title={gameContent?.title || "Flashcards"}
      >
        <div className="text-center py-8 text-lg text-gray-500">Đang tải thẻ học...</div>
      </GameWrapper>
    );
  }

  if (error || !processedCards.length) {
    return (
      <GameWrapper
        gameId={gameId}
        onBack={onBack}
        title={gameContent?.title || "Flashcards"}
      >
        <div className="text-center py-8 text-red-500">
          {error || "Không có dữ liệu thẻ học."}
          <div className="text-sm text-gray-400 mt-1">Vui lòng chọn topic hoặc thử lại sau.</div>
        </div>
      </GameWrapper>
    );
  }

  if (showResult) {
    const percentage = Math.round((reviewedCards.length / totalCards) * 100);
    
    return (
      <GameWrapper
        onBack={onBack}
        progress={100}
        timeLeft={timeLeft}
        score={reviewedCards.length}
        currentItem={totalCards}
        totalItems={totalCards}
        title="Kết quả"
        gameId={gameId}
      >
        <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
            <p className="text-lg mb-4">
              Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
            </p>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Thẻ đã học</span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            
            <div className="text-4xl font-bold mb-6 text-primary">
              {reviewedCards.length} / {totalCards}
            </div>
            
            <div className="space-x-4">
              <Button onClick={handleRestart} className="mt-4">
                <Repeat className="mr-2 h-4 w-4" />
                Học lại
              </Button>
              <Button variant="outline" onClick={onBack} className="mt-4">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
            </div>
          </div>
        </Card>
      </GameWrapper>
    );
  }

  const card = processedCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / totalCards) * 100;

  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={reviewedCards.length}
      currentItem={currentCardIndex + 1}
      totalItems={totalCards}
      title={gameContent.title || "Flashcards"}
      gameId={gameId}
    >
      <div className="flex flex-col h-full justify-between">
        <Card 
          className="flex-grow flex items-center justify-center p-8 cursor-pointer bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20 select-none"
          onClick={handleFlipCard}
        >
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            {!isFlipped ? (
              <>
                <div className="text-xs mb-2 text-gray-500">Nhấp để xem mặt sau</div>
                <div className="text-2xl font-bold mb-4">{card.front}</div>
                {card.image && (
                  <div className="mt-4 max-w-xs mx-auto">
                    <img 
                      src={card.image} 
                      alt={card.front} 
                      className="rounded-md max-h-40 object-contain"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-xs mb-2 text-gray-500">Nhấp để xem mặt trước</div>
                <div className="text-xl">{card.back}</div>
              </>
            )}
          </div>
        </Card>
        
        <div className="flex justify-between items-center mt-4 px-2">
          <Button 
            onClick={handlePrevCard} 
            disabled={currentCardIndex === 0}
            variant="outline"
            size="sm"
            className="px-3"
          >
            <ChevronLeft className="h-5 w-5" />
            Trước
          </Button>
          
          <div className="text-sm text-gray-500">
            {currentCardIndex + 1} / {totalCards}
          </div>
          
          <Button 
            onClick={handleNextCard}
            variant="outline"
            size="sm"
            className="px-3"
          >
            Tiếp
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleFlipCard} 
            className="mx-2"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Lật thẻ
          </Button>
        </div>
      </div>
    </GameWrapper>
  );
};

export default FlashcardsTemplate;

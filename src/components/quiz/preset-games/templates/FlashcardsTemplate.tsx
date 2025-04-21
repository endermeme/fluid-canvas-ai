
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
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timeLimit || 300);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  // Xử lý khác biệt cấu trúc dữ liệu
  const rawCards = gameContent?.cards || gameContent?.flashcards || [];
  const [processedCards, setProcessedCards] = useState<any[]>([]);
  const totalCards = processedCards.length;

  // Xử lý dữ liệu thẻ
  useEffect(() => {
    if (gameContent) {
      console.log("Flashcards game content:", gameContent);
      processCardData();
    }
  }, [gameContent]);

  const processCardData = () => {
    if (!rawCards || rawCards.length === 0) {
      console.error("No card data available", gameContent);
      return;
    }

    let formatted = [];
    
    // Kiểm tra cấu trúc dữ liệu và định dạng phù hợp
    if (rawCards[0].front !== undefined && rawCards[0].back !== undefined) {
      // Format 1: { front: "...", back: "..." }
      formatted = rawCards;
    } else if (rawCards[0].term !== undefined && rawCards[0].definition !== undefined) {
      // Format 2: { term: "...", definition: "..." }
      formatted = rawCards.map((card: any) => ({
        front: card.term,
        back: card.definition,
        hint: card.hint
      }));
    } else if (Array.isArray(rawCards) && typeof rawCards[0] === 'object') {
      // Format 3: Các định dạng khác, thử đoán các trường
      formatted = rawCards.map((card: any) => {
        const keys = Object.keys(card);
        
        // Thử đoán các trường
        const frontField = keys.find(k => 
          ['front', 'question', 'term', 'title', 'header'].includes(k.toLowerCase())
        ) || keys[0];
        
        const backField = keys.find(k => 
          ['back', 'answer', 'definition', 'content', 'description'].includes(k.toLowerCase())
        ) || keys[1];
        
        return {
          front: card[frontField],
          back: card[backField],
          hint: card.hint || card.clue || null
        };
      });
    } else {
      // Format 4: Mảng đơn giản
      formatted = rawCards.map((card: any, index: number) => {
        if (typeof card === 'string') {
          // Nếu là string, tạo thẻ đơn giản
          return {
            front: `Thẻ ${index + 1}`,
            back: card
          };
        } else {
          // Giả sử đây là một đối tượng không có cấu trúc rõ ràng
          return {
            front: JSON.stringify(card).substring(0, 50),
            back: JSON.stringify(card)
          };
        }
      });
    }
    
    setProcessedCards(formatted);
    console.log("Processed cards:", formatted);
  };

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
    
    // Thêm thẻ vào danh sách đã xem qua khi lật sang mặt sau
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

  if (!gameContent) {
    console.error("No game content provided");
    return <div className="p-4">Không có dữ liệu thẻ học</div>;
  }

  if (!processedCards || processedCards.length === 0) {
    console.error("No processed cards available", gameContent);
    return <div className="p-4">Đang tải dữ liệu thẻ học...</div>;
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

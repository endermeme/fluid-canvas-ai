
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy, Lightbulb } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MemoryTemplateProps {
  content: any;
  topic: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ content, topic }) => {
  const [cards, setCards] = useState<Array<{id: number, content: string, matched: boolean, flipped: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(content?.settings?.timeLimit || 120);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [canFlip, setCanFlip] = useState<boolean>(true);
  const { toast } = useToast();

  const memoryCards = content?.cards || [];
  const totalPairs = memoryCards.length / 2;

  useEffect(() => {
    if (memoryCards.length > 0) {
      const shuffledCards = [...memoryCards].sort(() => Math.random() - 0.5).map(card => ({
        ...card,
        flipped: false
      }));
      
      setCards(shuffledCards);
      setTimeLeft(content?.settings?.timeLimit || 120);
      setMoves(0);
      setMatchedPairs(0);
      setFlippedCards([]);
      setGameOver(false);
      setGameWon(false);
    }
  }, [memoryCards, content?.settings?.timeLimit]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !gameWon) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver && !gameWon) {
      setGameOver(true);
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã hết thời gian chơi.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameOver, gameWon, toast]);

  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setGameWon(true);
      toast({
        title: "Chúc mừng!",
        description: "Bạn đã hoàn thành trò chơi.",
        variant: "default",
      });
    }
  }, [matchedPairs, totalPairs, toast]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      
      const [firstIndex, secondIndex] = flippedCards;
      
      if (cards[firstIndex].content === cards[secondIndex].content) {
        setCards(cards.map((card, idx) => 
          idx === firstIndex || idx === secondIndex 
            ? {...card, matched: true} 
            : card
        ));
        setMatchedPairs(matchedPairs + 1);
        setFlippedCards([]);
        setCanFlip(true);
        
        toast({
          title: "Tuyệt vời!",
          description: "Bạn đã tìm thấy một cặp khớp.",
          variant: "default",
        });
      } else {
        setTimeout(() => {
          setCards(cards.map((card, idx) => 
            idx === firstIndex || idx === secondIndex 
              ? {...card, flipped: false} 
              : card
          ));
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
      
      setMoves(moves + 1);
    }
  }, [flippedCards, cards, matchedPairs, moves, toast]);

  const handleCardClick = (index: number) => {
    if (gameOver || gameWon || !canFlip || flippedCards.length >= 2 || cards[index].flipped || cards[index].matched) {
      return;
    }
    
    setCards(cards.map((card, idx) => 
      idx === index ? {...card, flipped: true} : card
    ));
    
    setFlippedCards([...flippedCards, index]);
  };

  const handleHint = () => {
    const unmatchedCards = cards.filter(card => !card.matched && !card.flipped);
    
    if (unmatchedCards.length > 0) {
      const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
      const randomCardIndex = cards.findIndex(card => card.id === randomCard.id);
      
      const matchingCardIndex = cards.findIndex((card, idx) => 
        card.content === randomCard.content && idx !== randomCardIndex
      );
      
      setCards(cards.map((card, idx) => 
        idx === randomCardIndex || idx === matchingCardIndex 
          ? {...card, flipped: true} 
          : card
      ));
      
      setTimeout(() => {
        setCards(cards.map((card, idx) => 
          (idx === randomCardIndex || idx === matchingCardIndex) && !card.matched 
            ? {...card, flipped: false} 
            : card
        ));
      }, 1000);
      
      setTimeLeft(Math.max(0, timeLeft - 10));
      
      toast({
        title: "Đã dùng gợi ý",
        description: "Thời gian bị trừ 10 giây.",
        variant: "default",
      });
    }
  };

  const handleRestart = () => {
    if (memoryCards.length > 0) {
      const shuffledCards = [...memoryCards].sort(() => Math.random() - 0.5).map(card => ({
        ...card,
        flipped: false,
        matched: false
      }));
      
      setCards(shuffledCards);
      setTimeLeft(content?.settings?.timeLimit || 120);
      setMoves(0);
      setMatchedPairs(0);
      setFlippedCards([]);
      setGameOver(false);
      setGameWon(false);
    }
  };

  if (!content || !memoryCards.length) {
    return (
      <div className="game-container">
        <div className="game-content flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-primary">Không có dữ liệu trò chơi ghi nhớ</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (matchedPairs / totalPairs) * 100;

  // Game over screen
  if (gameOver) {
    return (
      <div className="game-container bg-gradient-to-br from-primary/5 to-background">
        <div className="game-content flex items-center justify-center">
          <Card className="compact-card p-6 sm:p-8 text-center bg-card border">
            <div className="text-6xl sm:text-7xl mb-4">😔</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-red-600">Hết thời gian!</h2>
            <p className="mb-4 text-base sm:text-lg text-primary">
              Bạn đã ghép được <span className="font-bold text-primary">{matchedPairs}/{totalPairs}</span> cặp
            </p>
            <p className="mb-6 text-sm text-primary/70">Với {moves} lượt di chuyển</p>
            <Button 
              onClick={handleRestart} 
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử Lại
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Win screen
  if (gameWon) {
    return (
      <div className="game-container bg-gradient-to-br from-primary/5 to-background">
        <div className="game-content flex items-center justify-center">
          <Card className="compact-card p-6 sm:p-8 text-center bg-card border">
            <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-base sm:text-lg text-primary">
              Bạn đã hoàn thành trò chơi với <span className="font-bold text-primary">{moves}</span> lượt.
            </p>
            <p className="mb-4 text-sm text-primary/70">
              Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
            <div className="mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {matchedPairs}/{totalPairs}
              </div>
              <Progress value={100} className="h-2 sm:h-3" />
            </div>
            <Button 
              onClick={handleRestart} 
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi Lại
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate grid columns based on number of cards and screen size
  const getGridCols = () => {
    if (cards.length <= 8) return 'grid-cols-4 sm:grid-cols-4';
    if (cards.length <= 12) return 'grid-cols-4 sm:grid-cols-6';
    if (cards.length <= 16) return 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8';
    return 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10';
  };

  return (
    <div className="game-container bg-gradient-to-br from-primary/5 to-background">
      {/* Header với thông tin trạng thái */}
      <div className="game-header">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 py-1 bg-muted rounded-full text-primary">
            Cặp: {matchedPairs}/{totalPairs}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="text-xs sm:text-sm font-medium px-2 py-1 bg-muted rounded-full flex items-center">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
              <span className="text-primary">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="text-xs sm:text-sm font-medium px-2 py-1 bg-muted rounded-full text-primary">
              Lượt: {moves}
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1.5 sm:h-2" />
      </div>

      {/* Game area - main content */}
      <div className="game-content">
        <div className="responsive-card mx-auto h-full flex items-center justify-center">
          <div className={`grid ${getGridCols()} gap-1.5 sm:gap-2 lg:gap-3 w-full max-h-full`}>
            {cards.map((card, index) => (
              <div 
                key={index}
                className="aspect-square cursor-pointer perspective-1000 min-w-0"
                onClick={() => handleCardClick(index)}
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                  transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Card back */}
                <Card 
                  className={`
                    absolute inset-0 flex items-center justify-center 
                    bg-muted border border-border
                    transition-all duration-300 hover:shadow-lg hover:scale-105
                    ${card.matched ? 'opacity-50' : 'opacity-100'}
                  `}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-primary/60 text-xs sm:text-sm lg:text-base font-bold">?</div>
                </Card>
                
                {/* Card front */}
                <Card 
                  className={`
                    absolute inset-0 flex items-center justify-center p-1 sm:p-2
                    bg-card border
                    ${card.matched 
                      ? 'border-green-400 bg-green-50 text-green-800' 
                      : 'border-border text-primary'
                    }
                  `}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="text-center text-xs sm:text-sm font-medium break-words overflow-hidden leading-tight">
                    {card.content}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer với actions */}
      <div className="game-controls">
        <div className="responsive-card mx-auto flex gap-2">
          <Button
            variant="outline"
            onClick={handleHint}
            disabled={gameOver || gameWon || cards.filter(card => !card.matched && !card.flipped).length === 0}
            className="flex-1 text-xs sm:text-sm"
          >
            <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Gợi ý
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRestart}
            className="flex-1 text-xs sm:text-sm"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemoryTemplate;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy, Lightbulb, ArrowLeft } from 'lucide-react';

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
    return <div className="p-4">Không có dữ liệu trò chơi ghi nhớ</div>;
  }

  const progressPercentage = (matchedPairs / totalPairs) * 100;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gradient-to-b from-background to-background/80">
      <div className="flex-shrink-0 p-3 sm:p-4 pt-16 sm:pt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
          <div className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
            Cặp đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-primary/10 rounded-full flex items-center">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-secondary" />
      </div>

      {gameWon ? (
        <div className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-auto">
          <Card className="p-4 sm:p-8 text-center max-w-md w-full bg-gradient-to-br from-primary/5 to-secondary/20 backdrop-blur-sm border-primary/20">
            <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-base sm:text-lg">Bạn đã hoàn thành trò chơi với {moves} lượt.</p>
            <p className="mb-4 sm:mb-6">Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-auto">
          <Card className="p-4 sm:p-8 text-center max-w-md w-full bg-gradient-to-br from-destructive/5 to-background backdrop-blur-sm border-destructive/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-destructive">Hết thời gian!</h2>
            <p className="mb-4 text-base sm:text-lg">Bạn đã tìm được {matchedPairs} trong tổng số {totalPairs} cặp thẻ.</p>
            <Button onClick={handleRestart} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-3 sm:p-4 min-h-0 overflow-hidden">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-3 sm:mb-4 overflow-auto">
            {cards.map((card, index) => (
              <div 
                key={index}
                className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 transform ${
                  card.flipped || card.matched 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 border-2 scale-105 shadow-lg hover:shadow-xl' 
                    : 'bg-gradient-to-br from-secondary/80 to-secondary/20 border-transparent border-2 hover:scale-105'
                } ${!canFlip ? 'pointer-events-none' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                {(card.flipped || card.matched) ? (
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary/90 text-center break-words overflow-hidden">{card.content}</div>
                ) : (
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-secondary/80">?</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
              Lượt đã chơi: {moves}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {content?.settings?.allowHints && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHint}
                  className="bg-gradient-to-r from-primary/10 to-background border-primary/20 text-xs sm:text-sm"
                >
                  <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500" />
                  <span className="hidden sm:inline">Gợi ý (-10s)</span>
                  <span className="sm:hidden">Gợi ý</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="bg-gradient-to-r from-secondary/50 to-background border-primary/20 text-xs sm:text-sm"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Làm lại</span>
                <span className="sm:hidden">Reset</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryTemplate;

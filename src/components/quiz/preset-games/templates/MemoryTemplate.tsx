import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy, Lightbulb } from 'lucide-react';

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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Compact header */}
      <div className="flex-shrink-0 p-2 pt-16 sm:pt-18">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs font-medium px-2 py-1 bg-primary/10 rounded-full">
            {matchedPairs}/{totalPairs}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center px-2 py-1 bg-primary/10 rounded-full">
              <Clock className="h-3 w-3 mr-1 text-primary" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="px-2 py-1 bg-primary/10 rounded-full">
              {moves} lượt
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1.5" />
      </div>

      {gameWon ? (
        <div className="flex-1 flex items-center justify-center p-3 overflow-auto">
          <Card className="p-4 text-center max-w-sm w-full">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-3 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-sm">Hoàn thành với {moves} lượt.</p>
            <p className="mb-4 text-sm">Thời gian: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            <Button onClick={handleRestart} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="flex-1 flex items-center justify-center p-3 overflow-auto">
          <Card className="p-4 text-center max-w-sm w-full">
            <h2 className="text-xl font-bold mb-3 text-destructive">Hết thời gian!</h2>
            <p className="mb-4 text-sm">Tìm được {matchedPairs}/{totalPairs} cặp thẻ.</p>
            <Button onClick={handleRestart} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : (
        <>
          {/* Game area */}
          <div className="flex-1 p-2 min-h-0 overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-full overflow-auto">
              {cards.map((card, index) => (
                <div 
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${
                    card.flipped || card.matched 
                      ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 border-2 scale-105' 
                      : 'bg-gradient-to-br from-secondary/80 to-secondary/20 border-transparent border-2 hover:scale-105'
                  } ${!canFlip ? 'pointer-events-none' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  {(card.flipped || card.matched) ? (
                    <div className="text-sm font-bold text-primary/90 text-center break-words overflow-hidden p-1">{card.content}</div>
                  ) : (
                    <div className="text-lg font-bold text-secondary/80">?</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Compact footer */}
          <div className="flex-shrink-0 p-2 border-t border-primary/10">
            <div className="flex gap-2">
              {content?.settings?.allowHints && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHint}
                  className="flex-1 text-xs h-8"
                >
                  <Lightbulb className="h-3 w-3 mr-1 text-yellow-500" />
                  Gợi ý (-10s)
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="flex-1 text-xs h-8"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Làm lại
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryTemplate;

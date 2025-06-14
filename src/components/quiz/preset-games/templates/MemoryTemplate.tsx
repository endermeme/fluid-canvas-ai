
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy, Lightbulb } from 'lucide-react';

interface MemoryCard {
  id: number;
  content: string;
  matched: boolean;
  flipped: boolean;
}

interface MemoryTemplateProps {
  content: any;
  topic: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ content, topic }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const { toast } = useToast();

  const memoryCards = content?.cards || [];
  const totalPairs = Math.floor(memoryCards.length / 2);
  const useTimer = content?.settings?.useTimer !== false;
  const timeLimit = content?.settings?.timeLimit || 120;

  // Initialize game
  useEffect(() => {
    if (memoryCards.length > 0) {
      const shuffledCards = [...memoryCards]
        .sort(() => Math.random() - 0.5)
        .map((card, index) => ({
          id: index,
          content: card.content || card.text || '',
          matched: false,
          flipped: false
        }));
      
      setCards(shuffledCards);
      setTimeLeft(useTimer ? timeLimit : 0);
      setMoves(0);
      setMatchedPairs(0);
      setFlippedCards([]);
      setGameOver(false);
      setGameWon(false);
      setCanFlip(true);
    }
  }, [memoryCards, timeLimit, useTimer]);

  // Timer logic
  useEffect(() => {
    if (useTimer && timeLeft > 0 && !gameOver && !gameWon) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (useTimer && timeLeft === 0 && !gameOver && !gameWon) {
      setGameOver(true);
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã hết thời gian chơi.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameOver, gameWon, useTimer, toast]);

  // Check win condition
  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0 && !gameWon) {
      setGameWon(true);
      toast({
        title: "Chúc mừng!",
        description: "Bạn đã hoàn thành trò chơi.",
        variant: "default",
      });
    }
  }, [matchedPairs, totalPairs, gameWon, toast]);

  // Handle matching logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      setMoves(prev => prev + 1);
      
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      if (firstCard && secondCard && firstCard.content === secondCard.content) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIndex || idx === secondIndex 
              ? { ...card, matched: true, flipped: false }
              : card
          ));
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
          setCanFlip(true);
          
          toast({
            title: "Tuyệt vời!",
            description: "Bạn đã tìm thấy một cặp khớp.",
            variant: "default",
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIndex || idx === secondIndex 
              ? { ...card, flipped: false }
              : card
          ));
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  }, [flippedCards, cards, toast]);

  const handleCardClick = (index: number) => {
    if (gameOver || gameWon || !canFlip || flippedCards.length >= 2) {
      return;
    }
    
    const card = cards[index];
    if (!card || card.flipped || card.matched) {
      return;
    }
    
    setCards(prev => prev.map((c, idx) => 
      idx === index ? { ...c, flipped: true } : c
    ));
    
    setFlippedCards(prev => [...prev, index]);
  };

  const handleHint = () => {
    const unmatchedCards = cards.filter(card => !card.matched && !card.flipped);
    
    if (unmatchedCards.length >= 2) {
      const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
      const matchingCard = unmatchedCards.find(card => 
        card.content === randomCard.content && card.id !== randomCard.id
      );
      
      if (matchingCard) {
        const randomCardIndex = cards.findIndex(card => card.id === randomCard.id);
        const matchingCardIndex = cards.findIndex(card => card.id === matchingCard.id);
        
        setCards(prev => prev.map((card, idx) => 
          idx === randomCardIndex || idx === matchingCardIndex 
            ? { ...card, flipped: true }
            : card
        ));
        
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            (idx === randomCardIndex || idx === matchingCardIndex) && !card.matched 
              ? { ...card, flipped: false }
              : card
          ));
        }, 1500);
        
        if (useTimer) {
          setTimeLeft(prev => Math.max(0, prev - 10));
        }
        
        toast({
          title: "Đã dùng gợi ý",
          description: useTimer ? "Thời gian bị trừ 10 giây." : "Đã hiển thị một cặp thẻ.",
          variant: "default",
        });
      }
    }
  };

  const handleRestart = () => {
    if (memoryCards.length > 0) {
      const shuffledCards = [...memoryCards]
        .sort(() => Math.random() - 0.5)
        .map((card, index) => ({
          id: index,
          content: card.content || card.text || '',
          matched: false,
          flipped: false
        }));
      
      setCards(shuffledCards);
      setTimeLeft(useTimer ? timeLimit : 0);
      setMoves(0);
      setMatchedPairs(0);
      setFlippedCards([]);
      setGameOver(false);
      setGameWon(false);
      setCanFlip(true);
    }
  };

  if (!content || !memoryCards.length) {
    return <div className="p-4">Không có dữ liệu trò chơi ghi nhớ</div>;
  }

  const progressPercentage = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
            Cặp đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="flex items-center gap-2">
            {useTimer && (
              <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full flex items-center">
                <Clock className="h-4 w-4 mr-1 text-primary" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            )}
            <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              Lượt: {moves}
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-secondary" />
      </div>

      {gameWon ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md bg-gradient-to-br from-primary/5 to-secondary/20 backdrop-blur-sm border-primary/20">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-lg">Bạn đã hoàn thành trò chơi với {moves} lượt.</p>
            {useTimer && (
              <p className="mb-6">Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            )}
            <Button onClick={handleRestart} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md bg-gradient-to-br from-destructive/5 to-background backdrop-blur-sm border-destructive/20">
            <h2 className="text-3xl font-bold mb-4 text-destructive">Hết thời gian!</h2>
            <p className="mb-4 text-lg">Bạn đã tìm được {matchedPairs} trong tổng số {totalPairs} cặp thẻ.</p>
            <Button onClick={handleRestart} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex-grow">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {cards.map((card, index) => (
              <div 
                key={`card-${card.id}`}
                className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 transform ${
                  card.flipped || card.matched 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 border-2 scale-105 shadow-lg hover:shadow-xl' 
                    : 'bg-gradient-to-br from-secondary/80 to-secondary/20 border-transparent border-2 hover:scale-105'
                } ${!canFlip ? 'pointer-events-none' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                {(card.flipped || card.matched) ? (
                  <div className="text-lg md:text-xl font-bold text-primary/90 text-center p-2 break-words">
                    {card.content}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-secondary/80">?</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              {content?.settings?.allowHints && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHint}
                  className="bg-gradient-to-r from-primary/10 to-background border-primary/20"
                >
                  <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                  Gợi ý {useTimer && '(-10s)'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="bg-gradient-to-r from-secondary/50 to-background border-primary/20"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Làm lại
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryTemplate;

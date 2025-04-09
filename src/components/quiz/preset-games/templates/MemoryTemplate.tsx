
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

  // Initialize the game
  useEffect(() => {
    if (memoryCards.length > 0) {
      // Shuffle the cards
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

  // Timer countdown
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

  // Check if all pairs are matched
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

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      
      const [firstIndex, secondIndex] = flippedCards;
      
      if (cards[firstIndex].content === cards[secondIndex].content) {
        // Match found
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
        // No match, flip back after delay
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
      
      // Increment moves counter
      setMoves(moves + 1);
    }
  }, [flippedCards, cards, matchedPairs, moves, toast]);

  const handleCardClick = (index: number) => {
    if (gameOver || gameWon || !canFlip || flippedCards.length >= 2 || cards[index].flipped || cards[index].matched) {
      return;
    }
    
    // Flip the card
    setCards(cards.map((card, idx) => 
      idx === index ? {...card, flipped: true} : card
    ));
    
    // Add to flipped cards
    setFlippedCards([...flippedCards, index]);
  };

  const handleHint = () => {
    // Find an unmatched, unflipped card
    const unmatchedCards = cards.filter(card => !card.matched && !card.flipped);
    
    if (unmatchedCards.length > 0) {
      // Get a random unmatched card
      const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
      const randomCardIndex = cards.findIndex(card => card.id === randomCard.id);
      
      // Find its matching pair
      const matchingCardIndex = cards.findIndex((card, idx) => 
        card.content === randomCard.content && idx !== randomCardIndex
      );
      
      // Flash both cards briefly
      setCards(cards.map((card, idx) => 
        idx === randomCardIndex || idx === matchingCardIndex 
          ? {...card, flipped: true} 
          : card
      ));
      
      // Flip back after a brief delay
      setTimeout(() => {
        setCards(cards.map((card, idx) => 
          (idx === randomCardIndex || idx === matchingCardIndex) && !card.matched 
            ? {...card, flipped: false} 
            : card
        ));
      }, 1000);
      
      // Penalty: reduce time
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
      // Shuffle the cards
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
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      {/* Header with progress and timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 rounded-full">
              Cặp đã ghép: {matchedPairs}/{totalPairs}
            </span>
          </div>
          <div className="text-sm font-medium flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 rounded-full flex items-center">
              <Clock className="h-4 w-4 mr-1 text-primary" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-secondary" />
      </div>

      {/* Game content */}
      {gameWon ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md bg-gradient-to-br from-primary/5 to-secondary/20 backdrop-blur-sm border-primary/20">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-lg">Bạn đã hoàn thành trò chơi với {moves} lượt.</p>
            <p className="mb-6">Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
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
                key={index}
                className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 transform ${
                  card.flipped || card.matched 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 border-2 scale-105 shadow-lg hover:shadow-xl' 
                    : 'bg-gradient-to-br from-secondary/80 to-secondary/20 border-transparent border-2 hover:scale-105'
                } ${!canFlip ? 'pointer-events-none' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                {(card.flipped || card.matched) ? (
                  <div className="text-3xl font-bold text-primary/90">{card.content}</div>
                ) : (
                  <div className="text-3xl font-bold text-secondary/80">?</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              Lượt đã chơi: {moves}
            </div>
            
            {content?.settings?.allowHints && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleHint}
                className="bg-gradient-to-r from-primary/10 to-background border-primary/20"
              >
                <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                Gợi ý (-10s)
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={handleRestart}
          className="w-full bg-gradient-to-r from-secondary/50 to-background border-primary/20 hover:bg-secondary/30"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Chơi lại
        </Button>
      </div>
    </div>
  );
};

export default MemoryTemplate;

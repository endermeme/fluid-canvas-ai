
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy, Lightbulb } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MemoryTemplateProps {
  data?: any;
  content: any;
  topic: string;
  settings?: any;
  onGameComplete?: (gameData: any) => void;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ data, content, topic, settings, onGameComplete }) => {
  const gameContent = content || data;
  // Use settings from props or fallback values
  const gameSettings = {
    totalTime: settings?.timeLimit || 180,
    showHints: settings?.allowHints !== false,
    hintPenalty: settings?.hintPenalty || 15,
    gridSize: settings?.gridSize || 4
  };
  
  const [cards, setCards] = useState<Array<{id: number, content: string, matched: boolean, flipped: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(gameSettings.totalTime);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [canFlip, setCanFlip] = useState<boolean>(true);
  const { toast } = useToast();

  const memoryCards = gameContent?.cards || [];
  const targetCardCount = gameSettings.gridSize * gameSettings.gridSize;
  const totalPairs = targetCardCount / 2;

  useEffect(() => {
    if (memoryCards.length > 0) {
      // Create cards based on gridSize setting
      const neededPairs = targetCardCount / 2;
      let selectedCards = [];
      
      // If we don't have enough unique cards, repeat the available ones
      if (memoryCards.length < neededPairs) {
        while (selectedCards.length < neededPairs) {
          selectedCards = [...selectedCards, ...memoryCards];
        }
        selectedCards = selectedCards.slice(0, neededPairs);
      } else {
        selectedCards = memoryCards.slice(0, neededPairs);
      }
      
      const duplicatedCards = [...selectedCards, ...selectedCards];
      const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5).map((card, index) => ({
        ...card,
        id: index,
        flipped: false,
        matched: false
      }));
      
      setCards(shuffledCards);
      setTimeLeft(gameSettings.totalTime);
      setMatchedPairs(0);
      setFlippedCards([]);
      setGameOver(false);
      setGameWon(false);
    }
  }, [memoryCards, gameSettings?.totalTime, targetCardCount]);

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
      
      // Call onGameComplete with completion time when game is won
      const completionTime = gameSettings.totalTime - timeLeft;
      if (onGameComplete) {
        onGameComplete({
          score: matchedPairs, // Keep score for internal tracking
          total: totalPairs,
          timeUsed: completionTime,
          completionTime: completionTime, // Add completion time for leaderboard
          pairs: totalPairs
        });
      }
      
      toast({
        title: "Chúc mừng!",
        description: `Hoàn thành trong ${Math.floor(completionTime / 60)}:${(completionTime % 60).toString().padStart(2, '0')}`,
        variant: "default",
      });
    }
  }, [matchedPairs, totalPairs, toast, timeLeft, gameSettings.totalTime, onGameComplete]);

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
      
      
    }
  }, [flippedCards, cards, matchedPairs, toast]);

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
      
      setTimeLeft(Math.max(0, timeLeft - gameSettings.hintPenalty));
      
      toast({
        title: "Đã dùng gợi ý",
        description: `Thời gian bị trừ ${gameSettings.hintPenalty} giây.`,
        variant: "default",
      });
    }
  };

  const handleRestart = () => {
    if (memoryCards.length > 0) {
      // Create cards based on gridSize setting
      const neededPairs = targetCardCount / 2;
      let selectedCards = [];
      
      // If we don't have enough unique cards, repeat the available ones
      if (memoryCards.length < neededPairs) {
        while (selectedCards.length < neededPairs) {
          selectedCards = [...selectedCards, ...memoryCards];
        }
        selectedCards = selectedCards.slice(0, neededPairs);
      } else {
        selectedCards = memoryCards.slice(0, neededPairs);
      }
      
      const duplicatedCards = [...selectedCards, ...selectedCards];
      const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5).map((card, index) => ({
        ...card,
        id: index,
        flipped: false,
        matched: false
      }));
      
      setCards(shuffledCards);
      setTimeLeft(gameSettings.totalTime);
      setMatchedPairs(0);
      setFlippedCards([]);
      setGameOver(false);
      setGameWon(false);
    }
  };

  if (!gameContent || !memoryCards.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-primary">Không có dữ liệu trò chơi ghi nhớ</p>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Hết thời gian!</h2>
          <p className="mb-4">Bạn đã ghép được {matchedPairs}/{totalPairs} cặp</p>
        </Card>
      </div>
    );
  }

  // Win screen
  if (gameWon) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-primary">Chúc mừng!</h2>
          <p className="mb-4">Hoàn thành trong {Math.floor((gameSettings.totalTime - timeLeft) / 60)}:{((gameSettings.totalTime - timeLeft) % 60).toString().padStart(2, '0')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 px-4">
        <div className="text-sm font-medium">Cặp: {matchedPairs}/{totalPairs}</div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>
      
      {/* Progress */}
      <Progress value={(matchedPairs / totalPairs) * 100} className="mb-4 mx-4" />

      {/* Game Grid */}
      <div
        className="grid w-full p-2 justify-center items-center"
        style={{ 
          height: `calc(100vh - 140px)`, // Trừ header (60px) + progress (32px) + footer (48px)
          maxHeight: `calc(100vw - 40px)`,
          gridTemplateColumns: `repeat(${gameSettings.gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gameSettings.gridSize}, minmax(0, 1fr))`,
          gap: `${Math.max(2, 8 - gameSettings.gridSize)}px`,
          aspectRatio: '1'
        }}
      >
        {cards.map((card, index) => {
          return (
            <div 
              key={index}
              className="cursor-pointer relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
              onClick={() => handleCardClick(index)}
            >
              {/* Card back */}
              <Card 
                className="absolute inset-0 flex items-center justify-center bg-muted border text-lg md:text-xl"
                style={{ 
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="text-primary/60 font-bold">?</div>
              </Card>
              
              {/* Card front */}
              <Card 
                className={`absolute inset-0 flex items-center justify-center text-xs md:text-sm ${
                  card.matched ? 'bg-green-100 border-green-400' : 'bg-card border'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center font-medium leading-tight overflow-hidden p-1">
                  {card.content}
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2">
        {gameSettings.showHints && (
          <Button
            variant="outline"
            onClick={handleHint}
            disabled={gameOver || gameWon}
            className="w-full"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Gợi ý (-{gameSettings.hintPenalty}s)
          </Button>
        )}
      </div>
    </div>
  );
};

export default MemoryTemplate;

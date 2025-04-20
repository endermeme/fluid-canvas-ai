import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GameHeader from '../../components/GameHeader';
import GameControls from '../../components/GameControls';
import { Trophy } from 'lucide-react';

interface MemoryTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface MemoryCard {
  id: number;
  content: string;
  matched: boolean;
  flipped: boolean;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ content, topic, onBack }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
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

  const handleShare = async () => {
    try {
      toast({
        title: "Chức năng chia sẻ",
        description: "Chức năng chia sẻ đang được phát triển.",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!content || !memoryCards.length) {
    return <div className="p-4">Không có dữ liệu trò chơi ghi nhớ</div>;
  }

  if (gameWon) {
    return (
      <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
        <GameHeader 
          onBack={onBack}
          progress={100}
          timeLeft={timeLeft}
          score={moves}
          currentItem={totalPairs}
          totalItems={totalPairs}
          title="Chúc mừng!"
          onShare={handleShare}
        />

        <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <div>
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-lg">Bạn đã hoàn thành trò chơi với {moves} lượt.</p>
            <p className="mb-6">Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            
            <GameControls onRestart={handleRestart} />
          </div>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
        <GameHeader 
          onBack={onBack}
          progress={(matchedPairs / totalPairs) * 100}
          timeLeft={0}
          score={moves}
          currentItem={matchedPairs}
          totalItems={totalPairs}
          title="Hết thời gian!"
          onShare={handleShare}
        />

        <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-destructive/5 to-background backdrop-blur-sm border-destructive/20">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-destructive">Hết thời gian!</h2>
            <p className="mb-4 text-lg">Bạn đã tìm được {matchedPairs} trong tổng số {totalPairs} cặp thẻ.</p>
            
            <GameControls onRestart={handleRestart} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      <GameHeader 
        onBack={onBack}
        progress={(matchedPairs / totalPairs) * 100}
        timeLeft={timeLeft}
        score={moves}
        currentItem={matchedPairs}
        totalItems={totalPairs}
        onShare={handleShare}
      />

      <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
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
              <div className="text-2xl font-bold text-primary/90">{card.content}</div>
            ) : (
              <div className="text-2xl font-bold text-secondary/80">?</div>
            )}
          </div>
        ))}
      </div>

      <GameControls onRestart={handleRestart} />
    </div>
  );
};

export default MemoryTemplate;

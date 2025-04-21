import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Repeat } from 'lucide-react';
import GameWrapper from './GameWrapper';

interface MemoryTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  gameId?: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ data, content, topic, onBack, gameId }) => {
  const gameContent = content || data;
  
  const [cards, setCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timeLimit || 120);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      let items = [];
      if (content?.pairs?.length) {
        items = content.pairs;
      } else if (data?.pairs?.length) {
        items = data.pairs;
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        setError("Không có dữ liệu cho trò chơi.");
      } else {
        setGamePairs(items);
        setError(null);
      }
    } catch (err) {
      setError("Dữ liệu trò chơi không hợp lệ!");
    }
    setLoading(false);
  }, [data, content]);

  if (loading) {
    return (
      <GameWrapper
        title="Ghi nhớ"
        gameId={gameId}
        onBack={onBack}
      >
        <div className="text-center py-8 text-lg text-gray-500">Đang tải trò chơi...</div>
      </GameWrapper>
    )
  }

  if (error) {
    return (
      <GameWrapper
        title="Ghi nhớ"
        gameId={gameId}
        onBack={onBack}
      >
        <div className="text-center py-8 text-red-500">
          {error}<br />
          <span className="text-sm text-gray-400">Vui lòng chọn topic hoặc thử lại!</span>
        </div>
      </GameWrapper>
    )
  }

  useEffect(() => {
    if (gameContent) {
      console.log("Memory game content:", gameContent);
      
      if (!gameStarted) {
        setGameStarted(true);
        initializeGame();
      }
    }
  }, [gameContent, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && gameStarted && !gameComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !gameComplete) {
      setGameComplete(true);
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã hết thời gian chơi.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameStarted, gameComplete, toast]);

  const initializeGame = () => {
    const rawCardData = gameContent?.cards || gameContent?.pairs || [];
    console.log("Raw card data:", rawCardData);
    
    let gameCards = [];
    
    if (rawCardData.length > 0 && 'id' in rawCardData[0]) {
      gameCards = [...rawCardData];
    } 
    else if (rawCardData.length > 0 && ('first' in rawCardData[0] || 'second' in rawCardData[0])) {
      for (let i = 0; i < rawCardData.length; i++) {
        gameCards.push({
          id: i * 2,
          pairId: i,
          content: rawCardData[i].first || rawCardData[i].left,
          matched: false,
          flipped: false
        });
        
        gameCards.push({
          id: i * 2 + 1,
          pairId: i,
          content: rawCardData[i].second || rawCardData[i].right,
          matched: false,
          flipped: false
        });
      }
    }
    else if (rawCardData.length > 0) {
      for (let i = 0; i < rawCardData.length; i += 2) {
        if (i + 1 < rawCardData.length) {
          const pairId = Math.floor(i / 2);
          
          gameCards.push({
            id: i,
            pairId: pairId,
            content: rawCardData[i].content || rawCardData[i],
            matched: false,
            flipped: false
          });
          
          gameCards.push({
            id: i + 1,
            pairId: pairId,
            content: rawCardData[i + 1].content || rawCardData[i + 1],
            matched: false,
            flipped: false
          });
        }
      }
    }
    
    gameCards = shuffleCards(gameCards);
    console.log("Initialized game cards:", gameCards);
    
    setCards(gameCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setIsChecking(false);
    setGameComplete(false);
    setTimeLeft(gameContent?.settings?.timeLimit || 120);
  };

  const shuffleCards = (cards: any[]) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCardClick = (index: number) => {
    if (isChecking || flippedIndices.includes(index) || cards[index]?.matched) {
      return;
    }
    
    if (flippedIndices.length === 2) {
      return;
    }
    
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);
      
      const firstIndex = newFlippedIndices[0];
      const secondIndex = newFlippedIndices[1];
      
      if (cards[firstIndex].pairId === cards[secondIndex].pairId) {
        const newCards = cards.map((card, idx) => {
          if (idx === firstIndex || idx === secondIndex) {
            return { ...card, matched: true };
          }
          return card;
        });
        
        const newMatchedPairs = [...matchedPairs, cards[firstIndex].pairId];
        setMatchedPairs(newMatchedPairs);
        setScore(score + 1);
        setCards(newCards);
        setFlippedIndices([]);
        setIsChecking(false);
        
        const totalPairs = Math.floor(cards.length / 2);
        if (newMatchedPairs.length === totalPairs) {
          setGameComplete(true);
          toast({
            title: "Chúc mừng!",
            description: "Bạn đã tìm thấy tất cả các cặp.",
            variant: "default",
          });
        } else {
          toast({
            title: "Ghép đôi thành công!",
            description: "Bạn đã tìm thấy một cặp khớp.",
            variant: "default",
          });
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const handleRestart = () => {
    initializeGame();
    setGameStarted(true);
  };

  if (!gameContent) {
    console.error("No game content provided");
    return <div className="p-4">Không có dữ liệu cho trò chơi</div>;
  }

  if (!cards || cards.length === 0) {
    console.error("No cards initialized", gameContent);
    return <div className="p-4">Đang tải dữ liệu thẻ chơi...</div>;
  }

  const totalPairs = Math.floor(cards.length / 2);
  const progress = (matchedPairs.length / totalPairs) * 100;

  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={score}
      currentItem={matchedPairs.length}
      totalItems={totalPairs}
      title={gameContent.title || "Memory Game"}
      gameId={gameId}
    >
      {gameComplete ? (
        <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
            <p className="text-lg mb-4">
              Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
            </p>
            
            <div className="text-xl mb-4">
              <p>Cặp đã ghép: <span className="font-bold">{matchedPairs.length}/{totalPairs}</span></p>
              <p>Số lượt: <span className="font-bold">{moves}</span></p>
              <p>Thời gian còn lại: <span className="font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span></p>
            </div>
            
            <Button onClick={handleRestart} className="mt-4">
              <Repeat className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col h-full gap-4">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">Tìm các cặp phù hợp</h2>
              <div className="text-sm font-medium">Lượt: {moves}</div>
            </div>
            
            <div className={`grid gap-3 w-full ${cards.length <= 12 ? 'md:grid-cols-4 grid-cols-3' : 'md:grid-cols-6 grid-cols-4'}`}>
              {cards.map((card, index) => (
                <div
                  key={card.id || index}
                  onClick={() => handleCardClick(index)}
                  className={`
                    aspect-[3/4] flex items-center justify-center rounded-lg cursor-pointer text-center p-1
                    transition-all duration-300 transform
                    ${flippedIndices.includes(index) || card.matched
                      ? 'bg-primary/20 shadow-md scale-105'
                      : 'bg-secondary shadow-inner scale-100'
                    }
                    ${card.matched ? 'ring-2 ring-green-500' : ''}
                  `}
                >
                  {flippedIndices.includes(index) || card.matched ? (
                    <span className="text-sm md:text-base font-medium p-1 break-words w-full">
                      {card.content}
                    </span>
                  ) : (
                    <span className="opacity-0">?</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </GameWrapper>
  );
};

export default MemoryTemplate;

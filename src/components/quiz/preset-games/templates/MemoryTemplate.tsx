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
  const { toast } = useToast();

  // Khởi tạo trò chơi
  useEffect(() => {
    if (!gameStarted && gameContent?.pairs) {
      setGameStarted(true);
      initializeGame();
    }
  }, [gameContent, gameStarted]);

  // Cài đặt đếm ngược thời gian
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

  // Khởi tạo các thẻ bài cho trò chơi
  const initializeGame = () => {
    const pairs = gameContent?.pairs || [];
    
    // Tạo bộ thẻ bài với cả 2 phần của mỗi cặp
    let gameCards = [];
    for (let i = 0; i < pairs.length; i++) {
      gameCards.push({
        id: i * 2,
        pairId: i,
        value: pairs[i].first,
        matched: false
      });
      
      gameCards.push({
        id: i * 2 + 1,
        pairId: i,
        value: pairs[i].second,
        matched: false
      });
    }
    
    // Xáo trộn các thẻ bài
    gameCards = shuffleCards(gameCards);
    
    setCards(gameCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setIsChecking(false);
    setGameComplete(false);
    setTimeLeft(gameContent?.settings?.timeLimit || 120);
  };

  // Xáo trộn các thẻ bài
  const shuffleCards = (cards: any[]) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Xử lý khi người chơi lật thẻ bài
  const handleCardClick = (index: number) => {
    // Không cho phép click khi đang kiểm tra hoặc thẻ đã được ghép đôi
    if (isChecking || flippedIndices.includes(index) || matchedPairs.includes(cards[index].pairId)) {
      return;
    }
    
    // Nếu đã lật 2 thẻ, không cho lật thêm
    if (flippedIndices.length === 2) {
      return;
    }
    
    // Thêm thẻ hiện tại vào danh sách thẻ đã lật
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // Nếu đã lật đủ 2 thẻ, kiểm tra xem chúng có ghép đôi không
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);
      
      const firstIndex = newFlippedIndices[0];
      const secondIndex = newFlippedIndices[1];
      
      // Kiểm tra xem 2 thẻ có cùng cặp không
      if (cards[firstIndex].pairId === cards[secondIndex].pairId) {
        // Nếu là một cặp, thêm vào danh sách cặp đã ghép đôi
        setMatchedPairs([...matchedPairs, cards[firstIndex].pairId]);
        setScore(score + 1);
        setFlippedIndices([]);
        setIsChecking(false);
        
        // Kiểm tra xem trò chơi đã hoàn thành chưa
        if (matchedPairs.length + 1 === gameContent?.pairs?.length) {
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
        // Nếu không phải một cặp, úp thẻ lại sau một khoảng thời gian
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  // Khởi động lại trò chơi
  const handleRestart = () => {
    initializeGame();
    setGameStarted(true);
  };

  if (!gameContent || !gameContent.pairs) {
    return <div className="p-4">Không có dữ liệu cho trò chơi</div>;
  }

  const totalPairs = gameContent.pairs.length;
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
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`
                    aspect-[3/4] flex items-center justify-center rounded-lg cursor-pointer text-center p-1
                    transition-all duration-300 transform
                    ${flippedIndices.includes(index) || matchedPairs.includes(card.pairId)
                      ? 'bg-primary/20 shadow-md scale-105'
                      : 'bg-secondary shadow-inner scale-100'
                    }
                    ${matchedPairs.includes(card.pairId) ? 'ring-2 ring-green-500' : ''}
                  `}
                >
                  {flippedIndices.includes(index) || matchedPairs.includes(card.pairId) ? (
                    <span className="text-sm md:text-base font-medium p-1 break-words w-full">
                      {card.value}
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

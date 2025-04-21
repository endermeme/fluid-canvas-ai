
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GameWrapper from './GameWrapper';

interface MemoryCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  gameId?: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({
  data,
  content,
  topic,
  onBack,
  gameId,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gamePairs, setGamePairs] = useState<{id: number, content: string}[]>([]);

  useEffect(() => {
    // Chuẩn bị dữ liệu
    setLoading(true);
    setError(null);

    try {
      let pairs = [];
      if (content?.pairs?.length) {
        pairs = content.pairs;
      } else if (data?.pairs?.length) {
        pairs = data.pairs;
      } else if (data && Array.isArray(data) && data.length > 0) {
        pairs = data;
      }

      if (!pairs || !Array.isArray(pairs) || pairs.length === 0) {
        setError("Không có dữ liệu cho trò chơi.");
        setLoading(false);
        return;
      }

      // Lưu trữ các cặp thẻ gốc
      setGamePairs(pairs);

      // Tạo bộ thẻ nhớ từ dữ liệu
      const memoryCards: MemoryCard[] = [];
      pairs.forEach((pair, index) => {
        // Thẻ 1 trong cặp
        memoryCards.push({
          id: index * 2,
          content: pair.content,
          isFlipped: false,
          isMatched: false,
        });
        // Thẻ 2 trong cặp (giống hệt)
        memoryCards.push({
          id: index * 2 + 1,
          content: pair.content,
          isFlipped: false,
          isMatched: false,
        });
      });

      // Xáo trộn thẻ
      const shuffledCards = [...memoryCards].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setError(null);
    } catch (err) {
      setError("Dữ liệu trò chơi không hợp lệ!");
    }

    setLoading(false);
  }, [data, content]);

  const handleCardClick = (id: number) => {
    // Bỏ qua khi đang kiểm tra 2 thẻ, khi thẻ đã matched, hoặc khi click vào thẻ đã lật
    if (
      flippedCards.length === 2 ||
      cards.find(card => card.id === id)?.isMatched ||
      flippedCards.includes(id)
    ) {
      return;
    }

    // Lật thẻ
    const newCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    // Thêm vào danh sách thẻ đã lật
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // Kiểm tra nếu đã lật 2 thẻ
    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(card => card.id === firstId);
      const secondCard = newCards.find(card => card.id === secondId);

      // Kiểm tra nếu 2 thẻ có nội dung giống nhau
      if (firstCard && secondCard && firstCard.content === secondCard.content) {
        // Cập nhật thẻ đã matched
        const matchedCards = newCards.map(card =>
          card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card
        );
        setCards(matchedCards);
        setMatchedPairs(prevMatches => prevMatches + 1);
        setFlippedCards([]);

        // Kiểm tra game đã hoàn thành chưa
        if (matchedPairs + 1 === gamePairs.length) {
          setIsGameComplete(true);
        }
      } else {
        // Úp lại thẻ sau 1 giây
        setTimeout(() => {
          const resetCards = newCards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    // Xáo trộn thẻ và reset game
    const resetCards = cards.map(card => ({
      ...card,
      isFlipped: false,
      isMatched: false,
    }));
    const shuffledCards = [...resetCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsGameComplete(false);
  };

  if (loading) {
    return (
      <GameWrapper
        title="Trò chơi trí nhớ"
        gameId={gameId}
        onBack={onBack}
      >
        <div className="text-center py-8 text-lg text-gray-500">Đang tải trò chơi...</div>
      </GameWrapper>
    );
  }

  if (error) {
    return (
      <GameWrapper
        title="Trò chơi trí nhớ"
        gameId={gameId}
        onBack={onBack}
      >
        <div className="text-center py-8 text-red-500">
          {error}<br />
          <span className="text-sm text-gray-400">Bạn vui lòng chọn topic hoặc thử lại!</span>
        </div>
      </GameWrapper>
    );
  }

  return (
    <GameWrapper
      title={topic || "Trò chơi trí nhớ"}
      gameId={gameId}
      onBack={onBack}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium">
            Lượt: <span className="font-bold">{moves}</span>
          </div>
          <div className="text-sm font-medium">
            Cặp đã ghép: <span className="font-bold">{matchedPairs}</span>/{gamePairs.length}
          </div>
        </div>

        <Card className="flex-grow overflow-auto mb-4">
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4">
            {cards.map(card => (
              <div
                key={card.id}
                className={`
                  aspect-square rounded-md cursor-pointer
                  flex items-center justify-center
                  transition-all duration-300 transform
                  ${card.isFlipped ? 'rotateY(180deg)' : ''}
                  ${
                    card.isFlipped
                      ? card.isMatched
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-secondary/50 dark:bg-secondary/40'
                  }
                  ${card.isMatched ? 'opacity-70' : 'hover:bg-secondary/70'}
                `}
                onClick={() => handleCardClick(card.id)}
              >
                {card.isFlipped && (
                  <span className="text-sm font-medium">{card.content}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button onClick={resetGame} variant="outline">
            Trò chơi mới
          </Button>
        </div>

        {isGameComplete && (
          <div className="mt-4 p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            Xin chúc mừng! Bạn đã hoàn thành trò chơi trong {moves} lượt.
          </div>
        )}
      </div>
    </GameWrapper>
  );
};

export default MemoryTemplate;

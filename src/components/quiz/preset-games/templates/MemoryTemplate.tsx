
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy, Eye, Zap } from 'lucide-react';

interface MemoryCard {
  id: number;
  content: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryTemplateProps {
  data?: any;
  content?: any;
  topic: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ data, content, topic }) => {
  const gameContent = content || data;
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const pairs = gameContent?.pairs || [];
  const useTimer = gameContent?.settings?.useTimer;
  const timeLimit = gameContent?.settings?.timeLimit || 180;
  const totalPairs = pairs.length;

  useEffect(() => {
    if (gameContent && pairs.length > 0 && !gameStarted) {
      initializeGame();
    }
  }, [gameContent, pairs, gameStarted]);

  useEffect(() => {
    if (useTimer && timeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (useTimer && timeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
      toast({
        title: "Hết thời gian!",
        description: "Trò chơi đã kết thúc. Hãy xem kết quả của bạn.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameStarted, showResult, useTimer, toast]);

  const initializeGame = () => {
    const gameCards: MemoryCard[] = [];
    
    pairs.forEach((pair: { term: string; definition: string }, index: number) => {
      gameCards.push({
        id: index * 2,
        content: pair.term,
        pairId: index,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: index * 2 + 1,
        content: pair.definition,
        pairId: index,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setMatchedPairs(0);
    setMoves(0);
    setFlippedCards([]);
    setShowResult(false);
    setGameStarted(true);
    setIsChecking(false);
    
    if (useTimer) {
      setTimeLeft(timeLimit);
    }
  };

  const handleCardClick = (cardIndex: number) => {
    if (isChecking || cards[cardIndex].isFlipped || cards[cardIndex].isMatched || flippedCards.length >= 2) {
      return;
    }

    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);
      
      setTimeout(() => {
        checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkForMatch = (flippedIndexes: number[]) => {
    const [firstIndex, secondIndex] = flippedIndexes;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];
    
    const newCards = [...cards];
    
    if (firstCard.pairId === secondCard.pairId) {
      // Match found
      newCards[firstIndex].isMatched = true;
      newCards[secondIndex].isMatched = true;
      setMatchedPairs(matchedPairs + 1);
      
      toast({
        title: "Tìm được cặp! 🎉",
        description: "Tuyệt vời! Bạn đã ghép đúng một cặp.",
      });
      
      if (matchedPairs + 1 === totalPairs) {
        setShowResult(true);
      }
    } else {
      // No match
      newCards[firstIndex].isFlipped = false;
      newCards[secondIndex].isFlipped = false;
      
      toast({
        title: "Chưa đúng! 🤔",
        description: "Hai thẻ này không khớp với nhau.",
        variant: "destructive",
      });
    }
    
    setCards(newCards);
    setFlippedCards([]);
    setIsChecking(false);
  };

  const handleRestart = () => {
    initializeGame();
  };

  if (!gameContent || !pairs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Không có dữ liệu trò chơi ghi nhớ</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((matchedPairs / totalPairs) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-2xl">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-primary">Hoàn Thành!</h2>
          <p className="text-lg mb-4 text-muted-foreground">
            Chủ đề: <span className="font-semibold text-primary">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-muted-foreground">Hoàn thành</span>
              <span className="font-bold text-primary text-lg">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-4 shadow-lg" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{matchedPairs}</div>
              <div className="text-sm text-muted-foreground">Cặp đã tìm</div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{moves}</div>
              <div className="text-sm text-muted-foreground">Số nước đi</div>
            </div>
          </div>
          
          {useTimer && (
            <div className="text-sm mb-6 text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
              <Clock className="inline h-4 w-4 mr-1" />
              Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi Lại
          </Button>
        </Card>
      </div>
    );
  }

  const progress = (matchedPairs / totalPairs) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20">
              <Zap className="inline h-4 w-4 mr-1" />
              Trò chơi ghi nhớ
            </div>
            <div className="flex items-center gap-3">
              {useTimer && (
                <div className="flex items-center px-3 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              )}
              <div className="px-3 py-2 bg-gradient-to-r from-green-500/15 to-green-400/10 text-green-700 rounded-full border border-green-300/30">
                Cặp: <span className="font-bold">{matchedPairs}/{totalPairs}</span>
              </div>
              <div className="px-3 py-2 bg-gradient-to-r from-blue-500/15 to-blue-400/10 text-blue-700 rounded-full border border-blue-300/30">
                Nước đi: <span className="font-bold">{moves}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-3 shadow-lg" />
        </div>

        {/* Game Grid */}
        <div className="mb-6">
          <div className={`grid gap-3 ${
            cards.length <= 12 ? 'grid-cols-4' : 
            cards.length <= 20 ? 'grid-cols-5' : 
            'grid-cols-6'
          }`}>
            {cards.map((card, index) => (
              <Card
                key={index}
                className={`aspect-square p-4 flex items-center justify-center cursor-pointer transition-all duration-300 text-center ${
                  card.isFlipped || card.isMatched
                    ? card.isMatched
                      ? 'bg-gradient-to-br from-green-500/20 to-green-400/10 border-green-300/50 shadow-lg'
                      : 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'
                    : 'bg-gradient-to-br from-card to-card/80 border-primary/10 hover:border-primary/30 hover:shadow-lg hover:scale-105'
                } ${isChecking ? 'pointer-events-none' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                {card.isFlipped || card.isMatched ? (
                  <span className="text-sm font-medium text-primary break-words">
                    {card.content}
                  </span>
                ) : (
                  <Eye className="h-8 w-8 text-primary/40" />
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center">
          <Button
            onClick={handleRestart}
            variant="outline"
            className="bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Chơi lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemoryTemplate;


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

  console.log("MemoryTemplate received props:", { data, content, topic, gameContent });

  // Cải thiện logic truy xuất dữ liệu - hỗ trợ nhiều format
  let pairs: any[] = [];
  let useTimer = false;
  let timeLimit = 180;

  if (gameContent) {
    // Format mới với pairs
    if (gameContent.pairs && Array.isArray(gameContent.pairs)) {
      pairs = gameContent.pairs;
      console.log("Using pairs format:", pairs);
    }
    // Format cũ với cards
    else if (gameContent.cards && Array.isArray(gameContent.cards)) {
      pairs = gameContent.cards;
      console.log("Using cards format:", pairs);
    }
    // Format khác có thể có trong data
    else if (Array.isArray(gameContent)) {
      pairs = gameContent;
      console.log("Using direct array format:", pairs);
    }
    // Import từ sample data
    else {
      try {
        console.log("Trying to load sample data...");
        import('../data/memorySampleData').then(module => {
          const sampleData = module.memorySampleData;
          if (sampleData && sampleData.pairs) {
            console.log("Loaded sample data:", sampleData);
            // Trigger re-initialization with sample data
            window.location.reload();
          }
        });
      } catch (error) {
        console.error("Error loading sample data:", error);
      }
    }

    // Lấy settings
    if (gameContent.settings) {
      useTimer = gameContent.settings.useTimer || false;
      timeLimit = gameContent.settings.timeLimit || 180;
    }
  }

  // Fallback nếu không có dữ liệu
  if (!pairs.length) {
    console.log("No pairs found, using fallback data");
    pairs = [
      { term: "Apple", definition: "🍎" },
      { term: "Banana", definition: "🍌" },
      { term: "Orange", definition: "🍊" },
      { term: "Grape", definition: "🍇" },
      { term: "Strawberry", definition: "🍓" }
    ];
  }

  const totalPairs = pairs.length;

  console.log("Final game configuration:", { pairs, useTimer, timeLimit, totalPairs });

  useEffect(() => {
    if (pairs.length > 0 && !gameStarted) {
      console.log("Initializing game with pairs:", pairs);
      initializeGame();
    }
  }, [pairs, gameStarted]);

  useEffect(() => {
    if (useTimer && timeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (useTimer && timeLeft === 0 && gameStarted && !showResult) {
      endGame();
    }
  }, [timeLeft, gameStarted, showResult, useTimer]);

  const initializeGame = () => {
    console.log("Starting game initialization...");
    const gameCards: MemoryCard[] = [];
    
    pairs.forEach((pair: any, index: number) => {
      // Hỗ trợ multiple formats
      let term = pair.term || pair.front || pair.content || pair.question || `Item ${index + 1}`;
      let definition = pair.definition || pair.back || pair.match || pair.answer || `Match ${index + 1}`;
      
      // Ensure content is string
      term = String(term);
      definition = String(definition);
      
      console.log(`Creating pair ${index}:`, { term, definition });
      
      gameCards.push({
        id: index * 2,
        content: term,
        pairId: index,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: index * 2 + 1,
        content: definition,
        pairId: index,
        isFlipped: false,
        isMatched: false,
      });
    });

    console.log("Generated cards:", gameCards);

    // Shuffle cards using Fisher-Yates algorithm
    const shuffledCards = [...gameCards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

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
    
    console.log("Game initialized successfully with", shuffledCards.length, "cards");
  };

  const handleCardClick = (cardIndex: number) => {
    console.log(`Card clicked: ${cardIndex}`);
    
    if (isChecking || cards[cardIndex].isFlipped || cards[cardIndex].isMatched || flippedCards.length >= 2) {
      console.log("Card click ignored - invalid state");
      return;
    }

    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    console.log("Updated flipped cards:", newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkForMatch = (flippedIndexes: number[]) => {
    const [firstIndex, secondIndex] = flippedIndexes;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];
    
    console.log("Checking match:", {
      first: { pairId: firstCard.pairId, content: firstCard.content },
      second: { pairId: secondCard.pairId, content: secondCard.content }
    });
    
    const newCards = [...cards];
    
    if (firstCard.pairId === secondCard.pairId) {
      // Match found
      console.log("Match found!");
      newCards[firstIndex].isMatched = true;
      newCards[secondIndex].isMatched = true;
      
      const newMatchedPairs = matchedPairs + 1;
      setMatchedPairs(newMatchedPairs);
      
      toast({
        title: "Tìm được cặp! 🎉",
        description: "Tuyệt vời! Bạn đã ghép đúng một cặp.",
      });
      
      if (newMatchedPairs === totalPairs) {
        console.log("Game completed!");
        setTimeout(() => {
          endGame();
        }, 500);
      }
    } else {
      // No match
      console.log("No match found");
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

  const endGame = () => {
    setShowResult(true);
    
    // Send completion message for score tracking
    const completionData = {
      type: 'QUIZ_COMPLETED',
      score: matchedPairs,
      totalQuestions: totalPairs,
      gameType: 'memory',
      completionTime: useTimer ? timeLimit - timeLeft : undefined
    };
    
    console.log("Game ended, sending completion data:", completionData);
    
    // Send to parent window for shared games
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(completionData, '*');
    }
    
    // Also trigger any global completion handlers
    if (window.onGameComplete) {
      window.onGameComplete(completionData);
    }
  };

  const handleRestart = () => {
    console.log("Restarting game");
    setGameStarted(false);
    setShowResult(false);
    setTimeout(() => {
      initializeGame();
    }, 100);
  };

  if (!pairs.length) {
    console.log("No pairs available for rendering");
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Đang tải trò chơi ghi nhớ...</h3>
          <p className="text-muted-foreground mb-4">
            Chủ đề: {topic}
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tải lại
          </Button>
        </Card>
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
            Chủ đề: <span className="font-semibold text-primary">{topic}</span>
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
              Trò chơi ghi nhớ - {topic}
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

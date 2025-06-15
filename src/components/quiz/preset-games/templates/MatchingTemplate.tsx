import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy, Sparkles, Zap } from 'lucide-react';

interface MatchingTemplateProps {
  content: any;
  topic: string;
}

interface MatchingItem {
  id: number;
  text: string;
  matched: boolean;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic }) => {
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(content?.settings?.timeLimit || 60);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const { toast } = useToast();

  const pairs = content?.pairs || [];
  const totalPairs = pairs.length;
  const difficulty = content?.settings?.difficulty || "medium";

  useEffect(() => {
    if (pairs.length > 0) {
      const shuffledLeftItems = pairs.map((pair: any, index: number) => ({
        id: index,
        text: pair.left,
        matched: false
      })).sort(() => Math.random() - 0.5);
      
      const shuffledRightItems = pairs.map((pair: any, index: number) => ({
        id: index,
        text: pair.right,
        matched: false
      })).sort(() => Math.random() - 0.5);
      
      setLeftItems(shuffledLeftItems);
      setRightItems(shuffledRightItems);
      setTimeLeft(content?.settings?.timeLimit || 60);
      setMatchedPairs(0);
      setScore(0);
      setGameOver(false);
      setGameWon(false);
      setSelectedLeft(null);
      setSelectedRight(null);
      setIsMatching(false);
      setShowCelebration(false);
    }
  }, [pairs, content?.settings?.timeLimit]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !gameWon) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver && !gameWon) {
      setGameOver(true);
      toast({
        title: "Hết thời gian! ⏰",
        description: "Bạn đã hết thời gian làm bài.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameOver, gameWon, toast]);

  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0 && !gameWon) {
      setGameWon(true);
      setShowCelebration(true);
      const finalScore = calculateFinalScore();
      setScore(finalScore);
      
      toast({
        title: "Chúc mừng! 🎉🏆",
        description: `Bạn đã hoàn thành với ${totalPairs} cặp từ và đạt ${finalScore} điểm!`,
        variant: "default",
      });

      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [matchedPairs, totalPairs, gameWon, toast]);

  const calculateFinalScore = () => {
    const baseScore = matchedPairs * 10;
    const timeBonus = Math.floor(timeLeft / 5);
    let difficultyMultiplier = 1;
    switch (difficulty) {
      case "easy": difficultyMultiplier = 1; break;
      case "medium": difficultyMultiplier = 1.5; break;
      case "hard": difficultyMultiplier = 2; break;
      default: difficultyMultiplier = 1;
    }
    
    return Math.floor((baseScore + timeBonus) * difficultyMultiplier);
  };

  const handleLeftItemClick = (id: number) => {
    if (gameOver || gameWon || isMatching) return;
    
    if (leftItems.find(item => item.id === id)?.matched) return;
    
    setSelectedLeft(id);
  };

  const handleRightItemClick = (id: number) => {
    if (gameOver || gameWon || isMatching) return;
    
    if (rightItems.find(item => item.id === id)?.matched) return;
    
    setSelectedRight(id);
  };

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      setIsMatching(true);
      
      const checkMatch = () => {
        if (selectedLeft === selectedRight) {
          setLeftItems(prevLeftItems => 
            prevLeftItems.map(item => 
              item.id === selectedLeft ? {...item, matched: true} : item
            )
          );
          
          setRightItems(prevRightItems => 
            prevRightItems.map(item => 
              item.id === selectedRight ? {...item, matched: true} : item
            )
          );
          
          setMatchedPairs(prev => prev + 1);
          setScore(prev => prev + 10);
          
          toast({
            title: "Tuyệt vời! ✨",
            description: "Bạn đã ghép đúng một cặp! +10 điểm",
            variant: "default",
          });
        } else {
          setScore(prev => Math.max(0, prev - 2));
          
          toast({
            title: "Không khớp 😅",
            description: "Hãy thử lại với cặp khác. -2 điểm",
            variant: "destructive",
          });
        }
      };
      
      setTimeout(() => {
        checkMatch();
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setIsMatching(false);
        }, 800);
      }, 500);
    }
  }, [selectedLeft, selectedRight, toast]);

  const handleRestart = () => {
    if (pairs.length > 0) {
      const shuffledLeftItems = pairs.map((pair: any, index: number) => ({
        id: index,
        text: pair.left,
        matched: false
      })).sort(() => Math.random() - 0.5);
      
      const shuffledRightItems = pairs.map((pair: any, index: number) => ({
        id: index,
        text: pair.right,
        matched: false
      })).sort(() => Math.random() - 0.5);
      
      setLeftItems(shuffledLeftItems);
      setRightItems(shuffledRightItems);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchedPairs(0);
      setScore(0);
      setTimeLeft(content?.settings?.timeLimit || 60);
      setGameOver(false);
      setGameWon(false);
      setIsMatching(false);
      setShowCelebration(false);
    }
  };

  if (!content || !pairs.length) {
    return <div className="p-4">Không có dữ liệu trò chơi nối từ</div>;
  }

  const progressPercentage = (matchedPairs / totalPairs) * 100;

  const getItemSize = (text: string) => {
    if (difficulty === "hard") return "min-h-14 text-sm";
    if (difficulty === "easy") return "min-h-16 text-lg";
    
    return text.length > 15 
      ? "min-h-16 text-sm" 
      : text.length > 8 
        ? "min-h-14 text-base" 
        : "min-h-12 text-lg";
  };

  const getItemClassName = (item: MatchingItem, isSelected: boolean, side: 'left' | 'right') => {
    let baseClass = `w-full p-4 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center transition-all duration-300 border-2 relative overflow-hidden`;
    
    if (item.matched) {
      return `${baseClass} bg-gradient-to-r from-green-100 to-green-50 border-green-400 text-green-800 cursor-not-allowed transform scale-95 shadow-lg animate-pulse-soft`;
    }
    
    if (isSelected) {
      return `${baseClass} bg-gradient-to-r from-primary/20 to-primary/10 border-primary text-primary-foreground transform scale-105 shadow-xl animate-glow`;
    }
    
    if (isMatching) {
      return `${baseClass} bg-secondary/30 border-transparent cursor-not-allowed`;
    }
    
    return `${baseClass} bg-gradient-to-r from-card to-card/90 hover:from-primary/10 hover:to-primary/5 border-border hover:border-primary/50 hover:shadow-lg hover:scale-105 cursor-pointer`;
  };

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-br from-background via-background/95 to-primary/5 relative">
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-background/90 backdrop-blur-sm">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
      
      <div className="relative mb-4">
        <div className="flex justify-between items-center mb-3 mt-12">
          <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
            <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
            Đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm font-medium px-4 py-2 bg-gradient-to-r from-yellow-500/15 to-yellow-400/10 rounded-full border border-yellow-300/30 backdrop-blur-sm">
              <Trophy className="h-4 w-4 mr-2 text-yellow-600" />
              <span className="font-bold">{score}</span>
            </div>
            <div className="text-sm font-medium flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/15 to-blue-400/10 rounded-full border border-blue-300/30 backdrop-blur-sm">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-3 shadow-lg" 
          indicatorColor="bg-gradient-to-r from-primary via-primary/90 to-primary/80"
          showPercentage={false}
        />
      </div>

      {gameWon ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md bg-gradient-to-br from-card via-card/95 to-primary/5 border-2 border-primary/20 shadow-2xl animate-scale-in">
            <div className="mb-4 flex justify-center">
              <Trophy className="h-16 w-16 text-yellow-500 animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Chúc mừng!
            </h2>
            <p className="mb-3 text-lg">Bạn đã hoàn thành với {totalPairs} cặp từ.</p>
            <div className="mb-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-700 flex items-center justify-center">
                <Zap className="h-6 w-6 mr-2" />
                {score} điểm
              </p>
            </div>
            <p className="mb-6 text-muted-foreground">
              Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
            <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md bg-gradient-to-br from-card via-card/95 to-red-500/5 border-2 border-red-200 shadow-2xl animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Hết thời gian! ⏰</h2>
            <p className="mb-3">Bạn đã ghép được {matchedPairs} trong tổng số {totalPairs} cặp từ.</p>
            <div className="mb-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-xl font-bold text-blue-700 flex items-center justify-center">
                <Trophy className="h-5 w-5 mr-2" />
                {score} điểm
              </p>
            </div>
            <Button onClick={handleRestart} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 bg-gradient-to-br from-card/80 to-card/60 border-2 border-primary/10 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3 text-center bg-gradient-to-r from-primary/15 to-primary/10 py-2 px-4 rounded-lg border border-primary/20">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Cột A
              </span>
            </h3>
            <div className="space-y-3">
              {leftItems.map((item) => (
                <button
                  key={`left-${item.id}`}
                  className={getItemClassName(item, selectedLeft === item.id, 'left')}
                  onClick={() => handleLeftItemClick(item.id)}
                  disabled={item.matched || isMatching}
                >
                  <span className="line-clamp-2 relative z-10">{item.text}</span>
                  {!item.matched && selectedLeft === item.id && (
                    <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-card/80 to-card/60 border-2 border-primary/10 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3 text-center bg-gradient-to-r from-primary/15 to-primary/10 py-2 px-4 rounded-lg border border-primary/20">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Cột B
              </span>
            </h3>
            <div className="space-y-3">
              {rightItems.map((item) => (
                <button
                  key={`right-${item.id}`}
                  className={getItemClassName(item, selectedRight === item.id, 'right')}
                  onClick={() => handleRightItemClick(item.id)}
                  disabled={item.matched || isMatching}
                >
                  <span className="line-clamp-2 relative z-10">{item.text}</span>
                  {!item.matched && selectedRight === item.id && (
                    <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Button 
          variant="outline" 
          onClick={handleRestart}
          className="w-full bg-gradient-to-r from-card/70 to-card/50 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 shadow-lg"
          size="sm"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm lại
        </Button>
      </div>
    </div>
  );
};

export default MatchingTemplate;

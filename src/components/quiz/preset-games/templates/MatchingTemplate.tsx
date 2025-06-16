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
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-foreground">Không có dữ liệu trò chơi nối từ</p>
        </div>
      </div>
    );
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
      return `${baseClass} bg-green-100 dark:bg-green-950 border-green-400 text-green-800 dark:text-green-200 cursor-not-allowed transform scale-95 shadow-lg`;
    }
    
    if (isSelected) {
      return `${baseClass} bg-primary/20 border-primary text-foreground transform scale-105 shadow-xl`;
    }
    
    if (isMatching) {
      return `${baseClass} bg-secondary/30 border-transparent cursor-not-allowed`;
    }
    
    return `${baseClass} bg-card hover:bg-primary/5 border-border hover:border-primary/50 hover:shadow-lg hover:scale-105 cursor-pointer text-foreground`;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-background/95 overflow-hidden">
      {/* Fixed Header với điểm số */}
      <div className="flex-shrink-0 p-4 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
            Đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm font-medium px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-300/30">
              <Trophy className="h-4 w-4 mr-2 text-yellow-600" />
              <span className="font-bold text-foreground">{score}</span>
            </div>
            <div className="text-sm font-medium flex items-center px-4 py-2 bg-blue-500/10 rounded-full border border-blue-300/30">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-foreground">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      {gameWon ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-md bg-card border shadow-2xl">
            <div className="mb-4 flex justify-center">
              <Trophy className="h-16 w-16 text-yellow-500 animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Chúc mừng!
            </h2>
            <p className="mb-3 text-lg text-muted-foreground">Bạn đã hoàn thành với {totalPairs} cặp từ.</p>
            <div className="mb-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 flex items-center justify-center">
                <Zap className="h-6 w-6 mr-2" />
                {score} điểm
              </p>
            </div>
            <p className="mb-6 text-muted-foreground">
              Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
            <Button onClick={handleRestart} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-md bg-card border shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Hết thời gian! ⏰</h2>
            <p className="mb-3 text-muted-foreground">Bạn đã ghép được {matchedPairs} trong tổng số {totalPairs} cặp từ.</p>
            <div className="mb-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center justify-center">
                <Trophy className="h-5 w-5 mr-2" />
                {score} điểm
              </p>
            </div>
            <Button onClick={handleRestart} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 bg-card border shadow-lg overflow-hidden">
              <h3 className="text-lg font-semibold mb-3 text-center bg-primary/10 py-2 px-4 rounded-lg border border-primary/20">
                <span className="text-foreground">Cột A</span>
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[calc(100%-4rem)]">
                {leftItems.map((item) => (
                  <button
                    key={`left-${item.id}`}
                    className={getItemClassName(item, selectedLeft === item.id, 'left')}
                    onClick={() => handleLeftItemClick(item.id)}
                    disabled={item.matched || isMatching}
                  >
                    <span className="line-clamp-2 relative z-10">{item.text}</span>
                  </button>
                ))}
              </div>
            </Card>
            
            <Card className="p-4 bg-card border shadow-lg overflow-hidden">
              <h3 className="text-lg font-semibold mb-3 text-center bg-primary/10 py-2 px-4 rounded-lg border border-primary/20">
                <span className="text-foreground">Cột B</span>
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[calc(100%-4rem)]">
                {rightItems.map((item) => (
                  <button
                    key={`right-${item.id}`}
                    className={getItemClassName(item, selectedRight === item.id, 'right')}
                    onClick={() => handleRightItemClick(item.id)}
                    disabled={item.matched || isMatching}
                  >
                    <span className="line-clamp-2 relative z-10">{item.text}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-4 flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={handleRestart}
              className="w-full bg-card border-primary/20 hover:bg-primary/10"
              size="sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm lại
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingTemplate;

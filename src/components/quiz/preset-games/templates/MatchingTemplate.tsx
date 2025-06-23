import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy } from 'lucide-react';

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
        title: "Hết thời gian!",
        description: "Bạn đã hết thời gian làm bài.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameOver, gameWon, toast]);

  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0 && !gameWon) {
      setGameWon(true);
      const finalScore = calculateFinalScore();
      setScore(finalScore);
      
      toast({
        title: "Chúc mừng!",
        description: `Bạn đã hoàn thành trò chơi với ${totalPairs} cặp từ và đạt ${finalScore} điểm.`,
        variant: "default",
      });
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
    if (gameOver || gameWon) return;
    
    if (leftItems.find(item => item.id === id)?.matched) return;
    
    setSelectedLeft(id);
  };

  const handleRightItemClick = (id: number) => {
    if (gameOver || gameWon) return;
    
    if (rightItems.find(item => item.id === id)?.matched) return;
    
    setSelectedRight(id);
  };

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
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
            title: "Tuyệt vời!",
            description: "Bạn đã ghép đúng một cặp.",
            variant: "default",
          });
        } else {
          setScore(prev => Math.max(0, prev - 2));
          
          toast({
            title: "Không khớp",
            description: "Hãy thử lại với cặp khác.",
            variant: "destructive",
          });
        }
      };
      
      checkMatch();
      
      const timer = setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
      
      return () => clearTimeout(timer);
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
    }
  };

  if (!content || !pairs.length) {
    return (
      <div className="game-container">
        <div className="game-content flex items-center justify-center">
          <p className="text-primary">Không có dữ liệu trò chơi nối từ</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (matchedPairs / totalPairs) * 100;

  const getItemSize = (text: string) => {
    if (difficulty === "hard") return "min-h-12 text-sm";
    if (difficulty === "easy") return "min-h-14 text-base";
    
    return text.length > 15 
      ? "min-h-13 text-sm" 
      : text.length > 8 
        ? "min-h-12 text-sm" 
        : "min-h-11 text-base";
  };

  return (
    <div className="game-container bg-gradient-to-br from-primary/5 to-background">
      <div className="game-header">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full text-primary">
            Đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-primary">Điểm: {score}</span>
            </div>
            <div className="text-sm font-medium flex items-center px-3 py-1 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 mr-1 text-primary" />
              <span className="text-primary">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {gameWon ? (
        <div className="game-content flex items-center justify-center">
          <Card className="p-6 text-center compact-card bg-card">
            <h2 className="text-2xl font-bold mb-4 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-primary">Bạn đã hoàn thành trò chơi với {totalPairs} cặp từ.</p>
            <p className="mb-2 text-xl font-bold text-primary">Điểm số: {score}</p>
            <p className="mb-6 text-primary">Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            <Button onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="game-content flex items-center justify-center">
          <Card className="p-6 text-center compact-card bg-card">
            <h2 className="text-2xl font-bold mb-4 text-primary">Hết thời gian!</h2>
            <p className="mb-2 text-primary">Bạn đã ghép được {matchedPairs} trong tổng số {totalPairs} cặp từ.</p>
            <p className="mb-2 text-xl font-bold text-primary">Điểm số: {score}</p>
            <Button onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : (
        <div className="game-content">
          <div className="responsive-card mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-3 bg-card/50 border border-primary/10">
              <h3 className="text-base font-medium mb-2 text-center bg-primary/10 py-1 px-2 rounded-md text-primary">Cột A</h3>
              <div className="space-y-2">
                {leftItems.map((item) => (
                  <button
                    key={`left-${item.id}`}
                    className={`w-full p-2 sm:p-3 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center ${
                      item.matched 
                        ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                        : selectedLeft === item.id
                          ? 'bg-primary/20 border-primary border text-primary'
                          : 'bg-secondary hover:bg-secondary/80 border-transparent border text-primary'
                    }`}
                    onClick={() => handleLeftItemClick(item.id)}
                    disabled={item.matched}
                  >
                    <span className="line-clamp-2 text-xs sm:text-sm">{item.text}</span>
                  </button>
                ))}
              </div>
            </Card>
            
            <Card className="p-3 bg-card/50 border border-primary/10">
              <h3 className="text-base font-medium mb-2 text-center bg-primary/10 py-1 px-2 rounded-md text-primary">Cột B</h3>
              <div className="space-y-2">
                {rightItems.map((item) => (
                  <button
                    key={`right-${item.id}`}
                    className={`w-full p-2 sm:p-3 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center ${
                      item.matched 
                        ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                        : selectedRight === item.id
                          ? 'bg-primary/20 border-primary border text-primary'
                          : 'bg-secondary hover:bg-secondary/80 border-transparent border text-primary'
                    }`}
                    onClick={() => handleRightItemClick(item.id)}
                    disabled={item.matched}
                  >
                    <span className="line-clamp-2 text-xs sm:text-sm">{item.text}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className="game-controls">
        <div className="responsive-card mx-auto">
          <Button 
            variant="outline" 
            onClick={handleRestart}
            className="w-full bg-gradient-to-r from-secondary/30 to-background/90 border-primary/20"
            size="sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchingTemplate;

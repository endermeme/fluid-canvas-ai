import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy } from 'lucide-react';

interface MatchingTemplateProps {
  content: any;
  topic: string;
  settings?: any;
}

interface MatchingItem {
  id: number;
  text: string;
  matched: boolean;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic, settings }) => {
  // Memoize settings to prevent infinite re-renders
  const gameSettings = useMemo(() => ({
    pairCount: settings?.pairCount || 8,
    timeLimit: settings?.timeLimit || 120,
    bonusTimePerMatch: settings?.bonusTimePerMatch || 5,
    allowPartialMatching: settings?.allowPartialMatching || false,
    debugMode: settings?.debugMode || false
  }), [settings]);
  
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(gameSettings.timeLimit);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);
  const { toast } = useToast();

  // Memoize pairs to prevent infinite re-renders
  const pairs = useMemo(() => {
    const allPairs = content?.pairs || [];
    return allPairs.slice(0, gameSettings.pairCount);
  }, [content?.pairs, gameSettings.pairCount]);
  
  const totalPairs = pairs.length;

  // Initialize game
  const initializeGame = useCallback(() => {
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
      setTimeLeft(gameSettings.timeLimit);
      setMatchedPairs(0);
      setIncorrectAttempts(0);
      setGameOver(false);
      setGameWon(false);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [pairs, gameSettings.timeLimit]);

  // Initialize on component mount and when dependencies change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !gameWon) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
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

  // Check win condition
  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0 && !gameWon && !gameOver) {
      setGameWon(true);
      
      toast({
        title: "Chúc mừng!",
        description: `Bạn đã hoàn thành trò chơi với ${totalPairs} cặp từ.`,
        variant: "default",
      });
    }
  }, [matchedPairs, totalPairs, gameWon, gameOver, toast]);

  const handleLeftItemClick = useCallback((id: number) => {
    if (gameOver || gameWon) return;
    
    const item = leftItems.find(item => item.id === id);
    if (item?.matched) return;
    
    setSelectedLeft(id);
  }, [leftItems, gameOver, gameWon]);

  const handleRightItemClick = useCallback((id: number) => {
    if (gameOver || gameWon) return;
    
    const item = rightItems.find(item => item.id === id);
    if (item?.matched) return;
    
    setSelectedRight(id);
  }, [rightItems, gameOver, gameWon]);

  // Check match when both items are selected
  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      const leftItem = leftItems.find(item => item.id === selectedLeft);
      const rightItem = rightItems.find(item => item.id === selectedRight);
      
      if (!leftItem || !rightItem) return;
      
      // Find correct pair from original pairs
      const correctPair = pairs.find(pair => 
        pair.left === leftItem.text && pair.right === rightItem.text
      );
      
      const timer = setTimeout(() => {
        if (correctPair) {
          setLeftItems(prev => 
            prev.map(item => 
              item.id === selectedLeft ? {...item, matched: true} : item
            )
          );
          
          setRightItems(prev => 
            prev.map(item => 
              item.id === selectedRight ? {...item, matched: true} : item
            )
          );
          
          setMatchedPairs(prev => prev + 1);
          
          // Award bonus time for correct match
          if (gameSettings.bonusTimePerMatch > 0) {
            setTimeLeft(prev => prev + gameSettings.bonusTimePerMatch);
          }
          
          toast({
            title: "Đúng rồi!",
            description: "Bạn đã ghép đúng một cặp.",
            variant: "default",
          });
        } else {
          setIncorrectAttempts(prev => prev + 1);
          
          toast({
            title: "Sai rồi",
            description: "Cặp này không khớp với nhau.",
            variant: "destructive",
          });
        }
        
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [selectedLeft, selectedRight, leftItems, rightItems, pairs, gameSettings.bonusTimePerMatch, toast]);

  if (!content || !pairs.length) {
    return (
      <div className="game-container">
        <div className="game-content flex items-center justify-center">
          <p className="text-primary">Không có dữ liệu trò chơi nối từ</p>
        </div>
      </div>
    );
  }

  const progressPercentage = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;
  const displayTime = Math.max(0, timeLeft);
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

  const getItemSize = () => {
    return "min-h-12 text-sm";
  };

  return (
    <div className="unified-game-container">
      <div className="game-header">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 py-1 bg-muted rounded-full text-primary">
            Đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="text-xs sm:text-sm font-medium flex items-center px-2 py-1 bg-muted rounded-full">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
              <span className="text-primary">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1.5 sm:h-2" />
      </div>

      {gameWon ? (
        <div className="game-content flex items-center justify-center">
          <Card className="compact-card p-4 sm:p-6 text-center bg-card border">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-sm sm:text-base text-primary">Bạn đã hoàn thành trò chơi với {totalPairs} cặp từ.</p>
            <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-primary">Thời gian còn lại: {minutes}:{seconds.toString().padStart(2, '0')}</p>
            <div className="text-center text-xs sm:text-sm text-primary/70">
              Sử dụng nút làm mới ở header để chơi lại
            </div>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="game-content flex items-center justify-center">
          <Card className="compact-card p-4 sm:p-6 text-center bg-card border">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary">Hết thời gian!</h2>
            <p className="mb-2 text-sm sm:text-base text-primary">Bạn đã ghép được {matchedPairs} trong tổng số {totalPairs} cặp từ.</p>
            <div className="text-center text-xs sm:text-sm text-primary/70">
              Sử dụng nút làm mới ở header để chơi lại
            </div>
          </Card>
        </div>
      ) : (
        <div className="game-content">
          <div className="responsive-card mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
            <Card className="p-2 sm:p-3 bg-card border">
              <h3 className="text-sm sm:text-base font-medium mb-2 text-center bg-muted py-1 px-2 rounded-md text-primary">Cột A</h3>
              <div className="space-y-1 sm:space-y-2">
                {leftItems.map((item) => (
                  <button
                    key={`left-${item.id}`}
                    className={`w-full p-2 rounded-lg text-left break-words ${getItemSize()} flex items-center ${
                      item.matched 
                        ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                        : selectedLeft === item.id
                          ? 'bg-primary/20 border-primary border text-primary'
                          : 'bg-muted hover:bg-muted/80 border border-border text-primary'
                    }`}
                    onClick={() => handleLeftItemClick(item.id)}
                    disabled={item.matched}
                  >
                    <span className="line-clamp-2 text-xs sm:text-sm">{item.text}</span>
                  </button>
                ))}
              </div>
            </Card>
            
            <Card className="p-2 sm:p-3 bg-card border">
              <h3 className="text-sm sm:text-base font-medium mb-2 text-center bg-muted py-1 px-2 rounded-md text-primary">Cột B</h3>
              <div className="space-y-1 sm:space-y-2">
                {rightItems.map((item) => (
                  <button
                    key={`right-${item.id}`}
                    className={`w-full p-2 rounded-lg text-left break-words ${getItemSize()} flex items-center ${
                      item.matched 
                        ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                        : selectedRight === item.id
                          ? 'bg-primary/20 border-primary border text-primary'
                          : 'bg-muted hover:bg-muted/80 border border-border text-primary'
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
          <div className="text-center text-sm text-primary/70">
            Sử dụng nút làm mới ở header để bắt đầu lại
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingTemplate;
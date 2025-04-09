
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, ArrowLeft, Trophy } from 'lucide-react';

interface MatchingTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface MatchingItem {
  id: number;
  text: string;
  matched: boolean;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic, onBack }) => {
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

  // Initialize the game
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

  // Timer countdown
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

  // Check if all pairs are matched
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
    // Base score from matched pairs
    const baseScore = matchedPairs * 10;
    
    // Time bonus - more time left = more bonus
    const timeBonus = Math.floor(timeLeft / 5);
    
    // Difficulty multiplier
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
    
    // If the item is already matched, do nothing
    if (leftItems.find(item => item.id === id)?.matched) return;
    
    setSelectedLeft(id);
  };

  const handleRightItemClick = (id: number) => {
    if (gameOver || gameWon) return;
    
    // If the item is already matched, do nothing
    if (rightItems.find(item => item.id === id)?.matched) return;
    
    setSelectedRight(id);
  };

  // Check if selected items match
  useEffect(() => {
    // Only run this effect when both items are selected
    if (selectedLeft !== null && selectedRight !== null) {
      const checkMatch = () => {
        if (selectedLeft === selectedRight) {
          // Match found
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
          
          // Update score immediately for feedback
          setScore(prev => prev + 10);
          
          toast({
            title: "Tuyệt vời!",
            description: "Bạn đã ghép đúng một cặp.",
            variant: "default",
          });
        } else {
          // No match - penalty for wrong matches
          setScore(prev => Math.max(0, prev - 2));
          
          toast({
            title: "Không khớp",
            description: "Hãy thử lại với cặp khác.",
            variant: "destructive",
          });
        }
      };
      
      // Execute match check only once
      checkMatch();
      
      // Reset selections after a short delay
      const timer = setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedLeft, selectedRight, toast]); // Remove dependencies that cause infinite loop

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
    return <div className="p-4">Không có dữ liệu trò chơi nối từ</div>;
  }

  const progressPercentage = (matchedPairs / totalPairs) * 100;

  // Determine item size based on content length and difficulty
  const getItemSize = (text: string) => {
    if (difficulty === "hard") return "min-h-14 text-sm";
    if (difficulty === "easy") return "min-h-16 text-lg";
    
    // Default medium difficulty sizing
    return text.length > 15 
      ? "min-h-16 text-sm" 
      : text.length > 8 
        ? "min-h-14 text-base" 
        : "min-h-12 text-lg";
  };

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Header with navigation, progress and timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại
              </Button>
            )}
            <div className="text-sm font-medium">
              Đã ghép: {matchedPairs}/{totalPairs}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm font-medium">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              Điểm: {score}
            </div>
            <div className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Game content */}
      {gameWon ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-6 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Chúc mừng!</h2>
            <p className="mb-2">Bạn đã hoàn thành trò chơi với {totalPairs} cặp từ.</p>
            <p className="mb-2 text-xl font-bold text-primary">Điểm số: {score}</p>
            <p className="mb-6">Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            <Button onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-6 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Hết thời gian!</h2>
            <p className="mb-2">Bạn đã ghép được {matchedPairs} trong tổng số {totalPairs} cặp từ.</p>
            <p className="mb-2 text-xl font-bold text-primary">Điểm số: {score}</p>
            <Button onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2 text-center">Cột A</h3>
            {leftItems.map((item) => (
              <button
                key={`left-${item.id}`}
                className={`w-full p-3 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center ${
                  item.matched 
                    ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                    : selectedLeft === item.id
                      ? 'bg-primary/20 border-primary border'
                      : 'bg-secondary hover:bg-secondary/80 border-transparent border'
                }`}
                onClick={() => handleLeftItemClick(item.id)}
                disabled={item.matched}
              >
                <span className="line-clamp-2">{item.text}</span>
              </button>
            ))}
          </div>
          
          {/* Right column */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2 text-center">Cột B</h3>
            {rightItems.map((item) => (
              <button
                key={`right-${item.id}`}
                className={`w-full p-3 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center ${
                  item.matched 
                    ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                    : selectedRight === item.id
                      ? 'bg-primary/20 border-primary border'
                      : 'bg-secondary hover:bg-secondary/80 border-transparent border'
                }`}
                onClick={() => handleRightItemClick(item.id)}
                disabled={item.matched}
              >
                <span className="line-clamp-2">{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={handleRestart}
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm lại
        </Button>
      </div>
    </div>
  );
};

export default MatchingTemplate;

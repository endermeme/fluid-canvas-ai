
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock } from 'lucide-react';

interface MatchingTemplateProps {
  content: any;
  topic: string;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic }) => {
  const [leftItems, setLeftItems] = useState<Array<{id: number, text: string, matched: boolean}>>([]);
  const [rightItems, setRightItems] = useState<Array<{id: number, text: string, matched: boolean}>>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(content?.settings?.timeLimit || 60);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const { toast } = useToast();

  const pairs = content?.pairs || [];
  const totalPairs = pairs.length;

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
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setGameWon(true);
      toast({
        title: "Chúc mừng!",
        description: "Bạn đã hoàn thành trò chơi.",
        variant: "default",
      });
    }
  }, [matchedPairs, totalPairs, toast]);

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
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        // Match found
        setLeftItems(leftItems.map(item => 
          item.id === selectedLeft ? {...item, matched: true} : item
        ));
        setRightItems(rightItems.map(item => 
          item.id === selectedRight ? {...item, matched: true} : item
        ));
        setMatchedPairs(matchedPairs + 1);
        
        toast({
          title: "Tuyệt vời!",
          description: "Bạn đã ghép đúng một cặp.",
          variant: "default",
        });
      } else {
        // No match
        toast({
          title: "Không khớp",
          description: "Hãy thử lại với cặp khác.",
          variant: "destructive",
        });
      }
      
      // Reset selections after a short delay
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
    }
  }, [selectedLeft, selectedRight, leftItems, rightItems, matchedPairs, toast]);

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
      setTimeLeft(content?.settings?.timeLimit || 60);
      setGameOver(false);
      setGameWon(false);
    }
  };

  if (!content || !pairs.length) {
    return <div className="p-4">Không có dữ liệu trò chơi nối từ</div>;
  }

  const progressPercentage = (matchedPairs / totalPairs) * 100;

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Header with progress and timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            Đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Game content */}
      {gameWon ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-6 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Chúc mừng!</h2>
            <p className="mb-4">Bạn đã hoàn thành trò chơi với {totalPairs} cặp từ.</p>
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
            <p className="mb-4">Bạn đã ghép được {matchedPairs} trong tổng số {totalPairs} cặp từ.</p>
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
                className={`w-full p-3 rounded-lg text-left ${
                  item.matched 
                    ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                    : selectedLeft === item.id
                      ? 'bg-primary/20 border-primary border'
                      : 'bg-secondary hover:bg-secondary/80 border-transparent border'
                }`}
                onClick={() => handleLeftItemClick(item.id)}
                disabled={item.matched}
              >
                {item.text}
              </button>
            ))}
          </div>
          
          {/* Right column */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2 text-center">Cột B</h3>
            {rightItems.map((item) => (
              <button
                key={`right-${item.id}`}
                className={`w-full p-3 rounded-lg text-left ${
                  item.matched 
                    ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                    : selectedRight === item.id
                      ? 'bg-primary/20 border-primary border'
                      : 'bg-secondary hover:bg-secondary/80 border-transparent border'
                }`}
                onClick={() => handleRightItemClick(item.id)}
                disabled={item.matched}
              >
                {item.text}
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

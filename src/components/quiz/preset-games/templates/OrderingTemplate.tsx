
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Check, ArrowDown, ArrowUp } from 'lucide-react';
import { animateBlockCreation } from '@/lib/animations';

interface OrderItem {
  id: number;
  text: string;
  order: number;
}

interface OrderingContent {
  title: string;
  description: string;
  items: OrderItem[];
}

interface OrderingTemplateProps {
  content: OrderingContent;
  topic: string;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({ content, topic }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [correctItems, setCorrectItems] = useState<number[]>([]);
  const [incorrectItems, setIncorrectItems] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const gameRef = useRef<HTMLDivElement>(null);

  // Initialize the game
  useEffect(() => {
    if (content?.items && content.items.length > 0) {
      // Clone and shuffle the items
      const shuffledItems = [...content.items].sort(() => Math.random() - 0.5);
      setItems(shuffledItems);
      
      // Initialize user order with all items
      setUserOrder(shuffledItems.map(item => item.id));
      
      // Reset game state
      setIsComplete(false);
      setIsChecking(false);
      setCorrectItems([]);
      setIncorrectItems([]);
      setAttempts(0);
      setTimer(0);
      setTimerActive(true);
    }
  }, [content]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && !isComplete) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, isComplete]);

  // Animation when component mounts
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.querySelectorAll('.order-item').forEach((element, index) => {
        setTimeout(() => {
          if (element instanceof HTMLElement) {
            animateBlockCreation(element);
          }
        }, index * 50);
      });
    }
  }, [items]);

  // Move an item up in the user's order
  const moveItemUp = (id: number) => {
    const index = userOrder.indexOf(id);
    if (index > 0) {
      const newOrder = [...userOrder];
      const temp = newOrder[index];
      newOrder[index] = newOrder[index - 1];
      newOrder[index - 1] = temp;
      setUserOrder(newOrder);
    }
  };

  // Move an item down in the user's order
  const moveItemDown = (id: number) => {
    const index = userOrder.indexOf(id);
    if (index < userOrder.length - 1) {
      const newOrder = [...userOrder];
      const temp = newOrder[index];
      newOrder[index] = newOrder[index + 1];
      newOrder[index + 1] = temp;
      setUserOrder(newOrder);
    }
  };

  // Check the user's order against the correct order
  const checkOrder = () => {
    setIsChecking(true);
    setAttempts(attempts + 1);
    
    // Create map of item ID to correct order
    const correctOrderMap = content.items.reduce((map, item) => {
      map[item.id] = item.order;
      return map;
    }, {} as Record<number, number>);
    
    // Initialize arrays for correct and incorrect items
    const correct: number[] = [];
    const incorrect: number[] = [];
    
    // Check each item in the user's order
    userOrder.forEach((itemId, index) => {
      const correctPositionIndex = correctOrderMap[itemId] - 1; // Adjust for 0-based index
      
      if (index === correctPositionIndex) {
        correct.push(itemId);
      } else {
        incorrect.push(itemId);
      }
    });
    
    setCorrectItems(correct);
    setIncorrectItems(incorrect);
    
    // Check if all items are in the correct order
    if (incorrect.length === 0) {
      setIsComplete(true);
      setTimerActive(false);
    }
  };

  // Reset the game
  const resetGame = () => {
    if (content?.items) {
      const shuffledItems = [...content.items].sort(() => Math.random() - 0.5);
      setItems(shuffledItems);
      setUserOrder(shuffledItems.map(item => item.id));
    }
    
    setIsComplete(false);
    setIsChecking(false);
    setCorrectItems([]);
    setIncorrectItems([]);
    setAttempts(attempts + 1);
    setTimer(0);
    setTimerActive(true);
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!content || !content.items || content.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Không có nội dung</h3>
          <p className="text-gray-500">Không tìm thấy dữ liệu sắp xếp cho trò chơi này.</p>
        </div>
      </div>
    );
  }

  // Show completion screen if game is complete
  if (isComplete) {
    const score = Math.max(100 - (attempts - 1) * 10, 60);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Bạn đã hoàn thành!</h2>
          
          <div className="mb-6">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <Progress value={score} className="h-2" />
          </div>
          
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-semibold">Thời gian</p>
              <p className="text-xl">{formatTime(timer)}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-semibold">Số lần thử</p>
              <p className="text-xl">{attempts}</p>
            </div>
          </div>
          
          <Button onClick={resetGame} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4" ref={gameRef}>
      <div className="mb-4 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetGame}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Xáo trộn lại
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">Thời gian:</span> {formatTime(timer)}
          </div>
          {attempts > 0 && (
            <div className="text-sm">
              <span className="font-medium">Đã thử:</span> {attempts} lần
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-2">{content.title}</h3>
        <p>{content.description}</p>
      </div>
      
      {isChecking && (
        <div className="mb-4">
          <Progress 
            value={(correctItems.length / content.items.length) * 100} 
            className="h-2 mb-2" 
          />
          <div className="text-sm text-right">
            <span className="font-medium">Đúng:</span> {correctItems.length}/{content.items.length}
          </div>
        </div>
      )}
      
      <div className="flex-grow">
        <div className="space-y-3">
          {userOrder.map((itemId, index) => {
            const item = items.find(i => i.id === itemId);
            if (!item) return null;
            
            return (
              <div 
                key={item.id}
                className={`
                  order-item flex items-center gap-3 p-4 rounded-lg border
                  ${isChecking 
                    ? correctItems.includes(item.id) 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-red-50 border-red-300' 
                    : 'bg-card border-border'}
                `}
              >
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-grow">{item.text}</div>
                
                {!isChecking && (
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-7 w-7"
                      onClick={() => moveItemUp(item.id)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-7 w-7"
                      onClick={() => moveItemDown(item.id)}
                      disabled={index === userOrder.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {isChecking && (
                  <div className="w-6 flex-shrink-0">
                    {correctItems.includes(item.id) ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <span className="text-sm text-red-600 font-medium">{item.order}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6">
        {isChecking ? (
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetGame} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
            {incorrectItems.length === 0 ? (
              <Button onClick={() => setIsComplete(true)} className="flex-1">
                Hoàn thành
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setIsChecking(false);
                  setCorrectItems([]);
                  setIncorrectItems([]);
                }} 
                className="flex-1"
              >
                Tiếp tục chỉnh sửa
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={checkOrder} className="w-full">
            <Check className="mr-2 h-4 w-4" />
            Kiểm tra thứ tự
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderingTemplate;

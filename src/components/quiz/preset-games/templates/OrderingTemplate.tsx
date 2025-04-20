import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, ArrowUp, ArrowDown, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import GameWrapper from './GameWrapper';

interface OrderingTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  gameId?: string;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({ data, content, topic, onBack, gameId }) => {
  const gameContent = content || data;
  
  const [currentSet, setCurrentSet] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timePerSet || 60);
  const [totalTimeLeft, setTotalTimeLeft] = useState(gameContent?.settings?.totalTime || 300);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const sets = gameContent?.sets || [];
  const isLastSet = currentSet === sets.length - 1;

  useEffect(() => {
    if (!gameStarted && sets.length > 0) {
      setGameStarted(true);
      
      const setTime = gameContent?.settings?.timePerSet || 60;
      const totalTime = gameContent?.settings?.totalTime || (sets.length * setTime);
      
      setTimeLeft(setTime);
      setTotalTimeLeft(totalTime);
      
      initializeCurrentSet();
    }
  }, [gameContent, sets, gameStarted]);

  useEffect(() => {
    if (gameStarted && sets.length > 0) {
      initializeCurrentSet();
    }
  }, [currentSet, sets, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && gameStarted && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !isAnswered) {
      handleCheck();
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không sắp xếp kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameStarted, isAnswered]);

  useEffect(() => {
    if (totalTimeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (totalTimeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
      
      toast({
        title: "Trò chơi kết thúc",
        description: "Đã hết thời gian. Hãy xem kết quả của bạn.",
        variant: "destructive",
      });
    }
  }, [totalTimeLeft, gameStarted, showResult]);

  const initializeCurrentSet = () => {
    if (sets.length > 0 && currentSet < sets.length) {
      const set = sets[currentSet];
      setCorrectOrder(set.correctOrder);
      
      // Tạo mảng items sắp xếp ngẫu nhiên từ correct order
      const randomizedItems = [...set.correctOrder].sort(() => Math.random() - 0.5);
      setItems(randomizedItems);
      
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || isAnswered) return;
    
    const newItems = [...items];
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);
    
    setItems(newItems);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || isAnswered) return;
    
    const newItems = [...items];
    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    setItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1 || isAnswered) return;
    
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
  };

  const handleCheck = () => {
    setIsAnswered(true);
    
    const isSequenceCorrect = items.every((item, index) => item === correctOrder[index]);
    setIsCorrect(isSequenceCorrect);
    
    if (isSequenceCorrect) {
      setScore(score + 1);
      
      if (gameContent?.settings?.bonusTimePerCorrect) {
        const bonusTime = gameContent.settings.bonusTimePerCorrect;
        setTotalTimeLeft(prev => prev + bonusTime);
        
        toast({
          title: "Chính xác! +1 điểm",
          description: `Thứ tự đúng! +${bonusTime}s thời gian thưởng.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Chính xác! +1 điểm",
          description: "Bạn đã sắp xếp đúng thứ tự.",
          variant: "default",
        });
      }
    } else {
      toast({
        title: "Chưa chính xác!",
        description: "Thứ tự sắp xếp chưa đúng.",
        variant: "destructive",
      });
    }
  };

  const handleNextSet = () => {
    if (isLastSet) {
      setShowResult(true);
    } else {
      setCurrentSet(currentSet + 1);
      setTimeLeft(gameContent?.settings?.timePerSet || 60);
    }
  };

  const handleRestart = () => {
    setCurrentSet(0);
    setScore(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowResult(false);
    setTimeLeft(gameContent?.settings?.timePerSet || 60);
    setTotalTimeLeft(gameContent?.settings?.totalTime || 300);
    setGameStarted(true);
  };

  if (!gameContent || !sets.length) {
    return <div className="p-4">Không có dữ liệu cho trò chơi</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / sets.length) * 100);
    
    return (
      <GameWrapper
        onBack={onBack}
        progress={100}
        timeLeft={totalTimeLeft}
        score={score}
        currentItem={sets.length}
        totalItems={sets.length}
        title="Kết quả"
        gameId={gameId}
      >
        <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
            <p className="text-lg mb-4">
              Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
            </p>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Điểm của bạn</span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            
            <div className="text-4xl font-bold mb-6 text-primary">
              {score} / {sets.length}
            </div>
            
            <Button onClick={handleRestart} className="mt-4">
              <Repeat className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </div>
        </Card>
      </GameWrapper>
    );
  }

  const set = sets[currentSet];
  const progress = ((currentSet + 1) / sets.length) * 100;

  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={score}
      currentItem={currentSet + 1}
      totalItems={sets.length}
      title={gameContent.title || "Sắp xếp thứ tự"}
      gameId={gameId}
    >
      <Card className="flex-grow p-6 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
        <h2 className="text-xl font-semibold mb-6 text-primary">{set.instruction || 'Sắp xếp các mục dưới đây theo thứ tự đúng'}</h2>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3 mb-6"
              >
                {items.map((item, index) => (
                  <Draggable 
                    key={item} 
                    draggableId={item} 
                    index={index}
                    isDragDisabled={isAnswered}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 rounded-lg border ${
                          isAnswered 
                            ? item === correctOrder[index]
                              ? 'bg-green-100 border-green-500 shadow-md'
                              : 'bg-red-100 border-red-500 shadow-md'
                            : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                        } relative transition-all duration-200`}
                      >
                        <div className="flex items-center">
                          <div className="flex-grow font-medium">
                            {item}
                          </div>
                          
                          {!isAnswered && (
                            <div className="flex items-center ml-2">
                              <button 
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30"
                              >
                                <ArrowUp className="h-5 w-5 text-gray-600" />
                              </button>
                              <button 
                                onClick={() => handleMoveDown(index)}
                                disabled={index === items.length - 1}
                                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30"
                              >
                                <ArrowDown className="h-5 w-5 text-gray-600" />
                              </button>
                            </div>
                          )}
                          
                          {isAnswered && (
                            item === correctOrder[index] ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <div className="flex justify-center mt-6 space-x-4">
          {!isAnswered ? (
            <Button onClick={handleCheck}>
              Kiểm tra
            </Button>
          ) : (
            <Button onClick={handleNextSet} className="bg-primary hover:bg-primary/90">
              {isLastSet ? 'Xem kết quả' : 'Tiếp tục'}
            </Button>
          )}
        </div>
      </Card>
    </GameWrapper>
  );
};

export default OrderingTemplate;

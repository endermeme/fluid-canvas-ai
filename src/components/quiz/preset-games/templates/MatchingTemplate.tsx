import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Repeat } from 'lucide-react';
import GameWrapper from './GameWrapper';

interface MatchingTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  gameId?: string;
}

interface MatchingItem {
  id: string;
  content: string;
  matched: boolean;
}

interface MatchingPair {
  leftId: string;
  rightId: string;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ data, content, topic, onBack, gameId }) => {
  const gameContent = content || data;
  
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<MatchingPair[]>([]);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timeLimit || 180);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!gameStarted && gameContent?.pairs) {
      setGameStarted(true);
      initializeGame();
    }
  }, [gameContent, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
      
      toast({
        title: "Hết thời gian!",
        description: "Đã hết thời gian. Hãy xem kết quả của bạn.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameStarted, showResult, toast]);

  const initializeGame = () => {
    const pairs = gameContent?.pairs || [];
    
    // Tạo các items bên trái và phải
    const left: MatchingItem[] = [];
    const right: MatchingItem[] = [];
    
    pairs.forEach((pair: any, index: number) => {
      left.push({
        id: `left-${index}`,
        content: pair.left,
        matched: false
      });
      
      right.push({
        id: `right-${index}`,
        content: pair.right,
        matched: false
      });
    });
    
    // Xáo trộn items bên phải
    const shuffledRight = [...right].sort(() => Math.random() - 0.5);
    
    setLeftItems(left);
    setRightItems(shuffledRight);
    setMatchedPairs([]);
    setScore(0);
    setTimeLeft(gameContent?.settings?.timeLimit || 180);
    setShowResult(false);
  };

  const handleDragStart = (start: any) => {
    setDraggingItem(start.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggingItem(null);
    
    if (!result.destination || isChecking) {
      return;
    }
    
    const { source, destination, draggableId } = result;
    
    // Nếu kéo trong cùng một cột
    if (source.droppableId === destination.droppableId) {
      // Xử lý việc sắp xếp lại trong cùng một cột
      if (source.droppableId === 'left') {
        const reordered = reorderItems(leftItems, source.index, destination.index);
        setLeftItems(reordered);
      } else {
        const reordered = reorderItems(rightItems, source.index, destination.index);
        setRightItems(reordered);
      }
    } 
    // Nếu kéo từ cột phải sang cột trái (không cho phép)
    else if (source.droppableId === 'right' && destination.droppableId === 'left') {
      return;
    } 
    // Nếu kéo từ cột trái sang cột phải (tạo matching)
    else if (source.droppableId === 'left' && destination.droppableId === 'right') {
      const leftId = draggableId;
      const rightId = rightItems[destination.index].id;
      
      // Kiểm tra xem leftId đã được match với một rightId khác chưa
      const existingPairIndex = matchedPairs.findIndex(pair => pair.leftId === leftId);
      
      if (existingPairIndex !== -1) {
        // Nếu đã matched, xóa matching cũ và thêm matching mới
        const updatedPairs = [...matchedPairs];
        updatedPairs[existingPairIndex] = { leftId, rightId };
        setMatchedPairs(updatedPairs);
      } else {
        // Nếu chưa matched, thêm matching mới
        setMatchedPairs([...matchedPairs, { leftId, rightId }]);
      }
      
      // Cập nhật trạng thái matched cho các items
      updateMatchedStatus(leftId, rightId);
    }
  };

  const reorderItems = (list: MatchingItem[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const updateMatchedStatus = (leftId: string, rightId: string) => {
    setLeftItems(leftItems.map(item => 
      item.id === leftId ? { ...item, matched: true } : item
    ));
    
    setRightItems(rightItems.map(item => 
      item.id === rightId ? { ...item, matched: true } : item
    ));
  };

  const handleCheck = () => {
    if (matchedPairs.length < gameContent?.pairs?.length) {
      toast({
        title: "Chưa hoàn thành",
        description: "Bạn cần ghép tất cả các cặp trước khi kiểm tra.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChecking(true);
    
    // Kiểm tra các matching
    let correctCount = 0;
    const pairs = gameContent?.pairs || [];
    
    matchedPairs.forEach(pair => {
      const leftIndex = parseInt(pair.leftId.split('-')[1]);
      const rightIndex = parseInt(pair.rightId.split('-')[1]);
      
      if (leftIndex === rightIndex) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    
    // Hiển thị kết quả
    setTimeout(() => {
      setShowResult(true);
      
      if (correctCount === pairs.length) {
        toast({
          title: "Tuyệt vời!",
          description: "Bạn đã ghép đúng tất cả các cặp.",
          variant: "default",
        });
      } else {
        toast({
          title: "Kết quả",
          description: `Bạn đã ghép đúng ${correctCount} trong số ${pairs.length} cặp.`,
          variant: "default",
        });
      }
    }, 1000);
  };

  const handleRestart = () => {
    initializeGame();
    setIsChecking(false);
    setGameStarted(true);
  };

  const getItemStyle = (isDragging: boolean, isMatched: boolean, isChecking: boolean, isCorrect?: boolean) => {
    if (isChecking) {
      if (isCorrect === true) {
        return "bg-green-100 border-green-500 border shadow-md";
      } else if (isCorrect === false) {
        return "bg-red-100 border-red-500 border shadow-md";
      }
    }
    
    if (isDragging) {
      return "bg-blue-100 border-blue-500 border shadow-lg";
    }
    
    if (isMatched) {
      return "bg-secondary/30 border-secondary/50 border shadow-md";
    }
    
    return "bg-white border-gray-200 border hover:shadow-md";
  };

  if (!gameContent || !gameContent.pairs) {
    return <div className="p-4">Không có dữ liệu cho trò chơi</div>;
  }

  const totalPairs = gameContent.pairs.length;
  const progress = (matchedPairs.length / totalPairs) * 100;

  if (showResult) {
    const percentage = Math.round((score / totalPairs) * 100);
    
    return (
      <GameWrapper
        onBack={onBack}
        progress={100}
        timeLeft={timeLeft}
        score={score}
        currentItem={matchedPairs.length}
        totalItems={totalPairs}
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
                <span>Độ chính xác</span>
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
              {score} / {totalPairs}
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

  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={score}
      currentItem={matchedPairs.length}
      totalItems={totalPairs}
      title={gameContent.title || "Matching Game"}
      gameId={gameId}
    >
      <Card className="flex-grow p-6 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
        <h2 className="text-xl font-semibold mb-6 text-primary">Ghép các khái niệm tương ứng</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* Left column */}
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-medium mb-2 text-primary/80">Khái niệm</h3>
              <Droppable droppableId="left">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 min-h-[300px]"
                  >
                    {leftItems.map((item, index) => {
                      const pair = matchedPairs.find(p => p.leftId === item.id);
                      const rightIndex = pair ? parseInt(pair.rightId.split('-')[1]) : -1;
                      const isCorrect = isChecking ? rightIndex === parseInt(item.id.split('-')[1]) : undefined;
                      
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={isChecking || item.matched}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 rounded-lg transition-all duration-200 ${
                                getItemStyle(snapshot.isDragging, item.matched, isChecking, isCorrect)
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="flex-grow font-medium">
                                  {item.content}
                                </div>
                                
                                {isChecking && (
                                  isCorrect ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            
            {/* Right column */}
            <div className="w-full md:w-1/2 mt-6 md:mt-0">
              <h3 className="text-lg font-medium mb-2 text-primary/80">Định nghĩa</h3>
              <Droppable droppableId="right">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 min-h-[300px] ${draggingItem?.startsWith('left-') ? 'bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-3' : ''}`}
                  >
                    {rightItems.map((item, index) => {
                      const pair = matchedPairs.find(p => p.rightId === item.id);
                      const leftIndex = pair ? parseInt(pair.leftId.split('-')[1]) : -1;
                      const rightIndex = parseInt(item.id.split('-')[1]);
                      const isCorrect = isChecking ? leftIndex === rightIndex : undefined;
                      
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={true}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 rounded-lg transition-all duration-200 ${
                                getItemStyle(snapshot.isDragging, item.matched, isChecking, isCorrect)
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="flex-grow font-medium">
                                  {item.content}
                                </div>
                                
                                {isChecking && (
                                  isCorrect ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleCheck} 
            disabled={matchedPairs.length < gameContent?.pairs?.length || isChecking}
            className={matchedPairs.length < gameContent?.pairs?.length ? 'opacity-50' : ''}
          >
            Kiểm tra
          </Button>
        </div>
      </Card>
    </GameWrapper>
  );
};

export default MatchingTemplate;

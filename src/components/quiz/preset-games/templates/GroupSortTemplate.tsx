import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FolderOpen, Clock, Check, RefreshCw, AlertCircle, Trophy } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface GroupSortProps {
  content: any;
  topic: string;
}

const GroupSortTemplate: React.FC<GroupSortProps> = ({ content, topic }) => {
  const { toast } = useToast();
  
  // Xử lý dữ liệu mẫu nếu không có content
  const gameData = content || {
    categories: ['Danh từ', 'Động từ', 'Tính từ'],
    items: [
      { id: 'item1', text: 'chạy', category: 'Động từ' },
      { id: 'item2', text: 'đẹp', category: 'Tính từ' },
      { id: 'item3', text: 'nhà', category: 'Danh từ' },
      { id: 'item4', text: 'xe', category: 'Danh từ' },
      { id: 'item5', text: 'nhanh', category: 'Tính từ' },
      { id: 'item6', text: 'ngủ', category: 'Động từ' },
      { id: 'item7', text: 'cao', category: 'Tính từ' },
      { id: 'item8', text: 'học', category: 'Động từ' },
      { id: 'item9', text: 'sách', category: 'Danh từ' }
    ],
    settings: {
      timeLimit: 120,
      showFeedbackImmediately: true
    }
  };

  const timeLimit = gameData.settings?.timeLimit || 120;
  const categories = gameData.categories || [];
  const allItems = gameData.items || [];

  // State
  const [items, setItems] = useState<{[key: string]: Array<any>}>({});
  const [itemsBank, setItemsBank] = useState<Array<any>>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [results, setResults] = useState<{[key: string]: boolean}>({});
  
  // Khởi tạo trạng thái ban đầu
  useEffect(() => {
    const initialGroups: {[key: string]: Array<any>} = {};
    categories.forEach(category => {
      initialGroups[category] = [];
    });
    
    setItems(initialGroups);
    setItemsBank([...allItems]);
  }, [categories, allItems]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      handleCheckAnswers();
    }
  }, [timeLeft, gameCompleted]);

  // Xử lý kéo thả
  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    
    // Bỏ qua nếu kéo ra ngoài container
    if (!destination) return;
    
    // Lấy item được kéo
    let itemToMove;
    
    // Kéo từ ngân hàng từ
    if (source.droppableId === 'items-bank') {
      itemToMove = itemsBank[source.index];
      // Tạo bản sao mảng và loại bỏ item đã kéo
      const newItemsBank = [...itemsBank];
      newItemsBank.splice(source.index, 1);
      setItemsBank(newItemsBank);
    } 
    // Kéo từ nhóm khác
    else {
      itemToMove = items[source.droppableId][source.index];
      // Tạo bản sao mảng items và loại bỏ item đã kéo
      const newItems = {...items};
      newItems[source.droppableId] = [...items[source.droppableId]];
      newItems[source.droppableId].splice(source.index, 1);
      setItems(newItems);
    }
    
    // Thêm item vào nhóm đích
    setItems(prevItems => ({
      ...prevItems,
      [destination.droppableId]: [
        ...prevItems[destination.droppableId].slice(0, destination.index),
        itemToMove,
        ...prevItems[destination.droppableId].slice(destination.index)
      ]
    }));
  }, [itemsBank, items]);

  // Kiểm tra đáp án
  const handleCheckAnswers = () => {
    setIsChecking(true);
    
    let correctCount = 0;
    const results: {[key: string]: boolean} = {};
    
    // Kiểm tra từng item trong mỗi nhóm
    Object.entries(items).forEach(([category, categoryItems]) => {
      categoryItems.forEach(item => {
        const isCorrect = item.category === category;
        results[item.id] = isCorrect;
        if (isCorrect) correctCount++;
      });
    });
    
    const totalItems = Object.values(items).flat().length;
    const scorePercent = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;
    
    setResults(results);
    setScore(scorePercent);
    setGameCompleted(true);
    
    if (scorePercent >= 80) {
      toast({
        title: 'Tuyệt vời!',
        description: `Bạn đã phân loại đúng ${correctCount}/${totalItems} từ (${scorePercent}%)`,
        variant: 'default',
      });
    } else {
      toast({
        title: 'Cố gắng hơn nữa!',
        description: `Bạn đã phân loại đúng ${correctCount}/${totalItems} từ (${scorePercent}%)`,
        variant: 'destructive',
      });
    }
  };

  // Reset game
  const resetGame = () => {
    const initialGroups: {[key: string]: Array<any>} = {};
    categories.forEach(category => {
      initialGroups[category] = [];
    });
    
    setItems(initialGroups);
    setItemsBank([...allItems]);
    setIsChecking(false);
    setGameCompleted(false);
    setScore(0);
    setTimeLeft(timeLimit);
    setResults({});
  };

  // Render từng item
  const renderItem = (item: any, index: number, isDragging: boolean, provided: any) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`
        p-2 mb-2 rounded-md shadow-sm text-center
        ${isDragging ? 'bg-blue-100' : 'bg-white'}
        ${gameCompleted && results[item.id] === false ? 'border-2 border-red-500' : ''}
        ${gameCompleted && results[item.id] === true ? 'border-2 border-green-500' : ''}
      `}
    >
      <span className="font-medium">{item.text}</span>
      {gameCompleted && (
        <div className="mt-1">
          {results[item.id] ? (
            <Check className="h-4 w-4 text-green-500 inline" />
          ) : (
            <span className="text-xs text-red-500 block">
              ({item.category})
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Tính phần trăm hoàn thành (items đã phân loại / tổng số items)
  const completionPercent = Math.round(((allItems.length - itemsBank.length) / allItems.length) * 100);
  
  // Render kết quả
  if (gameCompleted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-4 w-full mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <FolderOpen className="h-6 w-6 mr-2 text-blue-500" />
            <h2 className="text-xl font-bold">Phân Loại Nhóm: {topic}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-blue-700">{score}%</span>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {categories.map(category => (
            <Card key={category} className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-center border-b pb-2">
                {category}
              </h3>
              <div className="min-h-[200px]">
                {items[category]?.map((item: any, index: number) => (
                  <div 
                    key={item.id}
                    className={`
                      p-2 mb-2 rounded-md shadow-sm text-center
                      ${results[item.id] ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}
                    `}
                  >
                    <span className="font-medium">{item.text}</span>
                    {!results[item.id] && (
                      <div className="text-xs text-red-500 mt-1">
                        Đúng: {item.category}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] p-6">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <FolderOpen className="h-6 w-6 mr-2 text-blue-500" />
          <h2 className="text-xl font-bold">Phân Loại Nhóm: {topic}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className={`font-medium ${timeLeft < 30 ? 'text-red-500' : 'text-blue-500'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </Card>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span>Tiến độ:</span>
          <span>{completionPercent}%</span>
        </div>
        <Progress value={completionPercent} className="h-2" />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {categories.map(category => (
            <Droppable key={category} droppableId={category}>
              {(provided, snapshot) => (
                <Card 
                  className={`p-4 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="text-lg font-semibold mb-2 text-center border-b pb-2">
                    {category}
                  </h3>
                  <div className="min-h-[200px]">
                    {items[category]?.map((item: any, index: number) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={isChecking}
                      >
                        {(provided, snapshot) => renderItem(item, index, snapshot.isDragging, provided)}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </Card>
              )}
            </Droppable>
          ))}
        </div>

        <Card className="p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2 text-center border-b pb-2">
            Các từ cần phân loại
          </h3>
          <Droppable droppableId="items-bank" direction="horizontal">
            {(provided, snapshot) => (
              <div 
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[60px] flex flex-wrap gap-2 p-2 ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
              >
                {itemsBank.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={isChecking}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                          p-2 rounded-md shadow-sm inline-block
                          ${snapshot.isDragging ? 'bg-blue-100' : 'bg-white'}
                        `}
                      >
                        {item.text}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Card>

        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleCheckAnswers} 
            disabled={itemsBank.length > 0 || isChecking}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Kiểm tra
          </Button>
        </div>
      </DragDropContext>

      {itemsBank.length === 0 && !isChecking && (
        <Card className="p-4 mt-4 bg-yellow-50 text-yellow-800 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Đã phân loại hết các từ! Bấm "Kiểm tra" để xem kết quả.</span>
        </Card>
      )}
    </div>
  );
};

export default GroupSortTemplate;

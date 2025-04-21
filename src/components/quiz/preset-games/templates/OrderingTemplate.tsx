import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronsUpDown } from 'lucide-react';
import GameWrapper from './GameWrapper';

interface OrderingItem {
  id: string;
  content: string;
  correctOrder?: number;
}

interface OrderingTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  gameId?: string;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({
  data,
  content,
  topic,
  onBack,
  gameId,
}) => {
  const [orderingItems, setOrderingItems] = useState<OrderingItem[]>([]);
  const [shuffledItems, setShuffledItems] = useState<OrderingItem[]>([]);
  const [isCorrectOrder, setIsCorrectOrder] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Xử lý dữ liệu: luôn setLoading(true)
    setLoading(true);
    setError(null);

    try {
      let items = [];
      if (content?.items?.length) {
        items = content.items;
      } else if (data?.items?.length) {
        items = data.items;
      } else if (data && Array.isArray(data) && data.length > 0) {
        items = data;
      }

      // Fix mapping dữ liệu từ API (đảm bảo items hợp lệ)
      if (!items || !Array.isArray(items) || items.length === 0) {
        setError("Không có dữ liệu cho trò chơi.");
      } else {
        setOrderingItems(items.map((it, idx) => ({ ...it, id: it.id ?? idx })));
        setError(null);
      }
    } catch (err) {
      setError("Dữ liệu trò chơi không hợp lệ!");
    }
    setLoading(false);
  }, [data, content]);

  useEffect(() => {
    // Shuffle items sau khi có dữ liệu
    if (orderingItems.length > 0) {
      shuffleItems(orderingItems);
    }
  }, [orderingItems]);

  const shuffleItems = (array: OrderingItem[]) => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setIsCorrectOrder(false);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(shuffledItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setShuffledItems(items);
    setIsCorrectOrder(false);
  };

  const checkOrder = () => {
    const correct = shuffledItems.every((item, index) => {
      const originalIndex = orderingItems.findIndex(
        (originalItem) => originalItem.id === item.id
      );
      return originalIndex === index;
    });
    setIsCorrectOrder(correct);
    setShowAnswer(true);
  };

  const resetGame = () => {
    shuffleItems(orderingItems);
    setIsCorrectOrder(false);
    setShowAnswer(false);
  };

  if (loading) {
    return (
      <GameWrapper
        title="Sắp xếp"
        gameId={gameId}
        onBack={onBack}
      >
        <div className="text-center py-8 text-lg text-gray-500">Đang tải trò chơi...</div>
      </GameWrapper>
    )
  }

  if (error) {
    return (
      <GameWrapper
        title="Sắp xếp"
        gameId={gameId}
        onBack={onBack}
      >
        <div className="text-center py-8 text-red-500">
          {error}<br />
          <span className="text-sm text-gray-400">Bạn vui lòng chọn topic hoặc thử lại!</span>
        </div>
      </GameWrapper>
    )
  }

  return (
    <GameWrapper
      title={topic || "Sắp xếp"}
      gameId={gameId}
      onBack={onBack}
    >
      <div className="flex flex-col h-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="orderingList">
            {(provided) => (
              <Card
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-grow overflow-auto mb-4"
              >
                <CardContent className="p-4">
                  {shuffledItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-secondary/50 dark:bg-secondary/40 rounded-md p-3 mb-2 last:mb-0 shadow-sm cursor-move flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">{item.content}</span>
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-between">
          <Button onClick={checkOrder}>
            Kiểm tra
          </Button>
          <Button onClick={resetGame} variant="outline">
            Xáo trộn
          </Button>
        </div>

        {showAnswer && (
          <div className="mt-4 p-4 rounded-md bg-muted/50">
            {isCorrectOrder ? (
              <div className="text-green-500 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Đúng rồi!
              </div>
            ) : (
              <div className="text-red-500">Thứ tự chưa đúng, thử lại nhé!</div>
            )}
          </div>
        )}
      </div>
    </GameWrapper>
  );
};
export default OrderingTemplate;

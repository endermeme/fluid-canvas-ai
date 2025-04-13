import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, ArrowLeft, ArrowDown, ArrowUp, Trophy, Check, X, Share2 } from 'lucide-react';
import { saveGameForSharing } from '@/utils/gameExport';

interface OrderingTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface OrderingItem {
  id: number;
  content: string;
  correctPosition: number;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({ content, topic, onBack }) => {
  const [items, setItems] = useState<OrderingItem[]>([]);
  const [shuffledItems, setShuffledItems] = useState<number[]>([]);
  const [isCorrectOrder, setIsCorrectOrder] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (content?.items) {
      const initialItems = content.items.map((item: any, index: number) => ({
        id: index,
        content: item.content,
        correctPosition: item.correctPosition
      }));
      setItems(initialItems);
      
      const initialShuffledItems = Array.from({ length: content.items.length }, (_, i) => i);
      shuffleArray(initialShuffledItems);
      setShuffledItems(initialShuffledItems);
    }
  }, [content]);

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const moveItemUp = (index: number) => {
    if (index > 0) {
      const newShuffledItems = [...shuffledItems];
      [newShuffledItems[index], newShuffledItems[index - 1]] = [newShuffledItems[index - 1], newShuffledItems[index]];
      setShuffledItems(newShuffledItems);
      setIsCorrectOrder(null);
    }
  };

  const moveItemDown = (index: number) => {
    if (index < shuffledItems.length - 1) {
      const newShuffledItems = [...shuffledItems];
      [newShuffledItems[index], newShuffledItems[index + 1]] = [newShuffledItems[index + 1], newShuffledItems[index]];
      setShuffledItems(newShuffledItems);
      setIsCorrectOrder(null);
    }
  };

  const checkOrder = () => {
    const correct = shuffledItems.every((itemIndex, currentIndex) => {
      const item = items[itemIndex];
      return item.correctPosition === currentIndex + 1;
    });

    setIsCorrectOrder(correct);

    if (correct) {
      toast({
        title: "Chúc mừng!",
        description: "Bạn đã sắp xếp đúng thứ tự.",
        variant: "default",
      });
    } else {
      toast({
        title: "Thứ tự chưa đúng",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const restartGame = () => {
    if (content?.items) {
      const initialShuffledItems = Array.from({ length: content.items.length }, (_, i) => i);
      shuffleArray(initialShuffledItems);
      setShuffledItems(initialShuffledItems);
      setIsCorrectOrder(null);
    }
  };

  const handleShare = async () => {
    try {
      const gameContent = `
        <html>
        <head>
          <title>${content.title || "Trò chơi sắp xếp thứ tự"}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f9f9ff; }
            .container { max-width: 800px; margin: 0 auto; }
            .game-title { text-align: center; margin-bottom: 20px; }
            .instructions { text-align: center; margin-bottom: 20px; color: #666; }
            .item-list { margin-bottom: 20px; }
            .item { display: flex; align-items: center; justify-content: space-between; padding: 12px; margin-bottom: 8px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .item-content { flex: 1; }
            .item-controls { display: flex; gap: 4px; }
            .button { padding: 8px 16px; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .button:hover { background: #f0f0f0; }
            .arrow-button { padding: 8px; background: #f0f0f8; border: none; border-radius: 4px; cursor: pointer; }
            .arrow-button:hover { background: #e0e0f0; }
            .arrow-button:disabled { opacity: 0.5; cursor: not-allowed; }
            .footer { margin-top: 20px; text-align: center; }
            .check-button { width: 100%; padding: 12px; background: linear-gradient(to right, #6366f1, #818cf8); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 20px; }
            .check-button:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="game-title">${content.title || topic}</h2>
            
            <p class="instructions">${content.instructions || "Sắp xếp các mục dưới đây theo thứ tự đúng."}</p>
            
            <div class="item-list" id="item-list">
              ${content.items.map((item: any, index: number) => `
                <div class="item" data-original-order="${item.correctPosition}" data-id="${index}">
                  <div class="item-content">${item.content}</div>
                  <div class="item-controls">
                    <button class="arrow-button move-up" ${index === 0 ? 'disabled' : ''}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </button>
                    <button class="arrow-button move-down" ${index === content.items.length - 1 ? 'disabled' : ''}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <button class="check-button" id="check-button">Kiểm tra thứ tự</button>
            
            <div class="footer">
              <div>Trò chơi sắp xếp thứ tự - Chia sẻ bởi QuizWhiz</div>
            </div>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const itemList = document.getElementById('item-list');
              const items = itemList.querySelectorAll('.item');
              const checkButton = document.getElementById('check-button');
              
              // Thiết lập các nút di chuyển
              items.forEach((item, index) => {
                const upButton = item.querySelector('.move-up');
                const downButton = item.querySelector('.move-down');
                
                upButton.addEventListener('click', function() {
                  if (index > 0) {
                    itemList.insertBefore(item, items[index - 1]);
                    updateButtonStates();
                  }
                });
                
                downButton.addEventListener('click', function() {
                  if (index < items.length - 1) {
                    itemList.insertBefore(items[index + 1], item);
                    updateButtonStates();
                  }
                });
              });
              
              // Cập nhật trạng thái nút
              function updateButtonStates() {
                const updatedItems = itemList.querySelectorAll('.item');
                
                updatedItems.forEach((item, idx) => {
                  const upBtn = item.querySelector('.move-up');
                  const downBtn = item.querySelector('.move-down');
                  
                  upBtn.disabled = idx === 0;
                  downBtn.disabled = idx === updatedItems.length - 1;
                });
              }
              
              // Kiểm tra thứ tự
              checkButton.addEventListener('click', function() {
                const currentItems = itemList.querySelectorAll('.item');
                let allCorrect = true;
                
                currentItems.forEach((item, idx) => {
                  const correctPos = parseInt(item.dataset.originalOrder);
                  
                  if (correctPos !== idx + 1) {
                    allCorrect = false;
                    item.style.background = '#fee2e2';
                    item.style.borderLeft = '3px solid #ef4444';
                  } else {
                    item.style.background = '#dcfce7';
                    item.style.borderLeft = '3px solid #22c55e';
                  }
                });
                
                if (allCorrect) {
                  alert('Chúc mừng! Bạn đã sắp xếp đúng thứ tự.');
                } else {
                  alert('Có vẻ như có một số mục chưa đúng vị trí. Hãy thử lại!');
                }
              });
            });
          </script>
        </body>
        </html>
      `;
      
      const shareUrl = await saveGameForSharing(
        content.title || "Trò chơi sắp xếp thứ tự", 
        topic, 
        gameContent
      );
      
      if (shareUrl) {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link chia sẻ đã được sao chép",
          description: "Đã sao chép liên kết vào clipboard. Link có hiệu lực trong 48 giờ.",
        });
      } else {
        throw new Error("Không thể tạo URL chia sẻ");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  if (!content || !content.items) {
    return <div className="p-4">Không có dữ liệu trò chơi sắp xếp thứ tự</div>;
  }

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="relative">
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="absolute top-0 left-0 z-10 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
        )}
        
        <div className="text-center mt-12">
          <h2 className="text-xl font-semibold mb-4">{content.title || topic}</h2>
          <p className="text-muted-foreground">{content.instructions || "Sắp xếp các mục dưới đây theo thứ tự đúng."}</p>
        </div>
      </div>

      <Card className="p-4 flex-grow flex flex-col">
        <ul className="space-y-2 flex-grow">
          {shuffledItems.map((itemIndex, index) => {
            const item = items[itemIndex];
            return (
              <li key={item.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                <span className="flex-grow">{item.content}</span>
                <div className="flex flex-col">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => moveItemUp(index)} 
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => moveItemDown(index)} 
                    disabled={index === shuffledItems.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4">
          <Button onClick={checkOrder} className="w-full">
            Kiểm tra Thứ Tự
          </Button>
          {isCorrectOrder !== null && (
            <div className={`mt-2 p-2 rounded-md text-center ${isCorrectOrder ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isCorrectOrder ? 'Chúc mừng! Bạn đã sắp xếp đúng thứ tự.' : 'Thứ tự chưa đúng. Vui lòng thử lại.'}
            </div>
          )}
        </div>
      </Card>

      <div className="mt-4 flex justify-between">
        <Button variant="outline" onClick={restartGame}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm Lại
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Chia sẻ
        </Button>
      </div>
    </div>
  );
};

export default OrderingTemplate;

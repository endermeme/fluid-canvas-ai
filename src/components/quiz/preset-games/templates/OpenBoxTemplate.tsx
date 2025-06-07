
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Package, Gift, RefreshCw, Play } from 'lucide-react';

interface OpenBoxProps {
  content: any;
  topic: string;
}

interface Box {
  id: string;
  content: string;
  type: 'question' | 'reward' | 'challenge';
  points: number;
  opened: boolean;
}

const OpenBoxTemplate: React.FC<OpenBoxProps> = ({ content, topic }) => {
  const { toast } = useToast();
  
  // Data mẫu nếu không có content
  const defaultBoxes: Box[] = content?.boxes || [
    { id: '1', content: 'Câu hỏi: Thủ đô của Việt Nam?', type: 'question', points: 10, opened: false },
    { id: '2', content: 'Phần thưởng: Bonus 20 điểm!', type: 'reward', points: 20, opened: false },
    { id: '3', content: 'Thử thách: Nói tên 3 loại hoa', type: 'challenge', points: 15, opened: false },
    { id: '4', content: 'Câu hỏi: 2 + 2 = ?', type: 'question', points: 5, opened: false },
    { id: '5', content: 'Phần thưởng: Bonus 30 điểm!', type: 'reward', points: 30, opened: false },
    { id: '6', content: 'Thử thách: Hát 1 câu hát', type: 'challenge', points: 25, opened: false },
    { id: '7', content: 'Câu hỏi: Màu của lá cây?', type: 'question', points: 10, opened: false },
    { id: '8', content: 'Phần thưởng: Bonus 15 điểm!', type: 'reward', points: 15, opened: false },
    { id: '9', content: 'Thử thách: Đếm từ 1 đến 10', type: 'challenge', points: 20, opened: false }
  ];
  
  const [boxes, setBoxes] = useState<Box[]>(defaultBoxes);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const openBox = (boxId: string) => {
    const box = boxes.find(b => b.id === boxId);
    if (!box || box.opened) return;
    
    setBoxes(prev => prev.map(b => 
      b.id === boxId ? { ...b, opened: true } : b
    ));
    
    setScore(prev => prev + box.points);
    
    let toastMessage = '';
    let toastVariant: 'default' | 'destructive' = 'default';
    
    switch (box.type) {
      case 'question':
        toastMessage = `Câu hỏi: ${box.content}`;
        break;
      case 'reward':
        toastMessage = `Phần thưởng: +${box.points} điểm!`;
        break;
      case 'challenge':
        toastMessage = `Thử thách: ${box.content}`;
        break;
    }
    
    toast({
      title: 'Mở hộp thành công!',
      description: toastMessage,
      variant: toastVariant,
    });
    
    // Kiểm tra game hoàn thành
    const allOpened = boxes.every(b => b.opened || b.id === boxId);
    if (allOpened) {
      setGameCompleted(true);
      setTimeout(() => {
        toast({
          title: 'Hoàn thành!',
          description: `Bạn đã mở tất cả hộp! Tổng điểm: ${score + box.points}`,
          variant: 'default',
        });
      }, 500);
    }
  };
  
  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setBoxes(defaultBoxes.map(box => ({ ...box, opened: false })));
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const getBoxIcon = (type: string, opened: boolean) => {
    if (!opened) {
      return <Package className="h-8 w-8" />;
    }
    
    switch (type) {
      case 'reward':
        return <Gift className="h-8 w-8 text-yellow-500" />;
      default:
        return <Package className="h-8 w-8 text-blue-500" />;
    }
  };
  
  const getBoxColor = (type: string, opened: boolean) => {
    if (!opened) {
      return 'bg-gray-600 hover:bg-gray-500';
    }
    
    switch (type) {
      case 'question':
        return 'bg-blue-500';
      case 'reward':
        return 'bg-yellow-500';
      case 'challenge':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-6 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Mở Hộp Bí Ẩn: {topic}</h2>
          <p className="mb-6">Mở các hộp để khám phá câu hỏi, phần thưởng và thử thách</p>
          <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
            <Play className="mr-2 h-4 w-4" />
            Bắt đầu chơi
          </Button>
        </Card>
      </div>
    );
  }
  
  if (gameCompleted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-6 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Trò chơi hoàn thành!</h2>
          <p className="text-xl mb-4">Điểm của bạn: {score}</p>
          <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-[500px] p-6">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Mở Hộp Bí Ẩn: {topic}</h2>
        <div className="flex items-center gap-4">
          <span className="font-medium">Điểm: {score}</span>
          <span className="text-sm text-gray-500">
            Đã mở: {boxes.filter(b => b.opened).length}/{boxes.length}
          </span>
        </div>
      </Card>
      
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {boxes.map((box) => (
          <Card
            key={box.id}
            className={`p-6 cursor-pointer transition-all ${
              box.opened 
                ? getBoxColor(box.type, true) + ' text-white' 
                : getBoxColor(box.type, false) + ' hover:scale-105'
            }`}
            onClick={() => openBox(box.id)}
          >
            <div className="flex flex-col items-center text-center gap-3">
              {getBoxIcon(box.type, box.opened)}
              
              <div className="text-sm font-medium">
                Hộp {box.id}
              </div>
              
              {box.opened && (
                <div className="text-xs">
                  <div className="mb-1">{box.content}</div>
                  <div className="font-bold">+{box.points} điểm</div>
                </div>
              )}
              
              {!box.opened && (
                <div className="text-xs opacity-75">
                  Nhấp để mở
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button onClick={resetGame} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Chơi lại
        </Button>
      </div>
    </div>
  );
};

export default OpenBoxTemplate;

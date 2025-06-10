
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Package, Gift, RefreshCw, Play, Trophy, Target } from 'lucide-react';

interface OpenBoxProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface Box {
  id: string;
  content: string;
  type: 'question' | 'reward' | 'challenge';
  points: number;
  opened: boolean;
}

const OpenBoxTemplate: React.FC<OpenBoxProps> = ({ content, topic, onBack }) => {
  const { toast } = useToast();
  
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
    
    switch (box.type) {
      case 'question':
        toastMessage = `📝 Câu hỏi: ${box.content.replace('Câu hỏi: ', '')}`;
        break;
      case 'reward':
        toastMessage = `🎁 Phần thưởng: +${box.points} điểm!`;
        break;
      case 'challenge':
        toastMessage = `🎯 Thử thách: ${box.content.replace('Thử thách: ', '')}`;
        break;
    }
    
    toast({
      title: '📦 Mở hộp thành công!',
      description: toastMessage,
      variant: 'default',
    });
    
    const allOpened = boxes.every(b => b.opened || b.id === boxId);
    if (allOpened) {
      setGameCompleted(true);
      setTimeout(() => {
        toast({
          title: '🏆 Hoàn thành!',
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
      return <Package className="h-12 w-12 text-white" />;
    }
    
    switch (type) {
      case 'reward':
        return <Gift className="h-12 w-12 text-yellow-500" />;
      case 'question':
        return <Target className="h-12 w-12 text-blue-500" />;
      case 'challenge':
        return <Trophy className="h-12 w-12 text-purple-500" />;
      default:
        return <Package className="h-12 w-12 text-gray-500" />;
    }
  };
  
  const getBoxColor = (type: string, opened: boolean) => {
    if (!opened) {
      return 'bg-gradient-to-br from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600 transform hover:scale-105 shadow-lg hover:shadow-xl';
    }
    
    switch (type) {
      case 'question':
        return 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg';
      case 'reward':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg';
      case 'challenge':
        return 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg';
    }
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <div className="mb-8">
              <Package className="h-24 w-24 text-emerald-500 mx-auto mb-6 animate-bounce" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Mở Hộp Bí Ẩn
            </h2>
            <p className="text-xl text-gray-700 mb-2 font-medium">🎁 Chủ đề: {topic}</p>
            <p className="text-gray-600 mb-8 text-lg">Mở các hộp để khám phá câu hỏi, phần thưởng và thử thách</p>
            
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Package className="h-6 w-6 text-emerald-500" />
                  <span className="font-medium text-gray-700">{defaultBoxes.length} hộp bí ẩn</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Gift className="h-6 w-6 text-yellow-500" />
                  <span className="font-medium text-gray-700">Nhiều phần thưởng</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white text-xl font-bold py-6 rounded-2xl"
            >
              🎮 Bắt đầu khám phá
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  if (gameCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
            
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              🎉 Hoàn thành!
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
                <span className="text-gray-700 font-medium">Tổng điểm:</span>
                <span className="text-3xl font-bold text-yellow-600">{score}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <span className="text-gray-700 font-medium">Hộp đã mở:</span>
                <span className="text-xl font-semibold text-green-600">{boxes.filter(b => b.opened).length}/{boxes.length}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={resetGame} 
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Chơi lại
              </Button>
              {onBack && (
                <Button 
                  onClick={onBack} 
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 font-semibold py-3 rounded-xl"
                >
                  Quay lại
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl flex-shrink-0">
          <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Mở Hộp Bí Ẩn
              </h2>
              <p className="text-gray-600 text-lg font-medium">{topic}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="font-bold text-yellow-700 text-xl">{score} điểm</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                <Package className="h-6 w-6 text-emerald-500" />
                <span className="font-bold text-emerald-700 text-xl">
                  {boxes.filter(b => b.opened).length}/{boxes.length}
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-6 max-w-4xl w-full">
            {boxes.map((box) => (
              <Card
                key={box.id}
                className={`p-6 cursor-pointer transition-all duration-300 rounded-2xl ${
                  box.opened 
                    ? getBoxColor(box.type, true) + ' text-white' 
                    : getBoxColor(box.type, false) + ' text-white'
                } ${!box.opened ? 'hover:cursor-pointer' : 'cursor-default'}`}
                onClick={() => openBox(box.id)}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  {getBoxIcon(box.type, box.opened)}
                  
                  <div className="text-lg font-bold">
                    Hộp {box.id}
                  </div>
                  
                  {box.opened && (
                    <div className="text-sm">
                      <div className="mb-2 font-medium">{box.content}</div>
                      <div className="font-bold text-lg">+{box.points} điểm</div>
                    </div>
                  )}
                  
                  {!box.opened && (
                    <div className="text-sm opacity-90 font-medium">
                      Nhấp để mở
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-center flex-shrink-0">
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={resetGame} 
              variant="outline"
              className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Chơi lại
            </Button>
            {onBack && (
              <Button 
                onClick={onBack} 
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl"
              >
                Quay lại
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenBoxTemplate;

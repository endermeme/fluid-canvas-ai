
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  RefreshCw, 
  Gift,
  Star,
  ArrowLeft,
  Package,
  Zap,
  Target,
  HelpCircle
} from 'lucide-react';

interface OpenBoxProps {
  data: any;
  onBack: () => void;
  topic: string;
  content: any;
}

interface Box {
  id: string;
  content: string;
  type: 'question' | 'reward' | 'challenge';
  points: number;
  opened: boolean;
}

const OpenBoxTemplate: React.FC<OpenBoxProps> = ({ data, onBack, topic }) => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [lastOpened, setLastOpened] = useState<Box | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (data && data.boxes) {
      setBoxes(data.boxes.map((box: any) => ({ ...box, opened: false })));
    }
  }, [data]);

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🎁 Game bắt đầu!",
      description: "Chọn các hộp để mở và nhận phần thưởng!",
    });
  };

  const openBox = (boxId: string) => {
    const box = boxes.find(b => b.id === boxId);
    if (!box || box.opened) return;

    setBoxes(prev => prev.map(b => 
      b.id === boxId ? { ...b, opened: true } : b
    ));

    setLastOpened(box);
    setTotalScore(prev => prev + box.points);
    setOpenedCount(prev => prev + 1);

    const getToastByType = (type: string) => {
      switch (type) {
        case 'question':
          return { title: "❓ Câu hỏi!", description: `${box.content} (+${box.points} điểm)` };
        case 'reward':
          return { title: "🎁 Phần thưởng!", description: `${box.content} (+${box.points} điểm)` };
        case 'challenge':
          return { title: "⚡ Thử thách!", description: `${box.content} (+${box.points} điểm)` };
        default:
          return { title: "📦 Hộp đã mở!", description: `${box.content} (+${box.points} điểm)` };
      }
    };

    const toastData = getToastByType(box.type);
    toast(toastData);

    // Check if all boxes are opened
    if (openedCount + 1 === boxes.length) {
      setTimeout(() => {
        setGameCompleted(true);
        toast({
          title: "🎊 Hoàn thành!",
          description: `Bạn đã mở hết tất cả hộp! Tổng điểm: ${totalScore + box.points}`,
        });
      }, 1000);
    }
  };

  const resetGame = () => {
    setBoxes(data.boxes.map((box: any) => ({ ...box, opened: false })));
    setTotalScore(0);
    setOpenedCount(0);
    setGameStarted(false);
    setGameCompleted(false);
    setLastOpened(null);
  };

  const getBoxIcon = (type: string) => {
    switch (type) {
      case 'question': return <HelpCircle className="h-6 w-6" />;
      case 'reward': return <Gift className="h-6 w-6" />;
      case 'challenge': return <Zap className="h-6 w-6" />;
      default: return <Package className="h-6 w-6" />;
    }
  };

  const getBoxColor = (type: string) => {
    switch (type) {
      case 'question': return 'from-blue-400 to-blue-600';
      case 'reward': return 'from-green-400 to-green-600';
      case 'challenge': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Đang tải game...</h3>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Card className="m-4 p-4 bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                onClick={onBack}
                variant="ghost"
                className="mr-4 text-purple-700 hover:bg-purple-100"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl mr-4">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
                <p className="text-gray-600">
                  <span className="font-medium">{topic}</span> • 
                  <span className="ml-2 text-purple-600">{boxes.length} hộp bí ẩn</span>
                </p>
              </div>
            </div>
            
            {gameStarted && (
              <div className="flex items-center gap-4 text-lg font-medium">
                <div className="flex items-center text-purple-600">
                  <Target className="mr-2 h-5 w-5" />
                  {openedCount}/{boxes.length}
                </div>
                <div className="flex items-center text-pink-600">
                  <Star className="mr-2 h-5 w-5" />
                  {totalScore} điểm
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Game Content */}
        <div className="flex-1 p-4">
          {!gameStarted ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Package className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Mở Hộp Bí Ẩn</h3>
                  <p className="text-gray-600 mb-6">
                    Chọn các hộp để mở và khám phá những bất ngờ bên trong! Mỗi hộp chứa câu hỏi, phần thưởng hoặc thử thách.
                  </p>
                  <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Bắt Đầu Game
                  </Button>
                </div>
              </Card>
            </div>
          ) : gameCompleted ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Hoàn thành! Tổng điểm: {totalScore}
                  </h3>
                  <p className="text-gray-600">
                    Bạn đã mở thành công tất cả {boxes.length} hộp bí ẩn!
                  </p>
                </div>

                <div className="max-h-60 overflow-y-auto mb-6">
                  <h4 className="font-semibold mb-3 text-gray-700">Tóm tắt các hộp đã mở:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {boxes.filter(box => box.opened).map((box) => (
                      <div key={box.id} className={`p-3 rounded-lg bg-gradient-to-r ${getBoxColor(box.type)} text-white`}>
                        <div className="flex items-center mb-2">
                          {getBoxIcon(box.type)}
                          <span className="ml-2 font-medium capitalize">{box.type}</span>
                          <span className="ml-auto">+{box.points}</span>
                        </div>
                        <div className="text-sm opacity-90">{box.content}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetGame} variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Chơi lại
                  </Button>
                  <Button onClick={onBack} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Kết thúc
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">{openedCount}</div>
                    <div className="text-sm text-purple-600">Hộp đã mở</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-r from-pink-100 to-pink-200 border-pink-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-700">{totalScore}</div>
                    <div className="text-sm text-pink-600">Tổng điểm</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-r from-indigo-100 to-indigo-200 border-indigo-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-700">{boxes.length - openedCount}</div>
                    <div className="text-sm text-indigo-600">Hộp còn lại</div>
                  </div>
                </Card>
              </div>

              {/* Boxes Grid */}
              <div className="grid grid-cols-3 gap-6">
                {boxes.map((box, index) => (
                  <Card
                    key={box.id}
                    className={`aspect-square relative overflow-hidden cursor-pointer transition-all duration-300 ${
                      box.opened 
                        ? `bg-gradient-to-br ${getBoxColor(box.type)} text-white` 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-xl hover:scale-105'
                    }`}
                    onClick={() => openBox(box.id)}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      {box.opened ? (
                        <>
                          <div className="mb-3">
                            {getBoxIcon(box.type)}
                          </div>
                          <div className="text-xs text-center font-medium mb-2 capitalize">
                            {box.type}
                          </div>
                          <div className="text-xs text-center opacity-90 line-clamp-3">
                            {box.content}
                          </div>
                          <div className="mt-2 bg-white/20 px-2 py-1 rounded text-xs">
                            +{box.points} điểm
                          </div>
                        </>
                      ) : (
                        <>
                          <Package className="h-8 w-8 text-gray-600 mb-2" />
                          <div className="text-sm font-medium text-gray-700">Hộp #{index + 1}</div>
                          <div className="text-xs text-gray-500 mt-1">Nhấn để mở</div>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Last Opened Info */}
              {lastOpened && (
                <Card className="mt-6 p-4 bg-white/90 backdrop-blur-sm border-purple-200">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-700 mb-2">Hộp vừa mở:</h4>
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${getBoxColor(lastOpened.type)} text-white`}>
                      {getBoxIcon(lastOpened.type)}
                      <span className="ml-2 font-medium">{lastOpened.content}</span>
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded text-sm">+{lastOpened.points}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenBoxTemplate;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  RefreshCw, 
  Clock, 
  Target,
  CheckCircle2,
  XCircle,
  Users,
  ArrowLeft
} from 'lucide-react';

interface GroupSortProps {
  data: any;
  onBack: () => void;
  topic: string;
  content: any;
}

interface Item {
  id: string;
  text: string;
  group: string;
}

interface Group {
  id: string;
  name: string;
  items: Item[];
}

const GroupSortTemplate: React.FC<GroupSortProps> = ({ data, onBack, topic }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setGameStarted] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (data && data.items && data.groups) {
      setItems(data.items);
      setGroups(data.groups.map((group: any) => ({ ...group, items: [] })));
    }
  }, [data]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      handleGameEnd();
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🎯 Game bắt đầu!",
      description: "Kéo thả các items vào nhóm phù hợp",
    });
  };

  const handleDragStart = (e: React.DragEvent, item: Item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    setDragOverGroup(groupId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverGroup(null);
    }
  };

  const handleDrop = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    setDragOverGroup(null);
    
    if (!draggedItem) return;

    // Move item to group
    setItems(items.filter(item => item.id !== draggedItem.id));
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return { ...group, items: [...group.items, draggedItem] };
      }
      return group;
    }));

    toast({
      title: "✅ Item đã thêm",
      description: `"${draggedItem.text}" đã được thêm vào nhóm`,
    });

    setDraggedItem(null);

    // Check if all items are placed
    if (items.length === 1) { // Will be 0 after this move
      setTimeout(handleGameEnd, 500);
    }
  };

  const handleGameEnd = () => {
    setGameCompleted(true);
    
    // Calculate score and results
    let correctCount = 0;
    const gameResults: any[] = [];
    
    groups.forEach(group => {
      group.items.forEach(item => {
        const originalItem = data.items.find((orig: Item) => orig.id === item.id);
        const isCorrect = originalItem && originalItem.group === group.id;
        if (isCorrect) correctCount++;
        
        gameResults.push({
          item: item.text,
          placedGroup: group.name,
          correctGroup: data.groups.find((g: Group) => g.id === originalItem?.group)?.name,
          isCorrect
        });
      });
    });

    const finalScore = Math.round((correctCount / data.items.length) * 100);
    setScore(finalScore);
    setResults(gameResults);

    toast({
      title: `🎊 Hoàn thành! Điểm: ${finalScore}`,
      description: `Bạn đã phân nhóm đúng ${correctCount}/${data.items.length} items`,
    });
  };

  const resetGame = () => {
    setItems(data.items);
    setGroups(data.groups.map((group: any) => ({ ...group, items: [] })));
    setGameCompleted(false);
    setGameStarted(false);
    setScore(0);
    setTimeLeft(120);
    setResults([]);
    setDraggedItem(null);
    setDragOverGroup(null);
  };

  const getProgressPercentage = () => {
    const totalItems = data?.items?.length || 0;
    const placedItems = groups.reduce((acc, group) => acc + group.items.length, 0);
    return totalItems > 0 ? (placedItems / totalItems) * 100 : 0;
  };

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Đang tải game...</h3>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Card className="m-4 p-4 bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                onClick={onBack}
                variant="ghost"
                className="mr-4 text-blue-700 hover:bg-blue-100"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
                <p className="text-gray-600">
                  <span className="font-medium">{topic}</span> • 
                  <span className="ml-2 text-blue-600">{data.items?.length || 0} items</span> • 
                  <span className="ml-2 text-purple-600">{data.groups?.length || 0} nhóm</span>
                </p>
              </div>
            </div>
            
            {gameStarted && !gameCompleted && (
              <div className="flex items-center gap-4 text-lg font-medium">
                <div className="flex items-center text-blue-600">
                  <Clock className="mr-2 h-5 w-5" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex items-center text-purple-600">
                  <Target className="mr-2 h-5 w-5" />
                  {getProgressPercentage().toFixed(0)}%
                </div>
              </div>
            )}
          </div>
          
          {gameStarted && !gameCompleted && (
            <div className="mt-4">
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}
        </Card>

        {/* Game Content */}
        <div className="flex-1 p-4">
          {!gameStarted ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Phân Nhóm Thông Minh</h3>
                  <p className="text-gray-600 mb-6">
                    Kéo thả các items vào nhóm phù hợp. Bạn có {Math.floor(timeLeft / 60)} phút để hoàn thành!
                  </p>
                  <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
                    Hoàn thành! Điểm: {score}/100
                  </h3>
                  <p className="text-gray-600">
                    Bạn đã phân nhóm đúng {results.filter(r => r.isCorrect).length}/{results.length} items
                  </p>
                </div>

                <div className="max-h-60 overflow-y-auto mb-6">
                  <h4 className="font-semibold mb-3 text-gray-700">Kết quả chi tiết:</h4>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                        result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      } border`}>
                        <div className="flex items-center">
                          {result.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-3" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mr-3" />
                          )}
                          <span className="font-medium">{result.item}</span>
                        </div>
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded ${
                            result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.placedGroup}
                          </span>
                          {!result.isCorrect && (
                            <span className="ml-2 text-gray-500">
                              (Đúng: {result.correctGroup})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetGame} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Chơi lại
                  </Button>
                  <Button onClick={onBack} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Kết thúc
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
              {/* Items to sort */}
              <Card className="lg:col-span-1 p-4 bg-white/90 backdrop-blur-sm shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-600" />
                  Items cần phân nhóm
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-xl cursor-move hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <span className="font-medium text-gray-800">{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Groups */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {groups.map((group) => (
                  <Card
                    key={group.id}
                    className={`p-4 transition-all duration-200 ${
                      dragOverGroup === group.id
                        ? 'bg-gradient-to-b from-blue-100 to-purple-100 border-blue-400 shadow-xl scale-105'
                        : 'bg-white/90 backdrop-blur-sm border-gray-200 hover:shadow-lg'
                    }`}
                    onDragOver={(e) => handleDragOver(e, group.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, group.id)}
                  >
                    <h4 className="font-bold text-lg text-gray-800 mb-4 text-center">
                      {group.name}
                    </h4>
                    <div className="min-h-[200px] space-y-2">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg shadow-sm"
                        >
                          <span className="text-gray-800 font-medium">{item.text}</span>
                        </div>
                      ))}
                      {group.items.length === 0 && (
                        <div className="flex items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                          <span>Thả items vào đây</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSortTemplate;

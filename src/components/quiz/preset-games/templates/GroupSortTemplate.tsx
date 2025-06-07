
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Clock, RefreshCw, Trophy, Target, Users, Sparkles } from 'lucide-react';

interface GroupSortProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface GroupItem {
  id: string;
  text: string;
  group: string;
}

interface Group {
  id: string;
  name: string;
  items: string[];
}

const GroupSortTemplate: React.FC<GroupSortProps> = ({ content, topic, onBack }) => {
  const { toast } = useToast();
  
  // Data từ AI hoặc mặc định
  const gameData = content || {
    title: 'Phân Nhóm Tương Tác',
    items: [
      { id: '1', text: 'Táo', group: 'Trái cây' },
      { id: '2', text: 'Cà rót', group: 'Rau củ' },
      { id: '3', text: 'Cam', group: 'Trái cây' },
      { id: '4', text: 'Khoai tây', group: 'Rau củ' },
      { id: '5', text: 'Bò', group: 'Thịt' },
      { id: '6', text: 'Gà', group: 'Thịt' }
    ],
    groups: [
      { id: 'fruit', name: 'Trái cây', items: [] },
      { id: 'vegetable', name: 'Rau củ', items: [] },
      { id: 'meat', name: 'Thịt', items: [] }
    ],
    settings: { timeLimit: 120, bonusTimePerCorrect: 10 }
  };
  
  const [items] = useState<GroupItem[]>(gameData.items);
  const [groups, setGroups] = useState<Group[]>(gameData.groups);
  const [shuffledItems, setShuffledItems] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData.settings?.timeLimit || 120);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalItems] = useState(gameData.items.length);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
  // Shuffle items khi bắt đầu
  useEffect(() => {
    const itemTexts = items.map(item => item.text);
    const shuffled = [...itemTexts].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  }, [items]);
  
  // Đếm ngược thời gian
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && gameStarted && !gameCompleted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted && !gameCompleted) {
      handleTimeUp();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, gameStarted, gameCompleted]);
  
  const handleTimeUp = () => {
    setGameCompleted(true);
    toast({
      title: 'Hết giờ!',
      description: `Bạn đã phân nhóm đúng ${correctCount}/${totalItems} mục.`,
      variant: 'destructive',
    });
  };

  const handleDragStart = (e: React.DragEvent, itemText: string) => {
    setDraggedItem(itemText);
    e.dataTransfer.setData('text/plain', itemText);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    const itemText = e.dataTransfer.getData('text/plain');
    
    if (!itemText) return;
    
    const item = items.find(i => i.text === itemText);
    if (!item) return;
    
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) return;
    
    const isCorrect = item.group === targetGroup.name;
    
    if (isCorrect) {
      const bonusPoints = gameData.settings?.bonusTimePerCorrect || 10;
      setScore(score + bonusPoints);
      setCorrectCount(correctCount + 1);
      setShuffledItems(prev => prev.filter(text => text !== itemText));
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, items: [...group.items, itemText] }
          : group
      ));
      
      toast({
        title: '🎉 Chính xác!',
        description: `+${bonusPoints} điểm! ${itemText} thuộc nhóm ${targetGroup.name}`,
        variant: 'default',
      });
      
      if (shuffledItems.length === 1) {
        setGameCompleted(true);
        const bonusTime = Math.max(0, timeLeft * 2);
        setScore(prev => prev + bonusTime);
        toast({
          title: '🏆 Hoàn hảo!',
          description: `Bạn đã hoàn thành! Bonus: +${bonusTime} điểm thời gian.`,
          variant: 'default',
        });
      }
    } else {
      toast({
        title: '❌ Chưa đúng',
        description: `${itemText} không thuộc nhóm ${targetGroup.name}. Hãy thử lại!`,
        variant: 'destructive',
      });
    }
    
    setDraggedItem(null);
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(gameData.settings?.timeLimit || 120);
    setGroups(gameData.groups.map(group => ({ ...group, items: [] })));
    const itemTexts = items.map(item => item.text);
    const shuffled = [...itemTexts].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  };
  
  const progress = (correctCount / totalItems) * 100;
  
  if (gameCompleted) {
    const isSuccess = correctCount === totalItems;
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 backdrop-blur-sm z-50">
        <div className="w-full max-w-md mx-auto">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <div className="mb-6">
              {isSuccess ? (
                <div className="relative">
                  <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-bounce drop-shadow-lg" />
                  <div className="absolute inset-0 h-20 w-20 mx-auto animate-ping">
                    <Trophy className="h-20 w-20 text-yellow-300 opacity-75" />
                  </div>
                </div>
              ) : (
                <Target className="h-20 w-20 text-blue-500 mx-auto mb-4 drop-shadow-lg" />
              )}
            </div>
            
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              {isSuccess ? '🎉 Xuất sắc!' : '🎯 Hoàn thành!'}
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <span className="text-gray-700 font-medium">Điểm số:</span>
                <span className="text-3xl font-bold text-blue-600">{score}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <span className="text-gray-700 font-medium">Đúng:</span>
                <span className="text-xl font-semibold text-green-600">{correctCount}/{totalItems}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                <span className="text-gray-700 font-medium">Thời gian còn lại:</span>
                <span className="text-xl font-semibold text-orange-600">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={resetGame} 
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
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
  
  if (!gameStarted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm z-50">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <div className="mb-8">
              <div className="relative mb-6">
                <Users className="h-24 w-24 text-blue-500 mx-auto drop-shadow-lg" />
                <div className="absolute inset-0 h-24 w-24 mx-auto animate-pulse">
                  <Users className="h-24 w-24 text-blue-300 opacity-50" />
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {gameData.title}
            </h2>
            <p className="text-xl text-gray-700 mb-2 font-medium">📚 Chủ đề: {topic}</p>
            <p className="text-gray-600 mb-8 text-lg">Kéo thả các mục vào nhóm phù hợp</p>
            
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-white/50">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Target className="h-6 w-6 text-blue-500" />
                  <span className="font-medium text-gray-700">{totalItems} mục cần phân nhóm</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <span className="font-medium text-gray-700">{Math.floor((gameData.settings?.timeLimit || 120) / 60)} phút</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="font-medium text-gray-700">+{gameData.settings?.bonusTimePerCorrect || 10} điểm/đúng</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  <span className="font-medium text-gray-700">{groups.length} nhóm</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-xl font-bold py-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              🚀 Bắt đầu chơi
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="w-full h-full flex flex-col p-4 max-w-none">
        {/* Header với thông tin game */}
        <Card className="mb-4 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl flex-shrink-0">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {gameData.title}
              </h2>
              <p className="text-gray-600 text-sm font-medium">{topic}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-yellow-700 text-lg">{score}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                <Clock className={`h-5 w-5 ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                <span className={`font-bold text-lg ${timeLeft < 30 ? 'text-red-500' : 'text-blue-600'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Progress value={progress} className="h-2 rounded-full" />
            <p className="text-xs text-gray-500 mt-1 text-center font-medium">
              {correctCount}/{totalItems} hoàn thành ({Math.round(progress)}%)
            </p>
          </div>
        </Card>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Items cần phân loại */}
            <Card className="p-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-blue-500" />
                <h3 className="font-bold text-gray-800 text-lg">Các mục cần phân loại</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shuffledItems.map((itemText, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, itemText)}
                      className={`p-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border-2 border-blue-200 rounded-xl cursor-move hover:from-blue-200 hover:via-indigo-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg select-none ${
                        draggedItem === itemText ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      <span className="text-gray-800 font-semibold text-center block">{itemText}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            {/* Các nhóm */}
            <Card className="p-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-purple-500" />
                <h3 className="font-bold text-gray-800 text-lg">Nhóm phân loại</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {groups.map((group, groupIndex) => (
                    <div
                      key={group.id}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDrop={(e) => handleDrop(e, group.id)}
                      className={`p-4 border-2 border-dashed border-purple-300 rounded-xl min-h-[100px] hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 shadow-sm hover:shadow-md ${
                        draggedItem ? 'border-purple-500 bg-purple-50' : ''
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${
                          groupIndex === 0 ? 'rgba(168, 85, 247, 0.1)' :
                          groupIndex === 1 ? 'rgba(59, 130, 246, 0.1)' :
                          'rgba(16, 185, 129, 0.1)'
                        }, rgba(255, 255, 255, 0.5))`
                      }}
                    >
                      <h4 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        {group.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-semibold border border-green-200 shadow-sm text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      {group.items.length === 0 && (
                        <p className="text-gray-400 text-center italic py-6">Thả các mục vào đây</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSortTemplate;

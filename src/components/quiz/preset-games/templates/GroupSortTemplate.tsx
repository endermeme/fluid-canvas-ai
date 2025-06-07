
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
  const [totalItems] = useState(gameData.items.length);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);
  
  useEffect(() => {
    const itemTexts = items.map(item => item.text);
    const shuffled = [...itemTexts].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  }, [items]);
  
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
    calculateFinalScore();
  };

  const calculateFinalScore = () => {
    let correctCount = 0;
    let totalScore = 0;

    // Tính điểm dựa trên các items đã được phân nhóm đúng
    groups.forEach(group => {
      group.items.forEach(itemText => {
        const originalItem = items.find(item => item.text === itemText);
        if (originalItem && originalItem.group === group.name) {
          correctCount++;
          totalScore += gameData.settings?.bonusTimePerCorrect || 10;
        }
      });
    });

    // Bonus điểm thời gian nếu hoàn thành trước hạn
    if (shuffledItems.length === 0 && timeLeft > 0) {
      totalScore += timeLeft * 2;
    }

    setScore(totalScore);
    setGameCompleted(true);
    
    toast({
      title: correctCount === totalItems ? '🏆 Hoàn hảo!' : '🎯 Hoàn thành!',
      description: `Bạn đã phân nhóm đúng ${correctCount}/${totalItems} mục. Điểm: ${totalScore}`,
      variant: correctCount === totalItems ? 'default' : 'destructive',
    });
  };

  const handleDragStart = (e: React.DragEvent, itemText: string) => {
    setDraggedItem(itemText);
    e.dataTransfer.setData('text/plain', itemText);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverGroup(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    setDragOverGroup(groupId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Chỉ clear khi thực sự rời khỏi group
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverGroup(null);
    }
  };

  const handleDrop = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    const itemText = e.dataTransfer.getData('text/plain');
    
    if (!itemText) return;
    
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) return;
    
    // Cho phép thả vào bất kỳ nhóm nào, không kiểm tra đúng sai
    setShuffledItems(prev => prev.filter(text => text !== itemText));
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, items: [...group.items, itemText] }
        : group
    ));
    
    // Kiểm tra nếu đã hết items để phân nhóm
    if (shuffledItems.length === 1) { // length === 1 vì setState async
      calculateFinalScore();
    }
    
    setDraggedItem(null);
    setDragOverGroup(null);
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setTimeLeft(gameData.settings?.timeLimit || 120);
    setGroups(gameData.groups.map(group => ({ ...group, items: [] })));
    const itemTexts = items.map(item => item.text);
    const shuffled = [...itemTexts].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setDraggedItem(null);
    setDragOverGroup(null);
  };
  
  const progress = ((totalItems - shuffledItems.length) / totalItems) * 100;
  
  if (gameCompleted) {
    const correctCount = groups.reduce((count, group) => {
      return count + group.items.filter(itemText => {
        const originalItem = items.find(item => item.text === itemText);
        return originalItem && originalItem.group === group.name;
      }).length;
    }, 0);
    
    const isSuccess = correctCount === totalItems;
    
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <div className="mb-6">
              {isSuccess ? (
                <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
              ) : (
                <Target className="h-20 w-20 text-blue-500 mx-auto mb-4" />
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
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                <span className="text-gray-700 font-medium">Sai:</span>
                <span className="text-xl font-semibold text-red-600">{totalItems - correctCount}/{totalItems}</span>
              </div>
            </div>

            {/* Hiển thị kết quả chi tiết */}
            <div className="mb-8 text-left">
              <h3 className="text-xl font-bold mb-4 text-center">Kết quả chi tiết:</h3>
              <div className="space-y-3">
                {groups.map((group, index) => (
                  <div key={group.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">{group.name}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((itemText) => {
                        // FIX: So sánh chính xác với tên group từ data gốc
                        const originalItem = items.find(item => item.text === itemText);
                        const isCorrect = originalItem && originalItem.group === group.name;
                        return (
                          <span
                            key={itemText}
                            className={`px-3 py-1 rounded-full font-medium ${
                              isCorrect 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {itemText} {isCorrect ? '✓' : '✗'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={resetGame} 
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
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
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <div className="mb-8">
              <Users className="h-24 w-24 text-blue-500 mx-auto mb-6" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {gameData.title}
            </h2>
            <p className="text-xl text-gray-700 mb-2 font-medium">📚 Chủ đề: {topic}</p>
            <p className="text-gray-600 mb-8 text-lg">Kéo thả các mục vào nhóm phù hợp</p>
            
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Target className="h-6 w-6 text-blue-500" />
                  <span className="font-medium text-gray-700">{totalItems} mục cần phân nhóm</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <span className="font-medium text-gray-700">{Math.floor((gameData.settings?.timeLimit || 120) / 60)} phút</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-xl font-bold py-6 rounded-2xl"
            >
              🚀 Bắt đầu chơi
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl flex-shrink-0">
          <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {gameData.title}
              </h2>
              <p className="text-gray-600 text-lg font-medium">{topic}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                <Clock className={`h-6 w-6 ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                <span className={`font-bold text-xl ${timeLeft < 30 ? 'text-red-500' : 'text-blue-600'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <Progress value={progress} className="h-3 rounded-full" />
            <p className="text-sm text-gray-500 mt-2 text-center font-medium">
              {totalItems - shuffledItems.length}/{totalItems} đã phân nhóm ({Math.round(progress)}%)
            </p>
          </div>
        </Card>
        
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Items cần phân loại */}
          <Card className="p-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-8 w-8 text-blue-500" />
              <h3 className="font-bold text-gray-800 text-xl">Các mục cần phân loại</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shuffledItems.map((itemText, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, itemText)}
                    onDragEnd={handleDragEnd}
                    className={`p-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border-2 border-blue-200 rounded-xl cursor-move hover:from-blue-200 hover:via-indigo-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg select-none ${
                      draggedItem === itemText 
                        ? 'opacity-40 scale-90 rotate-2 shadow-2xl border-blue-400' 
                        : 'hover:rotate-1'
                    }`}
                  >
                    <span className="text-gray-800 font-semibold text-center block text-lg">{itemText}</span>
                  </div>
                ))}
              </div>
              {shuffledItems.length === 0 && (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-700">Đã phân loại xong!</p>
                  <p className="text-gray-500">Đang tính điểm...</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Các nhóm */}
          <Card className="p-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-purple-500" />
              <h3 className="font-bold text-gray-800 text-xl">Nhóm phân loại</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {groups.map((group, groupIndex) => (
                <div
                  key={group.id}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, group.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, group.id)}
                  className={`p-6 border-2 border-dashed rounded-xl min-h-[120px] transition-all duration-300 transform ${
                    dragOverGroup === group.id && draggedItem
                      ? 'border-purple-500 bg-purple-100/80 scale-105 shadow-lg rotate-1' 
                      : draggedItem 
                        ? 'border-purple-300 bg-purple-50/50 hover:scale-102' 
                        : 'border-purple-300 hover:border-purple-400 hover:bg-purple-50/50'
                  }`}
                  style={{
                    background: dragOverGroup === group.id && draggedItem ? undefined : `linear-gradient(135deg, ${
                      groupIndex === 0 ? 'rgba(168, 85, 247, 0.1)' :
                      groupIndex === 1 ? 'rgba(59, 130, 246, 0.1)' :
                      groupIndex === 2 ? 'rgba(16, 185, 129, 0.1)' :
                      'rgba(239, 68, 68, 0.1)'
                    }, rgba(255, 255, 255, 0.5))`
                  }}
                >
                  <h4 className="font-bold text-purple-700 mb-4 flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5" />
                    {group.name}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {group.items.map((item, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full font-semibold border border-gray-300 shadow-sm text-sm transition-all duration-200 hover:scale-105"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  {group.items.length === 0 && (
                    <p className={`text-center italic py-8 text-lg transition-all duration-300 ${
                      dragOverGroup === group.id && draggedItem 
                        ? 'text-purple-600 font-semibold animate-pulse' 
                        : 'text-gray-400'
                    }`}>
                      {dragOverGroup === group.id && draggedItem ? '🎯 Thả vào đây!' : 'Thả các mục vào đây'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupSortTemplate;

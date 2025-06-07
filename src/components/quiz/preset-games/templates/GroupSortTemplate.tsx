
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
  
  const handleDrop = (itemText: string, groupId: string) => {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <Card className="p-8 max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <div className="mb-6">
            {isSuccess ? (
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
            ) : (
              <Target className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isSuccess ? 'Xuất sắc!' : 'Hoàn thành!'}
          </h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Điểm số:</span>
              <span className="text-2xl font-bold text-blue-600">{score}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Đúng:</span>
              <span className="text-lg font-semibold text-green-600">{correctCount}/{totalItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Thời gian còn lại:</span>
              <span className="text-lg font-semibold text-orange-600">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={resetGame} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
            {onBack && (
              <Button 
                onClick={onBack} 
                variant="outline"
                className="flex-1"
              >
                Quay lại
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <Card className="p-8 max-w-lg mx-auto text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <div className="mb-6">
            <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {gameData.title}
          </h2>
          <p className="text-gray-600 mb-2">Chủ đề: {topic}</p>
          <p className="text-gray-500 mb-6">Kéo thả các mục vào nhóm phù hợp</p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span>{totalItems} mục cần phân nhóm</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{Math.floor((gameData.settings?.timeLimit || 120) / 60)} phút</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>+{gameData.settings?.bonusTimePerCorrect || 10} điểm/đúng</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>{groups.length} nhóm</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={startGame} 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-6"
          >
            Bắt đầu chơi
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Header với thông tin game */}
      <Card className="mb-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {gameData.title}
            </h2>
            <p className="text-sm text-gray-600">{topic}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-blue-600">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
              <span className={`font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-blue-600'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1 text-center">
            {correctCount}/{totalItems} hoàn thành
          </p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Items cần phân loại */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="font-bold text-gray-800">Các mục cần phân loại</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shuffledItems.map((itemText, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', itemText)}
                className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-200 rounded-lg cursor-move hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <span className="text-gray-800 font-medium text-center block">{itemText}</span>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Các nhóm */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-purple-500" />
            <h3 className="font-bold text-gray-800">Nhóm phân loại</h3>
          </div>
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const itemText = e.dataTransfer.getData('text/plain');
                  handleDrop(itemText, group.id);
                }}
                className="p-4 border-2 border-dashed border-purple-300 rounded-lg min-h-[100px] hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200"
              >
                <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {group.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium border border-green-200 shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                {group.items.length === 0 && (
                  <p className="text-gray-400 text-center italic">Thả các mục vào đây</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GroupSortTemplate;

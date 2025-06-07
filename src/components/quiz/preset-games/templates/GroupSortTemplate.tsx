
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Clock, RefreshCw, ArrowRight, Check, X } from 'lucide-react';

interface GroupSortProps {
  content: any;
  topic: string;
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

const GroupSortTemplate: React.FC<GroupSortProps> = ({ content, topic }) => {
  const { toast } = useToast();
  
  // Data mẫu nếu không có content
  const defaultItems: GroupItem[] = content?.items || [
    { id: '1', text: 'Táo', group: 'Trái cây' },
    { id: '2', text: 'Cà rót', group: 'Rau củ' },
    { id: '3', text: 'Cam', group: 'Trái cây' },
    { id: '4', text: 'Khoai tây', group: 'Rau củ' },
    { id: '5', text: 'Bò', group: 'Thịt' },
    { id: '6', text: 'Gà', group: 'Thịt' }
  ];
  
  const defaultGroups: Group[] = content?.groups || [
    { id: 'fruit', name: 'Trái cây', items: [] },
    { id: 'vegetable', name: 'Rau củ', items: [] },
    { id: 'meat', name: 'Thịt', items: [] }
  ];
  
  const [items, setItems] = useState<GroupItem[]>(defaultItems);
  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [shuffledItems, setShuffledItems] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setGameStarted] = useState(false);
  
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
      description: 'Thời gian đã hết.',
      variant: 'destructive',
    });
  };
  
  const handleDrop = (itemText: string, groupId: string) => {
    const item = items.find(i => i.text === itemText);
    if (!item) return;
    
    const isCorrect = item.group === groups.find(g => g.id === groupId)?.name;
    
    if (isCorrect) {
      setScore(score + 10);
      setShuffledItems(prev => prev.filter(text => text !== itemText));
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, items: [...group.items, itemText] }
          : group
      ));
      
      toast({
        title: 'Đúng rồi!',
        description: `${itemText} thuộc nhóm ${groups.find(g => g.id === groupId)?.name}`,
        variant: 'default',
      });
      
      if (shuffledItems.length === 1) {
        setGameCompleted(true);
        toast({
          title: 'Hoàn thành!',
          description: 'Bạn đã phân loại tất cả các mục.',
          variant: 'default',
        });
      }
    } else {
      toast({
        title: 'Chưa đúng',
        description: `${itemText} không thuộc nhóm ${groups.find(g => g.id === groupId)?.name}`,
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
    setTimeLeft(120);
    setGroups(defaultGroups.map(group => ({ ...group, items: [] })));
    const itemTexts = items.map(item => item.text);
    const shuffled = [...itemTexts].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  };
  
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
  
  if (!gameStarted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-6 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Phân Nhóm: {topic}</h2>
          <p className="mb-6">Kéo thả các mục vào nhóm phù hợp</p>
          <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
            Bắt đầu chơi
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-[500px] p-6">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Phân Nhóm: {topic}</h2>
        <div className="flex items-center gap-4">
          <span className="font-medium">Điểm: {score}</span>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className={`font-medium ${timeLeft < 30 ? 'text-red-500' : 'text-blue-500'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Items to sort */}
        <Card className="p-4">
          <h3 className="font-bold mb-4">Các mục cần phân loại:</h3>
          <div className="grid grid-cols-2 gap-2">
            {shuffledItems.map((itemText, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', itemText)}
                className="p-3 bg-gray-100 border border-gray-300 rounded-md cursor-move hover:bg-gray-200 text-center"
              >
                {itemText}
              </div>
            ))}
          </div>
        </Card>
        
        {/* Groups */}
        <Card className="p-4">
          <h3 className="font-bold mb-4">Nhóm:</h3>
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
                className="p-4 border-2 border-dashed border-gray-300 rounded-md min-h-[80px] hover:border-blue-400"
              >
                <h4 className="font-medium mb-2">{group.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GroupSortTemplate;

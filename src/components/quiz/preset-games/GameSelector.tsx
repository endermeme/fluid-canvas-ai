
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  Image, CheckSquare, Layers, ArrowRightLeft, Search, Sparkles,
  ArrowRight, Zap, RotateCcw, Target, Gamepad2, Settings, CircleDot
} from 'lucide-react';
import GameSettings from '../GameSettings';
import { GameSettingsData } from '../types';

interface GameSelectorProps {
  onSelectGame: (gameType: string) => void;
  onQuickStart?: (gameType: string, prompt: string, settings: GameSettingsData) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame, onQuickStart }) => {
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [quickPrompt, setQuickPrompt] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  
  const defaultSettings: GameSettingsData = {
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
    useTimer: true
  };
  
  const handleQuickStart = () => {
    if (onQuickStart && selectedGameType && quickPrompt.trim()) {
      onQuickStart(selectedGameType, quickPrompt, defaultSettings);
    }
  };
  
  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
    if (gameType) {
      onSelectGame(gameType);
    }
  };

  const gameTypes = [
    { 
      id: 'quiz', 
      name: 'Trắc Nghiệm', 
      description: 'Trả lời câu hỏi nhiều lựa chọn',
      icon: <Brain className="h-8 w-8 text-blue-600" />
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học với thẻ hai mặt',
      icon: <BookOpen className="h-8 w-8 text-green-600" />
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Nối các cặp từ tương ứng với nhau',
      icon: <ArrowRightLeft className="h-8 w-8 text-purple-600" />
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Tìm các cặp thẻ giống nhau',
      icon: <Brain className="h-8 w-8 text-pink-600" />
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="h-8 w-8 text-indigo-600" />
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm các từ ẩn trong bảng chữ cái',
      icon: <Search className="h-8 w-8 text-orange-600" />
    },
    { 
      id: 'pictionary', 
      name: 'Đoán Hình', 
      description: 'Đoán từ qua hình ảnh',
      icon: <Image className="h-8 w-8 text-teal-600" />
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Xác định nội dung là đúng hay sai',
      icon: <CheckSquare className="h-8 w-8 text-emerald-600" />
    },
    { 
      id: 'balloonpop', 
      name: 'Bóng Bay Đố Vui', 
      description: 'Nổ bóng bay để khám phá câu hỏi thú vị',
      icon: <CircleDot className="h-8 w-8 text-yellow-600" />
    },
    { 
      id: 'spinwheel', 
      name: 'Quay Bánh Xe', 
      description: 'Quay bánh xe may mắn để nhận câu hỏi',
      icon: <RotateCcw className="h-8 w-8 text-cyan-600" />
    },
    { 
      id: 'whackmole', 
      name: 'Đập Chuột Đố Vui', 
      description: 'Đập nhanh chuột có đáp án đúng',
      icon: <Target className="h-8 w-8 text-red-600" />
    },
    { 
      id: 'stackbuilder', 
      name: 'Xếp Khối Đố Vui', 
      description: 'Kéo thả các khối theo thứ tự đúng',
      icon: <Layers className="h-8 w-8 text-violet-600" />
    },
    { 
      id: 'catchobjects', 
      name: 'Bắt Vật Thể', 
      description: 'Bắt các vật thể có đáp án đúng',
      icon: <Target className="h-8 w-8 text-amber-600" />
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Chọn loại trò chơi để tạo với AI</h2>
      
      {/* Quick Start Panel */}
      <div className="bg-primary/5 p-4 rounded-lg mb-6 border border-primary/20">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Tạo nhanh với chủ đề
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Nhập chủ đề của bạn (ví dụ: Lịch sử Việt Nam)..."
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleQuickStart}
            disabled={!quickPrompt.trim() || !selectedGameType}
            className="group whitespace-nowrap"
          >
            Tạo Ngay
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {gameTypes.map((game) => (
            <Button
              key={game.id}
              size="sm"
              variant={selectedGameType === game.id ? "default" : "outline"}
              className={`${selectedGameType === game.id ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-primary/10'}`}
              onClick={() => setSelectedGameType(game.id)}
            >
              {game.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {gameTypes.map((game) => (
          <Card 
            key={game.id}
            className={`p-4 hover:shadow-md transition-all hover:border-primary hover:bg-primary/5 cursor-pointer ${selectedGameType === game.id ? 'border-primary bg-primary/10' : ''}`}
            onClick={() => handleSelectGame(game.id)}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-white rounded-full shadow-sm">
                {game.icon}
              </div>
              <div>
                <h3 className="font-bold">{game.name}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </div>
              <div className="mt-2 flex items-center justify-center w-full px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-1" />
                Tạo với AI
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Cài đặt cho {gameTypes.find(g => g.id === selectedGameType)?.name || "trò chơi"}</DialogTitle>
          <GameSettings 
            topic={quickPrompt}
            onStart={(settings) => {
              if (onQuickStart && selectedGameType) {
                onQuickStart(selectedGameType, quickPrompt, settings);
              }
            }}
            initialSettings={defaultSettings}
            onCancel={() => setShowSettings(false)}
            inModal={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameSelector;

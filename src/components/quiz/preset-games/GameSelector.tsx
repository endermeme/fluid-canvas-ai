
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  CheckSquare, Layers, ArrowRightLeft, Search, Sparkles,
  ArrowRight, SlidersHorizontal
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
      icon: <Brain className="h-8 w-8 text-sky-600" />,
      gradient: 'from-sky-400 to-blue-500'
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học với thẻ hai mặt',
      icon: <BookOpen className="h-8 w-8 text-emerald-600" />,
      gradient: 'from-emerald-400 to-teal-500'
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Nối các cặp từ tương ứng với nhau',
      icon: <ArrowRightLeft className="h-8 w-8 text-purple-600" />,
      gradient: 'from-purple-400 to-indigo-500'
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Tìm các cặp thẻ giống nhau',
      icon: <Dices className="h-8 w-8 text-orange-600" />,
      gradient: 'from-orange-400 to-red-500'
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="h-8 w-8 text-pink-600" />,
      gradient: 'from-pink-400 to-rose-500'
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm các từ ẩn trong bảng chữ cái',
      icon: <Search className="h-8 w-8 text-cyan-600" />,
      gradient: 'from-cyan-400 to-blue-500'
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Xác định nội dung là đúng hay sai',
      icon: <CheckSquare className="h-8 w-8 text-green-600" />,
      gradient: 'from-green-400 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Chọn Loại Trò Chơi
          </h2>
          <p className="text-xl text-gray-600 font-medium">Tạo trò chơi tương tác bằng AI</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full" />
        </div>
        
        {/* Quick Start Panel */}
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl mb-12 border-0 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl">
              <Sparkles className="h-6 w-6 text-sky-600" />
            </div>
            Tạo Nhanh Với Chủ Đề
          </h3>
          <div className="flex flex-col lg:flex-row gap-6">
            <Input
              placeholder="Nhập chủ đề của bạn (ví dụ: Lịch sử Việt Nam)..."
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              className="flex-1 h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-sky-400 transition-colors bg-white/80"
            />
            <Button 
              onClick={handleQuickStart}
              disabled={!quickPrompt.trim() || !selectedGameType}
              className="group whitespace-nowrap h-14 px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold rounded-xl"
            >
              Tạo Ngay
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {gameTypes.map((game) => (
              <Button
                key={game.id}
                size="sm"
                variant={selectedGameType === game.id ? "default" : "outline"}
                className={`transition-all duration-200 rounded-xl font-medium ${
                  selectedGameType === game.id 
                    ? `bg-gradient-to-r ${game.gradient} text-white shadow-lg` 
                    : 'bg-white/80 hover:bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedGameType(game.id)}
              >
                {game.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gameTypes.map((game) => (
            <Card 
              key={game.id}
              className={`p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-md rounded-2xl group ${
                selectedGameType === game.id ? 'shadow-2xl ring-2 ring-sky-400' : 'shadow-xl hover:shadow-2xl'
              }`}
              onClick={() => handleSelectGame(game.id)}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                  {game.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{game.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{game.description}</p>
                </div>
                <div className={`mt-2 flex items-center justify-center w-full px-4 py-3 rounded-xl bg-gradient-to-r ${game.gradient} text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <Sparkles className="h-4 w-4 mr-2" />
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
    </div>
  );
};

export default GameSelector;


import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  CheckSquare, Layers, ArrowRightLeft, Search, Sparkles,
  ArrowRight, SlidersHorizontal, Zap, Play
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
      description: 'Trả lời câu hỏi nhiều lựa chọn để kiểm tra kiến thức',
      icon: <Brain className="h-8 w-8" />,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học hiệu quả với thẻ hai mặt tương tác',
      icon: <BookOpen className="h-8 w-8" />,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Tìm và nối các cặp từ tương ứng với nhau',
      icon: <ArrowRightLeft className="h-8 w-8" />,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Rèn luyện trí nhớ bằng cách tìm các cặp thẻ giống nhau',
      icon: <Dices className="h-8 w-8" />,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh có nghĩa',
      icon: <Layers className="h-8 w-8" />,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100'
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Khám phá và tìm các từ ẩn trong bảng chữ cái',
      icon: <Search className="h-8 w-8" />,
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100'
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Phân tích và xác định nội dung là đúng hay sai',
      icon: <CheckSquare className="h-8 w-8" />,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium mb-6">
              <Zap className="h-4 w-4" />
              Tạo game học tập thông minh với AI
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Khởi Tạo Trò Chơi
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">Học Tập Tương Tác</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Biến việc học thành trải nghiệm thú vị với các trò chơi được tạo bởi AI. 
              Chỉ cần nhập chủ đề, chúng tôi sẽ tạo ra game phù hợp ngay lập tức.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Quick Start Panel */}
          <div className="mb-12">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-700">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Tạo Nhanh với AI</h3>
                    <p className="text-muted-foreground">Nhập chủ đề và để AI tạo game phù hợp cho bạn</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <Input
                      placeholder="Ví dụ: Lịch sử Việt Nam, Toán học lớp 6, Tiếng Anh giao tiếp..."
                      value={quickPrompt}
                      onChange={(e) => setQuickPrompt(e.target.value)}
                      className="h-14 text-lg pl-4 pr-32 border-2 border-primary/20 focus:border-primary/50 bg-white/80 backdrop-blur-sm"
                    />
                    <Button 
                      onClick={handleQuickStart}
                      disabled={!quickPrompt.trim() || !selectedGameType}
                      className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Tạo Ngay
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Chọn loại trò chơi:</p>
                    <div className="flex flex-wrap gap-3">
                      {gameTypes.map((game) => (
                        <Button
                          key={game.id}
                          size="sm"
                          variant={selectedGameType === game.id ? "default" : "outline"}
                          className={`transition-all duration-200 ${
                            selectedGameType === game.id 
                              ? `bg-gradient-to-r ${game.gradient} text-white shadow-lg scale-105` 
                              : 'hover:scale-105 hover:shadow-md bg-white/80 backdrop-blur-sm'
                          }`}
                          onClick={() => setSelectedGameType(game.id)}
                        >
                          {game.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Game Types Grid */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3">Hoặc Chọn Loại Game Cụ Thể</h2>
              <p className="text-muted-foreground text-lg">Mỗi game được thiết kế để tối ưu hóa trải nghiệm học tập</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gameTypes.map((game) => (
                <Card 
                  key={game.id}
                  className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 ${
                    selectedGameType === game.id 
                      ? 'ring-2 ring-primary shadow-2xl scale-105' 
                      : 'hover:shadow-xl'
                  }`}
                  onClick={() => handleSelectGame(game.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.bgGradient} opacity-50`}></div>
                  <div className="relative p-6 h-full flex flex-col">
                    <div className="flex flex-col items-center text-center space-y-4 flex-1">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${game.gradient} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        {game.icon}
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {game.description}
                        </p>
                      </div>
                      
                      <div className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${game.gradient} text-white text-sm font-semibold shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                        <Sparkles className="h-4 w-4" />
                        Tạo với AI
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
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


import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  CheckSquare, Layers, ArrowRightLeft, Search,
  Gamepad2, Sparkles
} from 'lucide-react';

interface GameSelectorProps {
  onSelectGame: (gameType: string) => void;
  onQuickStart?: (gameType: string, prompt: string, settings: any) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  
  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
    onSelectGame(gameType);
  };

  const gameTypes = [
    { 
      id: 'quiz', 
      name: 'Trắc Nghiệm', 
      description: 'Trả lời câu hỏi nhiều lựa chọn với thời gian giới hạn',
      icon: <Brain className="h-8 w-8" />,
      gradient: 'from-sky-500 to-blue-600',
      color: 'text-sky-600'
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học bằng thẻ hai mặt với tính năng lật tự động',
      icon: <BookOpen className="h-8 w-8" />,
      gradient: 'from-emerald-500 to-teal-600',
      color: 'text-emerald-600'
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Ghép các cặp từ tương ứng với nhau',
      icon: <ArrowRightLeft className="h-8 w-8" />,
      gradient: 'from-purple-500 to-indigo-600',
      color: 'text-purple-600'
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Lật thẻ và tìm các cặp thẻ giống nhau',
      icon: <Dices className="h-8 w-8" />,
      gradient: 'from-orange-500 to-red-600',
      color: 'text-orange-600'
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="h-8 w-8" />,
      gradient: 'from-pink-500 to-rose-600',
      color: 'text-pink-600'
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm kiếm các từ được ẩn trong bảng chữ cái',
      icon: <Search className="h-8 w-8" />,
      gradient: 'from-cyan-500 to-blue-600',
      color: 'text-cyan-600'
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Phán đoán các câu khẳng định là đúng hay sai',
      icon: <CheckSquare className="h-8 w-8" />,
      gradient: 'from-green-500 to-emerald-600',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <Gamepad2 className="h-12 w-12 text-sky-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Chọn Loại Trò Chơi
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Tạo trò chơi tương tác học tập với công nghệ AI. Chọn một loại game để bắt đầu.
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full" />
        </div>
        
        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gameTypes.map((game) => (
            <Card 
              key={game.id}
              className={`group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-2xl transform hover:scale-105 ${
                selectedGameType === game.id ? 'ring-2 ring-sky-400 shadow-2xl scale-105' : ''
              }`}
              onClick={() => handleSelectGame(game.id)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent" />
              </div>
              
              {/* Content */}
              <div className="relative p-6 flex flex-col h-full">
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 ${game.color}`}>
                    {game.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 text-center mb-3 group-hover:text-gray-900 transition-colors">
                  {game.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 text-center leading-relaxed mb-6 flex-grow">
                  {game.description}
                </p>
                
                {/* Action Button */}
                <div className="mt-auto">
                  <Button 
                    className={`w-full py-3 rounded-xl bg-gradient-to-r ${game.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectGame(game.id);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Tạo Game
                  </Button>
                </div>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            </Card>
          ))}
        </div>
        
        {/* Footer Info */}
        <div className="text-center mt-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto border border-sky-200/30">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Được hỗ trợ bởi AI
            </h3>
            <p className="text-gray-600">
              Tất cả nội dung game sẽ được tạo tự động dựa trên chủ đề bạn nhập. 
              Mỗi game có cài đặt riêng để tùy chỉnh độ khó và thời gian chơi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSelector;

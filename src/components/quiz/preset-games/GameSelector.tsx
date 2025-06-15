
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  CheckSquare, Layers, ArrowRightLeft, Search,
  Gamepad2, Sparkles, ArrowLeft
} from 'lucide-react';

interface GameSelectorProps {
  onSelectGame: (gameType: string) => void;
  onQuickStart?: (gameType: string, prompt: string, settings: any) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const navigate = useNavigate();
  
  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
    onSelectGame(gameType);
  };

  const handleBack = () => {
    navigate('/');
  };

  const gameTypes = [
    { 
      id: 'quiz', 
      name: 'Trắc Nghiệm', 
      description: 'Trả lời câu hỏi nhiều lựa chọn với thời gian giới hạn',
      icon: <Brain className="h-8 w-8" />,
      gradient: 'from-sky-500 to-blue-600',
      color: 'text-sky-600',
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        useTimer: true,
        showExplanation: true,
        shuffleQuestions: true,
        shuffleOptions: true,
        bonusTime: 5
      }
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học bằng thẻ hai mặt với tính năng lật tự động',
      icon: <BookOpen className="h-8 w-8" />,
      gradient: 'from-emerald-500 to-teal-600',
      color: 'text-emerald-600',
      defaultSettings: {
        autoFlip: false,
        flipTime: 5,
        shuffleCards: true,
        showProgress: true
      }
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Ghép các cặp từ tương ứng với nhau',
      icon: <ArrowRightLeft className="h-8 w-8" />,
      gradient: 'from-purple-500 to-indigo-600',
      color: 'text-purple-600',
      defaultSettings: {
        difficulty: 'medium',
        timeLimit: 60,
        shuffleItems: true,
        allowPartialMatching: false
      }
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Lật thẻ và tìm các cặp thẻ giống nhau',
      icon: <Dices className="h-8 w-8" />,
      gradient: 'from-orange-500 to-red-600',
      color: 'text-orange-600',
      defaultSettings: {
        useTimer: true,
        timeLimit: 120,
        allowHints: true,
        shuffleCards: true
      }
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="h-8 w-8" />,
      gradient: 'from-pink-500 to-rose-600',
      color: 'text-pink-600',
      defaultSettings: {
        timeLimit: 180,
        showHints: true,
        allowShuffle: true
      }
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm kiếm các từ được ẩn trong bảng chữ cái',
      icon: <Search className="h-8 w-8" />,
      gradient: 'from-cyan-500 to-blue-600',
      color: 'text-cyan-600',
      defaultSettings: {
        gridSize: 15,
        allowDiagonalWords: true,
        showWordList: true,
        timeLimit: 300
      }
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Phán đoán các câu khẳng định là đúng hay sai',
      icon: <CheckSquare className="h-8 w-8" />,
      gradient: 'from-green-500 to-emerald-600',
      color: 'text-green-600',
      defaultSettings: {
        timePerQuestion: 15,
        totalTime: 150,
        showExplanation: true
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Header với nút quay lại */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-sky-600" />
            <h1 className="text-lg font-semibold text-gray-800">
              Chọn Loại Trò Chơi
            </h1>
          </div>
          
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-6">
          <div className="w-full max-w-6xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Tạo Trò Chơi Học Tập
              </h2>
              <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                Tạo trò chơi tương tác học tập với công nghệ AI. Chọn một loại game để bắt đầu.
              </p>
              <div className="mt-4 w-20 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full" />
            </div>
            
            {/* Game Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default GameSelector;

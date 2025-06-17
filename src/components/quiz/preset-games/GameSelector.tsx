
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  CheckSquare, Layers, ArrowRightLeft, Search,
  ArrowLeft, Home
} from 'lucide-react';
import { GameSettingsData } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface GameSelectorProps {
  onSelectGame: (gameType: string) => void;
  onQuickStart?: (gameType: string, prompt: string, settings: GameSettingsData) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const navigate = useNavigate();
  
  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
    if (gameType) {
      onSelectGame(gameType);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const gameTypes = [
    { 
      id: 'quiz', 
      name: 'Trắc Nghiệm', 
      description: 'Trả lời câu hỏi nhiều lựa chọn',
      icon: <Brain className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200 hover:border-blue-300'
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học với thẻ hai mặt',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200 hover:border-green-300'
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Nối các cặp từ tương ứng',
      icon: <ArrowRightLeft className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200 hover:border-purple-300'
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Tìm các cặp thẻ giống nhau',
      icon: <Dices className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      borderColor: 'border-orange-200 hover:border-orange-300'
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ tạo thành câu',
      icon: <Layers className="h-6 w-6" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      borderColor: 'border-red-200 hover:border-red-300'
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm các từ ẩn trong bảng chữ',
      icon: <Search className="h-6 w-6" />,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
      borderColor: 'border-teal-200 hover:border-teal-300'
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Xác định nội dung đúng hay sai',
      icon: <CheckSquare className="h-6 w-6" />,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      borderColor: 'border-indigo-200 hover:border-indigo-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với nút về trang chủ */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            onClick={handleBackToHome}
            variant="outline"
            className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300 hover:from-gray-200 hover:to-gray-100 text-gray-700 font-medium shadow-sm"
          >
            <Home className="h-4 w-4" />
            <span>Về Trang Chủ</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">Chọn Loại Trò Chơi</h1>
            <p className="text-sm text-gray-600">Tạo trò chơi học tập tương tác với AI</p>
          </div>
          
          <div className="w-32"></div> {/* Spacer để cân bằng layout */}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {gameTypes.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card 
                className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  selectedGameType === game.id 
                    ? `${game.bgColor} ${game.borderColor} shadow-lg scale-105` 
                    : `bg-white hover:${game.bgColor.split(' ')[1]} border-gray-200 ${game.borderColor.split(' ')[1]}`
                }`}
                onClick={() => handleSelectGame(game.id)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon với gradient background */}
                  <div className={`p-4 rounded-full bg-gradient-to-r ${game.color} shadow-md`}>
                    <div className="text-white">
                      {game.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {game.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                  
                  {/* Action button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${game.color} text-white border-0 hover:shadow-md transition-all duration-200`}
                    size="sm"
                  >
                    Tạo Game
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GameSelector;

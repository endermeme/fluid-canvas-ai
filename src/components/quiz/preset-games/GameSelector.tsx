
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  CheckSquare, Layers, ArrowRightLeft, Search, Sparkles,
  ArrowLeft, Play
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
  const [topic, setTopic] = useState<string>('');
  const navigate = useNavigate();
  
  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
    const finalTopic = topic.trim() || 'Học cùng AI';
    
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
      description: 'Trả lời câu hỏi nhiều lựa chọn với các chủ đề đa dạng',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học với thẻ hai mặt để ghi nhớ kiến thức hiệu quả',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100'
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Nối các cặp từ tương ứng để kiểm tra hiểu biết',
      icon: <ArrowRightLeft className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Tìm các cặp thẻ giống nhau để rèn luyện trí nhớ',
      icon: <Dices className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-50 to-pink-100'
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm các từ ẩn trong bảng chữ cái thú vị',
      icon: <Search className="w-6 h-6" />,
      color: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100'
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Xác định nội dung là đúng hay sai một cách nhanh chóng',
      icon: <CheckSquare className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 40, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="relative pt-16 pb-8">
        <div className="absolute top-6 left-6">
          <motion.button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </motion.button>
        </div>
        
        <motion.div 
          className="text-center px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Chọn Loại Trò Chơi
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Tạo trò chơi học tập tương tác với công nghệ AI thông minh
          </motion.p>
        </motion.div>
      </div>

      {/* Games Grid */}
      <div className="px-6 pb-16">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gameTypes.map((game, index) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`relative h-full cursor-pointer group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    selectedGameType === game.id ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                  }`}
                  onClick={() => handleSelectGame(game.id)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.bgGradient} dark:from-slate-800 dark:to-slate-700 opacity-50 group-hover:opacity-70 transition-opacity`} />
                  
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
                  </div>

                  <div className="relative p-6 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {game.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {game.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {game.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <motion.div
                      className={`flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r ${game.color} text-white text-sm font-medium group-hover:shadow-lg transition-all`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      <span>Bắt đầu tạo</span>
                    </motion.div>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-lg`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameSelector;

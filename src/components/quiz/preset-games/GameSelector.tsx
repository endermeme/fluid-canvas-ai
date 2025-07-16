
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  CheckSquare, Layers, ArrowRightLeft, Search, Sparkles,
  ArrowLeft
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
    
    // Tự động điền "Học cùng AI" nếu topic trống
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
      id: 'back', 
      name: 'Quay Lại', 
      description: 'Trở về trang chủ để chọn loại trò chơi khác',
      icon: <ArrowLeft className="h-10 w-10 text-blue-600" />,
      isBackButton: true
    },
    { 
      id: 'quiz', 
      name: 'Trắc Nghiệm', 
      description: 'Trả lời câu hỏi nhiều lựa chọn với các chủ đề đa dạng',
      icon: <Brain className="h-10 w-10 text-blue-600" />
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học với thẻ hai mặt để ghi nhớ kiến thức hiệu quả',
      icon: <BookOpen className="h-10 w-10 text-blue-600" />
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Nối các cặp từ tương ứng để kiểm tra hiểu biết',
      icon: <ArrowRightLeft className="h-10 w-10 text-blue-600" />
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Tìm các cặp thẻ giống nhau để rèn luyện trí nhớ',
      icon: <Dices className="h-10 w-10 text-blue-600" />
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="h-10 w-10 text-blue-600" />
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm các từ ẩn trong bảng chữ cái thú vị',
      icon: <Search className="h-10 w-10 text-blue-600" />
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Xác định nội dung là đúng hay sai một cách nhanh chóng',
      icon: <CheckSquare className="h-10 w-10 text-blue-600" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const iconVariants = {
    hover: {
      rotate: 10,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-full w-full overflow-y-auto bg-transparent">
      <div className="flex flex-col items-center justify-start p-6 min-h-full">
        <motion.div 
          className="w-full max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="text-center mb-10"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 bg-clip-text text-transparent mb-4"
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
              className="text-lg text-slate-600 dark:text-slate-300 mb-8"
              variants={itemVariants}
            >
              Tạo trò chơi học tập tương tác với AI
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto pb-6"
            variants={containerVariants}
          >
            {gameTypes.map((game, index) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                custom={index}
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="h-full"
                >
                  <Card 
                    className={`p-4 cursor-pointer h-full group relative overflow-hidden backdrop-blur-lg bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/20 shadow-xl ${
                      selectedGameType === game.id ? 'border-blue-500 bg-blue-500/20 shadow-2xl' : 'hover:border-blue-500/50'
                    } ${game.isBackButton ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/10 border-blue-500/40' : ''}`}
                    onClick={() => game.isBackButton ? handleBackToHome() : handleSelectGame(game.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-3 h-full">
                      <motion.div 
                        className="p-3 bg-blue-500/20 rounded-full transition-all duration-300"
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        {game.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 transition-colors duration-300 text-blue-600 dark:text-blue-400">{game.name}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                          {game.description}
                        </p>
                      </div>
                      <div className="mt-auto w-full">
                        <motion.div 
                          className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                            game.isBackButton 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {game.isBackButton ? (
                            <>
                              <motion.div
                                animate={{ x: [0, -2, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowLeft className="h-3 w-3 mr-1" />
                              </motion.div>
                              <span>Về trang chủ</span>
                            </>
                          ) : (
                            <>
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Sparkles className="h-3 w-3 mr-1" />
                              </motion.div>
                              <span>Tạo với AI</span>
                            </>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameSelector;

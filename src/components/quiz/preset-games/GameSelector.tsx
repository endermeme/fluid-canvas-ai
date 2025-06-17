
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
      icon: <ArrowLeft className="h-8 w-8 text-primary" />,
      isBackButton: true
    },
    { 
      id: 'quiz', 
      name: 'Trắc Nghiệm', 
      description: 'Trả lời câu hỏi nhiều lựa chọn với các chủ đề đa dạng',
      icon: <Brain className="h-8 w-8 text-primary" />
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học với thẻ hai mặt để ghi nhớ kiến thức hiệu quả',
      icon: <BookOpen className="h-8 w-8 text-primary" />
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Nối các cặp từ tương ứng để kiểm tra hiểu biết',
      icon: <ArrowRightLeft className="h-8 w-8 text-primary" />
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Tìm các cặp thẻ giống nhau để rèn luyện trí nhớ',
      icon: <Dices className="h-8 w-8 text-primary" />
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="h-8 w-8 text-primary" />
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm các từ ẩn trong bảng chữ cái thú vị',
      icon: <Search className="h-8 w-8 text-primary" />
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Xác định nội dung là đúng hay sai một cách nhanh chóng',
      icon: <CheckSquare className="h-8 w-8 text-primary" />
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
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2"
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
              className="text-base text-muted-foreground mb-4"
              variants={itemVariants}
            >
              Tạo trò chơi học tập tương tác với AI
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl mx-auto"
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
                    className={`p-4 cursor-pointer h-full group relative overflow-hidden ${
                      selectedGameType === game.id ? 'border-primary bg-primary/10 shadow-lg' : 'border-border hover:border-primary'
                    } ${game.isBackButton ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30' : ''}`}
                    onClick={() => game.isBackButton ? handleBackToHome() : handleSelectGame(game.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -right-8 -top-8 w-16 h-16 bg-primary/10 rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-3 h-full">
                      <motion.div 
                        className="p-2 bg-primary/10 rounded-full transition-all duration-300"
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        {game.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold mb-1 transition-colors duration-300 group-hover:text-primary">{game.name}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-muted-foreground/80">
                          {game.description}
                        </p>
                      </div>
                      <div className="mt-auto w-full">
                        <motion.div 
                          className={`flex items-center justify-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                            game.isBackButton 
                              ? 'bg-gradient-to-r from-primary/30 to-primary/20 text-primary' 
                              : 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary'
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
                                <ArrowLeft className="h-2 w-2 mr-1" />
                              </motion.div>
                              <span>Về trang chủ</span>
                            </>
                          ) : (
                            <>
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Sparkles className="h-2 w-2 mr-1" />
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

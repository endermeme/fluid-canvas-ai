
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
import { motion, AnimatePresence } from 'framer-motion';

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

  // Container animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  // Individual card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  // Icon animation variants
  const iconVariants = {
    initial: { 
      rotate: 0,
      scale: 1
    },
    hover: {
      rotate: 5,
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Badge animation variants
  const badgeVariants = {
    initial: { 
      scale: 1,
      opacity: 0.8
    },
    hover: {
      scale: 1.05,
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 relative z-10">
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <motion.div 
          className="w-full max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            variants={cardVariants}
          >
            <motion.h1 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent mb-2"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              Chọn Loại Trò Chơi
            </motion.h1>
            <motion.p 
              className="text-base text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Tạo trò chơi học tập tương tác với AI
            </motion.p>
          </motion.div>
          
          {/* Games Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl mx-auto"
            variants={containerVariants}
          >
            <AnimatePresence>
              {gameTypes.map((game, index) => (
                <motion.div
                  key={game.id}
                  variants={cardVariants}
                  custom={index}
                  layout
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="h-full"
                  >
                    <Card 
                      className={`p-4 cursor-pointer h-full group relative overflow-hidden border-2 transition-all duration-300 ${
                        selectedGameType === game.id 
                          ? 'border-primary bg-primary/10 shadow-xl' 
                          : 'border-border hover:border-primary/50 hover:shadow-lg'
                      } ${game.isBackButton 
                          ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30' 
                          : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent'
                        }`}
                      onClick={() => game.isBackButton ? handleBackToHome() : handleSelectGame(game.id)}
                    >
                      {/* Background Effects */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <motion.div 
                        className="absolute -right-8 -top-8 w-16 h-16 bg-primary/20 rounded-full"
                        initial={{ scale: 0, rotate: 0 }}
                        whileHover={{ 
                          scale: 2, 
                          rotate: 180,
                          transition: { duration: 0.4 }
                        }}
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center text-center gap-3 h-full">
                        {/* Icon */}
                        <motion.div 
                          className="p-3 bg-primary/10 rounded-full transition-all duration-300 group-hover:bg-primary/20"
                          variants={iconVariants}
                          initial="initial"
                          whileHover="hover"
                        >
                          {game.icon}
                        </motion.div>
                        
                        {/* Text Content */}
                        <div className="flex-1">
                          <motion.h3 
                            className="text-base font-bold mb-2 transition-colors duration-300 group-hover:text-primary"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {game.name}
                          </motion.h3>
                          <motion.p 
                            className="text-xs text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-muted-foreground/80"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                          >
                            {game.description}
                          </motion.p>
                        </div>
                        
                        {/* Action Badge */}
                        <div className="mt-auto w-full">
                          <motion.div 
                            className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                              game.isBackButton 
                                ? 'bg-gradient-to-r from-primary/40 to-primary/30 text-primary border border-primary/20' 
                                : 'bg-gradient-to-r from-primary/30 to-primary/20 text-primary border border-primary/20'
                            }`}
                            variants={badgeVariants}
                            initial="initial"
                            whileHover="hover"
                          >
                            {game.isBackButton ? (
                              <>
                                <motion.div
                                  animate={{ x: [-2, 0, -2] }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <ArrowLeft className="h-3 w-3 mr-2" />
                                </motion.div>
                                <span>Về trang chủ</span>
                              </>
                            ) : (
                              <>
                                <motion.div
                                  animate={{ 
                                    rotate: [0, 15, -15, 0],
                                    scale: [1, 1.1, 1, 1]
                                  }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <Sparkles className="h-3 w-3 mr-2" />
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
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameSelector;

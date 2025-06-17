
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, Target, Trophy, Star, Code, Lightbulb, Settings } from 'lucide-react';
import BackgroundParticles from '@/components/ui/background-particles';

interface GameLoadingProps {
  isVisible?: boolean;
  progress?: number;
  message?: string;
  gameType?: string;
  topic?: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ 
  isVisible = true, 
  progress = 0, 
  message = "", 
  gameType = 'quiz',
  topic = ""
}) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const developmentStages = [
    { icon: Lightbulb, name: "Phân tích chủ đề", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
    { icon: Code, name: "Tạo nội dung", color: "text-blue-500", bgColor: "bg-blue-500/20" },
    { icon: Settings, name: "Tối ưu hóa", color: "text-purple-500", bgColor: "bg-purple-500/20" },
    { icon: Trophy, name: "Hoàn thành", color: "text-green-500", bgColor: "bg-green-500/20" }
  ];

  const loadingTips = [
    "💡 AI sử dụng thuật toán học máy để tạo câu hỏi phù hợp",
    "🎯 Độ khó được điều chỉnh dựa trên cấp độ người học",
    "⚡ Nội dung được tối ưu hóa cho trải nghiệm tương tác tốt nhất",
    "🎨 Giao diện được thiết kế để tăng cường sự tập trung",
    "🚀 Mỗi trò chơi được tạo riêng biệt cho chủ đề của bạn",
    "🧠 AI phân tích ngữ cảnh để tạo câu hỏi chính xác",
    "✨ Hệ thống tự động kiểm tra chất lượng nội dung",
    "🎪 Trò chơi được tối ưu cho cả máy tính và điện thoại"
  ];

  const gameIcons = {
    quiz: Brain,
    flashcards: Target, 
    matching: Zap,
    memory: Star,
    ordering: Trophy,
    wordsearch: Sparkles,
    truefalse: Brain
  };

  const GameIcon = gameIcons[gameType as keyof typeof gameIcons] || Brain;

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 3000);

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage(prev => (prev + 1) % developmentStages.length);
    }, 2500);

    return () => clearInterval(stageInterval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-3xl p-10 mx-4 max-w-lg w-full border border-white/30 dark:border-slate-700/30 shadow-2xl"
          >
            {/* Background particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <BackgroundParticles particleCount={12} />
            </div>

            <div className="relative z-10 text-center space-y-8">
              {/* Main Brain Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity }
                }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl"
              >
                <GameIcon className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title */}
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-3">
                  Đang tạo trò chơi
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  AI đang xử lý yêu cầu của bạn
                </p>
                {topic && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
                    Chủ đề: {topic}
                  </p>
                )}
              </div>

              {/* Development Process Circles */}
              <div className="flex justify-center items-center space-x-4">
                {developmentStages.map((stage, index) => {
                  const StageIcon = stage.icon;
                  const isActive = index === currentStage;
                  const isCompleted = index < currentStage;
                  
                  return (
                    <motion.div
                      key={index}
                      className={`relative p-4 rounded-full border-2 transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-green-500/20 border-green-500' 
                          : isActive 
                            ? `${stage.bgColor} border-blue-500` 
                            : 'bg-slate-200/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <motion.div
                        animate={isActive ? {
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        } : {}}
                        transition={isActive ? {
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1.5, repeat: Infinity }
                        } : {}}
                      >
                        <StageIcon 
                          className={`w-6 h-6 ${
                            isCompleted 
                              ? 'text-green-500' 
                              : isActive 
                                ? stage.color 
                                : 'text-slate-400 dark:text-slate-500'
                          }`} 
                        />
                      </motion.div>
                      
                      {/* Stage name */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span className={`text-xs font-medium ${
                          isCompleted 
                            ? 'text-green-600 dark:text-green-400' 
                            : isActive 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {stage.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Loading Tips */}
              <div className="mt-12">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50"
                >
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    {loadingTips[currentTip]}
                  </p>
                </motion.div>
              </div>

              {/* Current Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-lg"
                >
                  {message}
                </motion.div>
              )}

              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <Sparkles className="w-7 h-7 text-yellow-400" />
                </motion.div>
              </div>

              <div className="absolute -bottom-3 -left-3">
                <motion.div
                  animate={{ 
                    rotate: [360, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    delay: 0.5
                  }}
                >
                  <Star className="w-6 h-6 text-blue-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameLoading;


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, Target, Trophy, Star } from 'lucide-react';
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

  const loadingTips = [
    "💡 AI đang phân tích chủ đề của bạn...",
    "🎯 Đang tạo ra những câu hỏi thú vị...", 
    "⚡ Tối ưu hóa độ khó phù hợp...",
    "🎨 Thiết kế giao diện tương tác...",
    "🚀 Chuẩn bị trải nghiệm tuyệt vời..."
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
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 mx-4 max-w-md w-full border border-white/20 dark:border-slate-700/20 shadow-2xl"
          >
            {/* Background particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <BackgroundParticles particleCount={8} />
            </div>

            <div className="relative z-10 text-center space-y-6">
              {/* Icon Animation */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <GameIcon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-2">
                  Đang tạo trò chơi
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI đang xử lý yêu cầu của bạn
                </p>
                {topic && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Chủ đề: {topic}
                  </p>
                )}
              </div>

              {/* Loading Icons instead of progress bar */}
              <div className="flex justify-center items-center space-x-3">
                {[Brain, Target, Zap, Star].map((Icon, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                    className="p-2 bg-blue-500/20 rounded-full"
                  >
                    <Icon className="w-4 h-4 text-blue-600" />
                  </motion.div>
                ))}
              </div>

              {/* Loading Tips */}
              <motion.div
                key={currentTip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-slate-600 dark:text-slate-400 min-h-[20px]"
              >
                {loadingTips[currentTip]}
              </motion.div>

              {/* Current Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg"
                >
                  {message}
                </motion.div>
              )}

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>

              <div className="absolute -bottom-2 -left-2">
                <motion.div
                  animate={{ 
                    rotate: [360, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: 0.5
                  }}
                >
                  <Star className="w-5 h-5 text-blue-400" />
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

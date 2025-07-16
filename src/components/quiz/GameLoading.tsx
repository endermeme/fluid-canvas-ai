
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, Target, Trophy, Star, Code, Lightbulb, Settings, FlaskConical } from 'lucide-react';


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
    { icon: FlaskConical, name: "Phân tích chủ đề", color: "text-blue-500", bgColor: "bg-blue-500/20" },
    { icon: Settings, name: "Tạo nội dung", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
    { icon: Code, name: "Tối ưu hóa", color: "text-purple-500", bgColor: "bg-purple-500/20" },
    { icon: Trophy, name: "Hoàn thành", color: "text-green-500", bgColor: "bg-green-500/20" }
  ];

  const loadingTips = [
    "💡 Mẹo: Bạn có thể tạo minigame theo nhiều chủ đề và độ khó khác nhau, từ trò chơi giáo dục đến giải trí.",
    "🎯 Mẹo: AI sử dụng thuật toán học máy để tạo câu hỏi phù hợp với cấp độ người học.",
    "⚡ Mẹo: Nội dung được tối ưu hóa cho trải nghiệm tương tác tốt nhất trên mọi thiết bị.",
    "🎨 Mẹo: Giao diện được thiết kế để tăng cường sự tập trung và khuyến khích tham gia.",
    "🚀 Mẹo: Mỗi trò chơi được tạo riêng biệt và có thể tùy chỉnh theo yêu cầu cụ thể.",
    "🧠 Mẹo: AI phân tích ngữ cảnh để tạo câu hỏi chính xác và phù hợp với chủ đề.",
    "✨ Mẹo: Hệ thống tự động kiểm tra chất lượng nội dung trước khi xuất bản.",
    "🎪 Mẹo: Trò chơi được tối ưu cho cả máy tính và điện thoại để trải nghiệm tốt nhất."
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
    }, 4000);

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage(prev => (prev + 1) % developmentStages.length);
    }, 2000);

    return () => clearInterval(stageInterval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-3xl p-12 mx-4 max-w-xl w-full shadow-2xl border border-gray-200/50"
          >

            <div className="relative z-10 text-center space-y-10">
              {/* Main rotating brain icon with circular progress */}
              <div className="relative mx-auto w-24 h-24">
                {/* Circular progress ring */}
                <svg className="absolute inset-0 w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    className="text-blue-500"
                    initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                    animate={{ 
                      strokeDashoffset: `${283 - (283 * (currentStage + 1)) / developmentStages.length}`
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </svg>
                
                {/* Brain icon in center */}
                <motion.div
                  animate={{ 
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <GameIcon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                  Đang tạo minigame...
                </h2>
                <p className="text-gray-600 text-sm">
                  Đang tạo minigame cho chủ đề. Quá trình này có thể mất một chút thời gian.
                </p>
                {topic && (
                  <p className="text-sm text-blue-600 mt-2 font-medium">
                    {topic}
                  </p>
                )}
              </div>

              {/* Development stages with icons */}
              <div className="flex justify-center items-center space-x-6">
                {developmentStages.map((stage, index) => {
                  const StageIcon = stage.icon;
                  const isActive = index === currentStage;
                  const isCompleted = index < currentStage;
                  
                  return (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center space-y-2"
                    >
                      <motion.div
                        className={`relative p-3 rounded-full border-2 transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-green-500/20 border-green-500' 
                            : isActive 
                              ? `${stage.bgColor} border-blue-500` 
                              : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        <motion.div
                          animate={isActive ? {
                            rotate: [0, 360]
                          } : isCompleted ? {
                            rotate: 0
                          } : {}}
                          transition={isActive ? {
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                          } : isCompleted ? {
                            rotate: { duration: 0.5, ease: "easeOut" }
                          } : {}}
                        >
                          <StageIcon 
                            className={`w-5 h-5 ${
                              isCompleted 
                                ? 'text-green-500' 
                                : isActive 
                                  ? stage.color 
                                  : 'text-gray-400'
                            }`} 
                          />
                        </motion.div>
                        
                        {/* Checkmark for completed stages */}
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                      
                      {/* Stage name */}
                      <span className={`text-xs font-medium ${
                        isCompleted 
                          ? 'text-green-600' 
                          : isActive 
                            ? 'text-blue-600' 
                            : 'text-gray-500'
                      }`}>
                        {stage.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Current stage indicator */}
              <motion.div 
                className="text-center"
                key={currentStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-blue-600 font-medium">
                  {developmentStages[currentStage]?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Giai đoạn {currentStage + 1} / {developmentStages.length}
                </p>
              </motion.div>

              {/* Loading Tips */}
              <div className="mt-8">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-blue-50 p-4 rounded-xl border border-blue-100"
                >
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {loadingTips[currentTip]}
                  </p>
                </motion.div>
              </div>

              {/* Current Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg"
                >
                  {message}
                </motion.div>
              )}

              {/* Floating decorative elements */}
              <div className="absolute -top-2 -right-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 6, 
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
                    duration: 5, 
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

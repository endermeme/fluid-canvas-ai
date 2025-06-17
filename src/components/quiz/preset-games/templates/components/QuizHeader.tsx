
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  totalTimeLeft: number;
  score: number;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  timeLeft,
  totalTimeLeft,
  score
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const minutesLeft = Math.floor(totalTimeLeft / 60);
  const secondsLeft = totalTimeLeft % 60;
  const formattedTotalTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-shrink-0 p-6 sm:p-8"
    >
      <div className="flex justify-between items-center mb-4">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-base font-semibold px-4 py-2.5 bg-primary/15 backdrop-blur-sm rounded-full border border-primary/20"
        >
          Câu hỏi {currentQuestion + 1}/{totalQuestions}
        </motion.div>
        
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center px-4 py-2.5 bg-primary/15 backdrop-blur-sm rounded-full border border-primary/20"
          >
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <span className="font-semibold text-lg">{timeLeft}s</span>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center px-4 py-2.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/15"
          >
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-base">{formattedTotalTime}</span>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-2.5 bg-primary/15 backdrop-blur-sm rounded-full border border-primary/20"
          >
            <span className="text-base">Điểm: <span className="font-bold text-lg">{score}</span></span>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Progress value={progress} className="h-3 bg-secondary/50 backdrop-blur-sm" />
      </motion.div>
    </motion.div>
  );
};

export default QuizHeader;

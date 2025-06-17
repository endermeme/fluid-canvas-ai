
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizResultsViewProps {
  score: number;
  totalQuestions: number;
  gameTitle: string;
  topic: string;
  totalTimeLeft: number;
  onRestart: () => void;
}

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  score,
  totalQuestions,
  gameTitle,
  topic,
  totalTimeLeft,
  onRestart
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-screen max-h-screen overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-blue-50/80 via-sky-50/80 to-blue-100/80 dark:from-blue-950/80 dark:via-sky-950/80 dark:to-blue-950/80"
    >
      <Card className="max-w-lg w-full p-8 sm:p-10 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20 shadow-xl">
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold mb-6 text-primary"
        >
          Kết Quả
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl mb-6"
        >
          Chủ đề: <span className="font-semibold">{gameTitle || topic}</span>
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex justify-between mb-3">
            <span className="text-lg">Điểm của bạn</span>
            <span className="font-bold text-xl">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-4 bg-secondary" />
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="text-4xl sm:text-5xl font-bold mb-8 text-primary"
        >
          {score} / {totalQuestions}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base mb-6 text-muted-foreground"
        >
          Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button onClick={onRestart} size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg py-6">
            <RefreshCw className="mr-3 h-5 w-5" />
            Chơi Lại
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default QuizResultsView;

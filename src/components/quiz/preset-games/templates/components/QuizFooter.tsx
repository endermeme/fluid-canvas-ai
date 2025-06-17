
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizFooterProps {
  isLastQuestion: boolean;
  onRestart: () => void;
  onNextQuestion: () => void;
}

const QuizFooter: React.FC<QuizFooterProps> = ({
  isLastQuestion,
  onRestart,
  onNextQuestion
}) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-shrink-0 p-6 sm:p-8"
    >
      <div className="max-w-4xl mx-auto flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onRestart}
          className="bg-white/70 backdrop-blur-sm border-primary/20 hover:bg-white/90 flex-1 text-lg py-6"
        >
          <RefreshCw className="h-5 w-5 mr-3" />
          Làm lại
        </Button>
        
        <Button 
          onClick={onNextQuestion} 
          size="lg"
          className="flex-2 min-w-0 text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl"
        >
          {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
          <ChevronRight className="h-5 w-5 ml-3" />
        </Button>
      </div>
    </motion.div>
  );
};

export default QuizFooter;

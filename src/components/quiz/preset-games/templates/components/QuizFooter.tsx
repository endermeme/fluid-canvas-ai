
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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-primary/10 shadow-lg"
    >
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onRestart}
            className="bg-white/70 backdrop-blur-sm border-primary/20 hover:bg-white/90 text-base font-medium py-3 sm:py-4 px-6"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Làm lại
          </Button>
          
          <Button 
            onClick={onNextQuestion} 
            size="lg"
            className="flex-1 text-base font-medium py-3 sm:py-4 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="mr-2">
              {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
            </span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizFooter;

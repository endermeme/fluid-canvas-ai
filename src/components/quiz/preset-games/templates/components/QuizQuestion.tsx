
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestionProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  currentQuestion: number;
  selectedOption: number | null;
  isAnswered: boolean;
  onOptionSelect: (optionIndex: number) => void;
  onNextQuestion: () => void;
  onRestart: () => void;
  isLastQuestion: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentQuestion,
  selectedOption,
  isAnswered,
  onOptionSelect,
  onNextQuestion,
  onRestart,
  isLastQuestion
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm border-primary/20 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-primary leading-relaxed text-center">
              {question.question}
            </h2>
            
            <div className="space-y-3 mb-6">
              <AnimatePresence>
                {question.options.map((option: string, index: number) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === question.correctAnswer;
                  const showCorrect = isAnswered && isCorrect;
                  const showIncorrect = isAnswered && isSelected && !isCorrect;
                  
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={!isAnswered ? { scale: 1.01, y: -2 } : {}}
                      whileTap={!isAnswered ? { scale: 0.99 } : {}}
                      onClick={() => onOptionSelect(index)}
                      disabled={isAnswered}
                      className={`
                        w-full p-4 sm:p-5 text-left rounded-xl transition-all duration-300 border-2 
                        ${showCorrect
                          ? 'bg-gradient-to-r from-green-100/90 to-green-50/90 border-green-400 shadow-lg shadow-green-200/50 dark:from-green-900/40 dark:to-green-800/30 dark:border-green-500' 
                          : showIncorrect
                            ? 'bg-gradient-to-r from-red-100/90 to-red-50/90 border-red-400 shadow-lg shadow-red-200/50 dark:from-red-900/40 dark:to-red-800/30 dark:border-red-500'
                            : isAnswered && isCorrect
                              ? 'bg-gradient-to-r from-green-100/90 to-green-50/90 border-green-400 shadow-lg shadow-green-200/50 dark:from-green-900/40 dark:to-green-800/30 dark:border-green-500'
                              : 'bg-gradient-to-r from-white/90 to-gray-50/90 border-gray-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 dark:from-slate-800/90 dark:to-slate-700/90 dark:border-slate-600'
                        }
                        ${!isAnswered ? 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/15 cursor-pointer' : 'cursor-default'}
                      `}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          {showCorrect ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </motion.div>
                          ) : showIncorrect ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </motion.div>
                          ) : (
                            <div className={`
                              h-6 w-6 rounded-full border-2 flex items-center justify-center text-sm font-bold
                              ${isAnswered && isCorrect 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'bg-primary/10 border-primary/30 text-primary/70'
                              }
                            `}>
                              {String.fromCharCode(65 + index)}
                            </div>
                          )}
                        </div>
                        
                        <span className={`
                          text-base sm:text-lg leading-relaxed
                          ${showCorrect 
                            ? 'text-green-800 dark:text-green-200 font-semibold' 
                            : showIncorrect 
                              ? 'text-red-800 dark:text-red-200 font-medium' 
                              : 'text-foreground'
                          }
                        `}>
                          {option}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Các nút điều khiển được đặt trong body */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="pt-4 border-t border-primary/10"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onRestart}
                  className="bg-white/70 backdrop-blur-sm border-primary/20 hover:bg-white/90 text-sm font-medium py-2.5 px-5"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm lại
                </Button>
                
                <Button 
                  onClick={onNextQuestion} 
                  size="lg"
                  className="flex-1 text-sm font-medium py-2.5 px-5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="mr-2">
                    {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizQuestion;

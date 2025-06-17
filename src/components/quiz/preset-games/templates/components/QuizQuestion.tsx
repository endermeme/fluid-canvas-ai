
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
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
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentQuestion,
  selectedOption,
  isAnswered,
  onOptionSelect
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-auto p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 sm:p-10 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm border-primary/20 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-primary leading-relaxed text-center">
              {question.question}
            </h2>
            
            <div className="space-y-5">
              <AnimatePresence>
                {question.options.map((option: string, index: number) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === question.correctAnswer;
                  const showCorrect = isAnswered && isCorrect;
                  const showIncorrect = isAnswered && isSelected && !isCorrect;
                  
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.4 }}
                      whileHover={!isAnswered ? { scale: 1.02, y: -3 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      onClick={() => onOptionSelect(index)}
                      disabled={isAnswered}
                      className={`
                        w-full p-6 sm:p-8 text-left rounded-2xl transition-all duration-300 border-2 
                        ${showCorrect
                          ? 'bg-gradient-to-r from-green-100/90 to-green-50/90 border-green-400 shadow-xl shadow-green-200/50 dark:from-green-900/40 dark:to-green-800/30 dark:border-green-500' 
                          : showIncorrect
                            ? 'bg-gradient-to-r from-red-100/90 to-red-50/90 border-red-400 shadow-xl shadow-red-200/50 dark:from-red-900/40 dark:to-red-800/30 dark:border-red-500'
                            : isAnswered && isCorrect
                              ? 'bg-gradient-to-r from-green-100/90 to-green-50/90 border-green-400 shadow-xl shadow-green-200/50 dark:from-green-900/40 dark:to-green-800/30 dark:border-green-500'
                              : 'bg-gradient-to-r from-white/90 to-gray-50/90 border-gray-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 dark:from-slate-800/90 dark:to-slate-700/90 dark:border-slate-600'
                        }
                        ${!isAnswered ? 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/15 cursor-pointer' : 'cursor-default'}
                      `}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-6">
                          {showCorrect ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </motion.div>
                          ) : showIncorrect ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </motion.div>
                          ) : (
                            <div className={`
                              h-8 w-8 rounded-full border-2 flex items-center justify-center text-base font-bold
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
                          text-lg sm:text-xl leading-relaxed
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
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizQuestion;

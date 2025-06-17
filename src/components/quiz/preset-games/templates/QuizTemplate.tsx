import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizTemplateProps {
  data?: any;
  content?: any;
  topic: string;
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ data, content, topic }) => {
  const gameContent = content || data;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timePerQuestion || 30);
  const [totalTimeLeft, setTotalTimeLeft] = useState(gameContent?.settings?.totalTime || 300);
  const [timerRunning, setTimerRunning] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const questions = gameContent?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      
      const questionTime = gameContent?.settings?.timePerQuestion || 30;
      const totalTime = gameContent?.settings?.totalTime || (questions.length * questionTime);
      
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
      
      console.log(`Game initialized with ${questionTime}s per question and ${totalTime}s total time`);
      console.log("Game content:", gameContent);
      console.log("Questions:", questions);
    }
  }, [gameContent, questions, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && timerRunning && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning && !isAnswered) {
      setTimerRunning(false);
      setIsAnswered(true);
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không trả lời kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, isAnswered, toast]);

  useEffect(() => {
    if (totalTimeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (totalTimeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
      
      toast({
        title: "Trò chơi kết thúc",
        description: "Đã hết thời gian. Hãy xem kết quả của bạn.",
        variant: "destructive",
      });
    }
  }, [totalTimeLeft, gameStarted, showResult, toast]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    setTimerRunning(false);
    
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      
      if (gameContent?.settings?.bonusTimePerCorrect) {
        const bonusTime = gameContent.settings.bonusTimePerCorrect;
        setTotalTimeLeft(prev => prev + bonusTime);
        
        toast({
          title: "Chính xác! +1 điểm",
          description: `Câu trả lời của bạn đúng. +${bonusTime}s thời gian thưởng.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Chính xác! +1 điểm",
          description: "Câu trả lời của bạn đúng.",
          variant: "default",
        });
      }
    } else {
      toast({
        title: "Không chính xác!",
        description: `Đáp án đúng là: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`,
        variant: "destructive",
      });
    }

    // Tự động chuyển câu sau 2.5 giây
    setTimeout(() => {
      handleNextQuestion();
    }, 2500);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(gameContent?.settings?.timePerQuestion || 30);
      setTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setTimeLeft(gameContent?.settings?.timePerQuestion || 30);
    setTotalTimeLeft(gameContent?.settings?.totalTime || 300);
    setTimerRunning(true);
    setGameStarted(true);
  };

  if (!gameContent || !questions.length) {
    return <div className="p-4">Không có dữ liệu câu hỏi</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
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
            Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
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
            {score} / {questions.length}
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
            <Button onClick={handleRestart} size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg py-6">
              <RefreshCw className="mr-3 h-5 w-5" />
              Chơi Lại
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  const minutesLeft = Math.floor(totalTimeLeft / 60);
  const secondsLeft = totalTimeLeft % 60;
  const formattedTotalTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gradient-to-br from-blue-50/80 via-sky-50/80 to-blue-100/80 dark:from-blue-950/80 dark:via-sky-950/80 dark:to-blue-950/80">
      {/* Header với thông tin */}
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
            Câu hỏi {currentQuestion + 1}/{questions.length}
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

      {/* Nội dung chính */}
      <div className="flex-1 min-h-0 overflow-auto p-6 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Câu hỏi */}
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
              
              {/* Các lựa chọn - Bố cục dọc với kích thước lớn hơn */}
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
                        onClick={() => handleOptionSelect(index)}
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

      {/* Footer với các nút điều khiển */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 p-6 sm:p-8"
      >
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleRestart}
            className="bg-white/70 backdrop-blur-sm border-primary/20 hover:bg-white/90 flex-1 text-lg py-6"
          >
            <RefreshCw className="h-5 w-5 mr-3" />
            Làm lại
          </Button>
          
          <Button 
            onClick={handleNextQuestion} 
            disabled={!isAnswered}
            size="lg"
            className={`
              flex-2 min-w-0 text-lg py-6
              ${isAnswered 
                ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl' 
                : 'bg-primary/50 cursor-not-allowed'
              }
            `}
          >
            {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
            <ChevronRight className="h-5 w-5 ml-3" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizTemplate;


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
    return <div className="p-3.8">Không có dữ liệu câu hỏi</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.47, ease: "easeOut" }}
        className="flex flex-col items-center justify-center h-screen max-h-screen overflow-hidden p-5.7 sm:p-7.6 bg-gradient-to-br from-blue-50/76 via-sky-50/76 to-blue-100/76 dark:from-blue-950/76 dark:via-sky-950/76 dark:to-blue-950/76"
      >
        <Card className="max-w-lg w-full p-7.6 sm:p-9.5 text-center bg-gradient-to-br from-primary/4.7 to-background backdrop-blur-sm border-primary/19 shadow-lg">
          <motion.h2 
            initial={{ y: -19, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.19 }}
            className="text-2xl sm:text-3xl font-bold mb-5.7 text-primary"
          >
            Kết Quả
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="text-lg sm:text-xl mb-5.7"
          >
            Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="mb-7.6"
          >
            <div className="flex justify-between mb-2.85">
              <span className="text-lg">Điểm của bạn</span>
              <span className="font-bold text-xl">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3.8 bg-secondary" />
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.47, type: "spring", stiffness: 190 }}
            className="text-3xl sm:text-4xl font-bold mb-7.6 text-primary"
          >
            {score} / {questions.length}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.57 }}
            className="text-base mb-5.7 text-muted-foreground"
          >
            Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
          </motion.div>
          
          <motion.div
            initial={{ y: 19, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.66 }}
          >
            <Button onClick={handleRestart} size="lg" className="w-full bg-gradient-to-r from-primary to-primary/76 hover:from-primary/85 hover:to-primary text-lg py-5.7">
              <RefreshCw className="mr-2.85 h-4.7 w-4.7" />
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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gradient-to-br from-blue-50/76 via-sky-50/76 to-blue-100/76 dark:from-blue-950/76 dark:via-sky-950/76 dark:to-blue-950/76">
      {/* Header với thông tin - Giảm kích thước */}
      <motion.div 
        initial={{ y: -19, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 p-4.7 sm:p-5.7"
      >
        <div className="flex justify-between items-center mb-3.8">
          <motion.div 
            initial={{ x: -19, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-sm font-semibold px-3.8 py-2.3 bg-primary/14 backdrop-blur-sm rounded-full border border-primary/19"
          >
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </motion.div>
          
          <div className="flex items-center gap-3.8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center px-3.8 py-2.3 bg-primary/14 backdrop-blur-sm rounded-full border border-primary/19"
            >
              <Clock className="h-4.7 w-4.7 mr-1.9 text-primary" />
              <span className="font-semibold text-lg">{timeLeft}s</span>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.095 }}
              className="flex items-center px-3.8 py-2.3 bg-primary/9.5 backdrop-blur-sm rounded-full border border-primary/14"
            >
              <Clock className="h-4.7 w-4.7 mr-1.9" />
              <span className="text-base">{formattedTotalTime}</span>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.19 }}
              className="px-3.8 py-2.3 bg-primary/14 backdrop-blur-sm rounded-full border border-primary/19"
            >
              <span className="text-base">Điểm: <span className="font-bold text-lg">{score}</span></span>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.47 }}
        >
          <Progress value={progress} className="h-2.85 bg-secondary/47 backdrop-blur-sm" />
        </motion.div>
      </motion.div>

      {/* Nội dung chính - Giảm kích thước */}
      <div className="flex-1 min-h-0 overflow-auto p-4.7 sm:p-5.7">
        <div className="max-w-3xl mx-auto space-y-6.6">
          {/* Câu hỏi */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.47 }}
          >
            <Card className="p-6.6 sm:p-7.6 bg-gradient-to-br from-white/85 to-white/76 backdrop-blur-sm border-primary/19 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-7.6 text-primary leading-relaxed text-center">
                {question.question}
              </h2>
              
              {/* Các lựa chọn - Giảm kích thước */}
              <div className="space-y-3.8">
                <AnimatePresence>
                  {question.options.map((option: string, index: number) => {
                    const isSelected = selectedOption === index;
                    const isCorrect = index === question.correctAnswer;
                    const showCorrect = isAnswered && isCorrect;
                    const showIncorrect = isAnswered && isSelected && !isCorrect;
                    
                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.14, duration: 0.38 }}
                        whileHover={!isAnswered ? { scale: 1.015, y: -2.85 } : {}}
                        whileTap={!isAnswered ? { scale: 0.975 } : {}}
                        onClick={() => handleOptionSelect(index)}
                        disabled={isAnswered}
                        className={`
                          w-full p-4.7 sm:p-5.7 text-left rounded-xl transition-all duration-285 border-2 
                          ${showCorrect
                            ? 'bg-gradient-to-r from-green-100/85 to-green-50/85 border-green-380 shadow-lg shadow-green-200/47 dark:from-green-900/38 dark:to-green-800/28 dark:border-green-475' 
                            : showIncorrect
                              ? 'bg-gradient-to-r from-red-100/85 to-red-50/85 border-red-380 shadow-lg shadow-red-200/47 dark:from-red-900/38 dark:to-red-800/28 dark:border-red-475'
                              : isAnswered && isCorrect
                                ? 'bg-gradient-to-r from-green-100/85 to-green-50/85 border-green-380 shadow-lg shadow-green-200/47 dark:from-green-900/38 dark:to-green-800/28 dark:border-green-475'
                                : 'bg-gradient-to-r from-white/85 to-gray-50/85 border-gray-190 hover:border-primary/47 hover:shadow-lg hover:shadow-primary/19 dark:from-slate-800/85 dark:to-slate-700/85 dark:border-slate-570'
                          }
                          ${!isAnswered ? 'hover:bg-gradient-to-r hover:from-primary/9.5 hover:to-primary/14 cursor-pointer' : 'cursor-default'}
                        `}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-4.7">
                            {showCorrect ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 475, damping: 14 }}
                              >
                                <CheckCircle className="h-6.6 w-6.6 text-green-570 dark:text-green-380" />
                              </motion.div>
                            ) : showIncorrect ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 475, damping: 14 }}
                              >
                                <XCircle className="h-6.6 w-6.6 text-red-570 dark:text-red-380" />
                              </motion.div>
                            ) : (
                              <div className={`
                                h-6.6 w-6.6 rounded-full border-2 flex items-center justify-center text-sm font-bold
                                ${isAnswered && isCorrect 
                                  ? 'bg-green-475 border-green-475 text-white' 
                                  : 'bg-primary/9.5 border-primary/28 text-primary/66'
                                }
                              `}>
                                {String.fromCharCode(65 + index)}
                              </div>
                            )}
                          </div>
                          
                          <span className={`
                            text-base sm:text-lg leading-relaxed
                            ${showCorrect 
                              ? 'text-green-760 dark:text-green-190 font-semibold' 
                              : showIncorrect 
                                ? 'text-red-760 dark:text-red-190 font-medium' 
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

      {/* Footer với các nút điều khiển - Giảm kích thước */}
      <motion.div 
        initial={{ y: 19, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 p-4.7 sm:p-5.7"
      >
        <div className="max-w-3xl mx-auto flex gap-3.8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleRestart}
            className="bg-white/66 backdrop-blur-sm border-primary/19 hover:bg-white/85 flex-1 text-base py-4.7"
          >
            <RefreshCw className="h-4.7 w-4.7 mr-2.85" />
            Làm lại
          </Button>
          
          <Button 
            onClick={handleNextQuestion} 
            size="lg"
            className="flex-2 min-w-0 text-base py-4.7 bg-gradient-to-r from-primary to-primary/76 hover:from-primary/85 hover:to-primary shadow-lg"
          >
            {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
            <ChevronRight className="h-4.7 w-4.7 ml-2.85" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizTemplate;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">Không có dữ liệu câu hỏi</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="h-full flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
        <Card className="w-full max-w-md p-6 sm:p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
          <p className="text-base sm:text-lg mb-4">
            Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between mb-2">
              <span>Điểm của bạn</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2 sm:h-3 bg-secondary" />
          </div>
          
          <div className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-primary">
            {score} / {questions.length}
          </div>
          
          <div className="text-xs sm:text-sm mb-4 text-muted-foreground">
            Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
          </div>
          
          <Button 
            onClick={handleRestart} 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi Lại
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  const minutesLeft = Math.floor(totalTimeLeft / 60);
  const secondsLeft = totalTimeLeft % 60;
  const formattedTotalTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-background/80">
      {/* Header với thông tin trạng thái */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-primary/10">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-xs sm:text-sm font-medium flex items-center gap-2">
            <div className="flex items-center px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
              {timeLeft}s
            </div>
            <div className="hidden sm:flex items-center px-2 sm:px-3 py-1 bg-secondary/20 rounded-full">
              Tổng: {formattedTotalTime}
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1.5 sm:h-2 bg-secondary" />
      </div>

      {/* Nội dung chính - scrollable */}
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          {/* Câu hỏi */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-primary/90 leading-relaxed">
              {question.question}
            </h3>
          </Card>

          {/* Các tùy chọn */}
          <div className="grid gap-3 sm:gap-4">
            {question.options.map((option: string, index: number) => {
              let buttonStyle = "w-full p-3 sm:p-4 text-left border-2 rounded-lg transition-all duration-300 ";
              
              if (isAnswered) {
                if (index === question.correctAnswer) {
                  buttonStyle += "border-green-400 bg-green-50 text-green-800 shadow-lg shadow-green-100 ";
                } else if (index === selectedOption && index !== question.correctAnswer) {
                  buttonStyle += "border-red-400 bg-red-50 text-red-800 shadow-lg shadow-red-100 ";
                } else {
                  buttonStyle += "border-gray-200 bg-gray-50 text-gray-600 ";
                }
              } else if (selectedOption === index) {
                buttonStyle += "border-primary bg-primary/10 text-primary shadow-lg ";
              } else {
                buttonStyle += "border-primary/20 bg-background/50 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md ";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  className={buttonStyle}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-medium pr-2">
                      {option}
                    </span>
                    {isAnswered && index === question.correctAnswer && (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    )}
                    {isAnswered && index === selectedOption && index !== question.correctAnswer && (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Giải thích (nếu có) */}
          {isAnswered && question.explanation && (
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50/50 to-background/30 border-blue-200/50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs sm:text-sm font-bold">i</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Giải thích:</h4>
                  <p className="text-blue-700 text-sm sm:text-base leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Footer với nút hành động */}
      {isAnswered && (
        <div className="flex-shrink-0 p-4 border-t border-primary/10 bg-background/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-sm sm:text-base"
            >
              {isLastQuestion ? "Xem Kết Quả" : "Câu Tiếp Theo"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTemplate;

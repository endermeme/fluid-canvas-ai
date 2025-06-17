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
      <div className="h-full flex items-center justify-center p-4 bg-white">
        <Card className="w-full max-w-md p-6 sm:p-8 text-center bg-white border">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Kết Quả</h2>
          <p className="text-base sm:text-lg mb-4">
            Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between mb-2">
              <span>Điểm của bạn</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2 sm:h-3" />
          </div>
          
          <div className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-foreground">
            {score} / {questions.length}
          </div>
          
          <div className="text-xs sm:text-sm mb-4 text-muted-foreground">
            Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
          </div>
          
          <Button 
            onClick={handleRestart} 
            className="w-full"
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
    <div className="h-full flex flex-col bg-white">
      {/* Header với thông tin trạng thái */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-border">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-muted rounded-full">
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-xs sm:text-sm font-medium flex items-center gap-2">
            <div className="flex items-center px-2 sm:px-3 py-1 bg-muted rounded-full">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-foreground" />
              {timeLeft}s
            </div>
            <div className="hidden sm:flex items-center px-2 sm:px-3 py-1 bg-muted rounded-full">
              Tổng: {formattedTotalTime}
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1.5 sm:h-2" />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-4 lg:p-6 max-w-2xl xl:max-w-3xl mx-auto">
            <div className="space-y-4 sm:space-y-6">
              {/* Question */}
              <Card className="p-3 sm:p-4 lg:p-6 bg-white border">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-center leading-relaxed">
                  {question.question}
                </h2>
              </Card>

              {/* Options */}
              <div className="grid gap-2 sm:gap-3">
                {question.options.map((option: string, index: number) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = option === question.correctAnswer;
                  let buttonClass = "w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-300 ";
                  
                  if (isAnswered) {
                    if (isCorrect) {
                      buttonClass += "bg-green-50 border-green-300 text-green-800 shadow-lg transform scale-[1.02]";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-red-50 border-red-300 text-red-800";
                    } else {
                      buttonClass += "bg-muted/50 border-muted text-muted-foreground";
                    }
                  } else {
                    buttonClass += isSelected 
                      ? "bg-primary/10 border-primary text-primary shadow-md transform scale-[1.01]" 
                      : "bg-white border-border hover:bg-muted/50 hover:border-primary/50 hover:shadow-md hover:transform hover:scale-[1.01]";
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswered}
                      variant="outline"
                      className={buttonClass}
                    >
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 rounded-full bg-muted flex items-center justify-center text-xs sm:text-sm font-semibold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-sm sm:text-base font-medium break-words">
                          {option}
                        </span>
                        {isAnswered && isCorrect && (
                          <CheckCircle className="ml-auto text-green-600 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="ml-auto text-red-600 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Show explanation if available */}
              {isAnswered && question.explanation && (
                <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 sm:mr-3 mt-0.5">
                      <span className="text-blue-600 text-xs font-semibold">!</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1 text-sm sm:text-base">Giải thích:</h4>
                      <p className="text-blue-700 text-sm leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Footer với controls */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-border bg-white">
        <div className="max-w-2xl xl:max-w-3xl mx-auto flex gap-2 sm:gap-3">
          {isAnswered ? (
            <Button
              onClick={handleNextQuestion}
              className="flex-1 text-sm sm:text-base font-medium"
            >
              {isLastQuestion ? "Xem kết quả" : "Câu tiếp theo"}
              <ChevronRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => selectedOption && handleOptionSelect(selectedOption)}
              disabled={!selectedOption}
              className="flex-1 text-sm sm:text-base font-medium"
            >
              Xác nhận
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleRestart}
            className="text-sm sm:text-base"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizTemplate;

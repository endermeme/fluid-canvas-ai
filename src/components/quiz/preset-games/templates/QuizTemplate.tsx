import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, Clock, ChevronRight } from 'lucide-react';

interface QuizTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  settings?: any;
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ data, content, topic, settings }) => {
  const gameContent = content || data;
  
  // Game settings function
  const getGameSettings = () => ({
    timePerQuestion: 30,
    totalTime: 300,
    useTimer: true,
    bonusTime: 10,
    showExplanation: true,
    difficulty: "medium"
  });
  
  const gameSettings = getGameSettings();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameSettings.timePerQuestion);
  const [totalTimeLeft, setTotalTimeLeft] = useState(gameSettings.totalTime);
  const [timerRunning, setTimerRunning] = useState(gameSettings.useTimer);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const questions = gameContent?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      
      const questionTime = gameSettings.timePerQuestion;
      const totalTime = gameSettings.totalTime;
      
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
      setTimerRunning(gameSettings.useTimer);
      
      console.log(`Game initialized with ${questionTime}s per question and ${totalTime}s total time`);
      console.log("Game settings:", gameSettings);
      console.log("Questions:", questions);
    }
  }, [gameContent, questions, gameStarted, gameSettings]);

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
      
      if (gameSettings.bonusTime > 0) {
        const bonusTime = gameSettings.bonusTime;
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
      setTimeLeft(gameSettings.timePerQuestion);
      setTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
      setTimeLeft(gameSettings.timePerQuestion);
    setTotalTimeLeft(gameSettings.totalTime);
    setTimerRunning(true);
    setGameStarted(true);
  };

  if (!gameContent || !questions.length) {
    return (
      <div className="unified-game-container">
        <div className="game-content flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-primary">Không có dữ liệu câu hỏi</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="unified-game-container">
        <div className="game-content flex items-center justify-center">
          <Card className="compact-card p-6 sm:p-8 text-center bg-card border">
            <div className="mb-6">
              <div className="text-4xl sm:text-6xl mb-4">
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '💪'}
              </div>
              <h2 className="text-xl sm:text-3xl font-bold mb-2 text-primary">Kết Quả</h2>
              <p className="text-sm sm:text-lg text-primary">
                Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
              </p>
            </div>
            
            <div className="mb-8">
              <div className="text-3xl sm:text-5xl font-bold mb-4 text-primary">
                {score} / {questions.length}
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-primary">Điểm của bạn</span>
                <span className="font-bold text-primary">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
            
            <div className="text-sm mb-6 text-primary/70">
              Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
            </div>
            
            <div className="text-center text-sm text-primary/70">
              Sử dụng nút làm mới ở header để chơi lại
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  const minutesLeft = Math.floor(totalTimeLeft / 60);
  const secondsLeft = totalTimeLeft % 60;
  const formattedTotalTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="unified-game-container">
      {/* Header */}
      <div className="game-header">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 py-1 bg-muted rounded-full text-primary">
            Câu {currentQuestion + 1}/{questions.length}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center px-2 py-1 bg-muted rounded-full text-xs sm:text-sm font-medium">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
              <span className="text-primary">{timeLeft}s</span>
            </div>
            <div className="hidden sm:flex items-center px-2 py-1 bg-muted rounded-full text-xs sm:text-sm font-medium">
              <span className="text-primary">Tổng: {formattedTotalTime}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1.5 sm:h-2" />
      </div>

      {/* Main Content */}
      <div className="game-content">
        <div className="responsive-card mx-auto space-y-4 sm:space-y-6">
          {/* Question Card */}
          <Card className="p-4 sm:p-6 text-center bg-card border">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary leading-relaxed">
              {question.question}
            </h2>
          </Card>

          {/* Options Grid */}
          <div className="grid gap-2 sm:gap-3">
            {question.options.map((option: string, index: number) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === question.correctAnswer;
              let buttonClass = "w-full p-3 sm:p-4 text-left rounded-lg sm:rounded-xl border-2 transition-all duration-300 ";
              
              if (isAnswered) {
                if (isCorrect) {
                  buttonClass += "bg-green-50 border-green-400 text-green-800 shadow-lg transform scale-[1.01]";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-red-50 border-red-400 text-red-800 shadow-lg";
                } else {
                  buttonClass += "bg-muted border-border text-primary/60";
                }
              } else {
                buttonClass += isSelected 
                  ? "bg-primary/10 border-primary text-primary shadow-lg transform scale-[1.01] ring-2 ring-primary/20" 
                  : "bg-card border-border hover:bg-primary/5 hover:border-primary/30 hover:shadow-md hover:transform hover:scale-[1.01] text-primary";
              }

              return (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  variant="outline"
                  className={buttonClass}
                >
                  <div className="flex items-center w-full">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full bg-muted flex items-center justify-center text-xs sm:text-sm font-bold text-primary">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm sm:text-base font-medium flex-1 text-left">
                      {option}
                    </span>
                    {isAnswered && isCorrect && (
                      <CheckCircle className="ml-2 sm:ml-3 text-green-600 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="ml-2 sm:ml-3 text-red-600 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && question.explanation && gameSettings.showExplanation && (
            <Card className="p-3 sm:p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 sm:mr-3 mt-0.5">
                  <span className="text-primary text-xs sm:text-sm font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Giải thích:</h4>
                  <p className="text-primary/80 leading-relaxed text-sm sm:text-base">{question.explanation}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="game-controls">
        <div className="responsive-card mx-auto">
          <div className="flex gap-3">
            {isAnswered ? (
              <Button
                onClick={handleNextQuestion}
                className="flex-1 py-2 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg sm:rounded-xl"
                size="lg"
              >
                {isLastQuestion ? "Xem kết quả" : "Câu tiếp theo"}
                <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            ) : (
              <Button
                onClick={() => selectedOption !== null && handleOptionSelect(selectedOption)}
                disabled={selectedOption === null}
                className="flex-1 py-2 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg sm:rounded-xl"
                size="lg"
              >
                Xác nhận
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTemplate;

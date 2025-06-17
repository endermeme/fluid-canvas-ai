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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">Không có dữ liệu câu hỏi</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-lg p-8 text-center shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="mb-6">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '💪'}
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Kết Quả</h2>
            <p className="text-lg text-gray-600">
              Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
            </p>
          </div>
          
          <div className="mb-8">
            <div className="text-5xl font-bold mb-4 text-primary">
              {score} / {questions.length}
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Điểm của bạn</span>
              <span className="font-bold text-gray-800">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          
          <div className="text-sm mb-6 text-gray-500">
            Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
          </div>
          
          <Button 
            onClick={handleRestart} 
            className="w-full py-3 text-lg font-semibold"
            size="lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 pb-28">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-semibold px-4 py-2 bg-primary/10 text-primary rounded-full">
              Câu {currentQuestion + 1}/{questions.length}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center px-3 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4 mr-1" />
                {timeLeft}s
              </div>
              <div className="hidden sm:flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                Tổng: {formattedTotalTime}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Centered Main Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          {/* Question Card */}
          <Card className="p-6 lg:p-8 text-center shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 leading-relaxed">
              {question.question}
            </h2>
          </Card>

          {/* Options Grid */}
          <div className="grid gap-4 lg:gap-5">
            {question.options.map((option: string, index: number) => {
              const isSelected = selectedOption === index;
              const isCorrect = option === question.correctAnswer;
              let buttonClass = "w-full p-5 lg:p-6 text-left rounded-xl border-2 transition-all duration-300 shadow-sm ";
              
              if (isAnswered) {
                if (isCorrect) {
                  buttonClass += "bg-green-50 border-green-400 text-green-800 shadow-lg transform scale-[1.02]";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-red-50 border-red-400 text-red-800 shadow-lg";
                } else {
                  buttonClass += "bg-gray-50 border-gray-200 text-gray-500";
                }
              } else {
                buttonClass += isSelected 
                  ? "bg-primary/10 border-primary text-primary shadow-lg transform scale-[1.01] ring-2 ring-primary/20" 
                  : "bg-white border-gray-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md hover:transform hover:scale-[1.01]";
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
                    <span className="flex-shrink-0 w-9 h-9 mr-4 rounded-full bg-gray-100 flex items-center justify-center text-base font-bold text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-base lg:text-lg xl:text-xl font-medium flex-1 text-left">
                      {option}
                    </span>
                    {isAnswered && isCorrect && (
                      <CheckCircle className="ml-4 text-green-600 h-6 w-6 flex-shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="ml-4 text-red-600 h-6 w-6 flex-shrink-0" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && question.explanation && (
            <Card className="p-5 lg:p-6 bg-blue-50 border-blue-200 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-700 text-sm font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Giải thích:</h4>
                  <p className="text-blue-700 leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-10">
        <div className="p-5 safe-area-padding-bottom">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              {isAnswered ? (
                <Button
                  onClick={handleNextQuestion}
                  className="flex-1 py-4 text-lg font-semibold rounded-xl shadow-md"
                  size="lg"
                >
                  {isLastQuestion ? "Xem kết quả" : "Câu tiếp theo"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={() => selectedOption !== null && handleOptionSelect(selectedOption)}
                  disabled={selectedOption === null}
                  className="flex-1 py-4 text-lg font-semibold rounded-xl shadow-md"
                  size="lg"
                >
                  Xác nhận
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleRestart}
                className="px-8 py-4 rounded-xl border-2 shadow-md"
                size="lg"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTemplate;

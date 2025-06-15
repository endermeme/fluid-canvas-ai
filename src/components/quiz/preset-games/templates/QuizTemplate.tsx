import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, Clock, ChevronRight, Trophy, Sparkles, Target } from 'lucide-react';

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
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [ripplePosition, setRipplePosition] = useState<{x: number, y: number} | null>(null);
  const { toast } = useToast();

  const questions = gameContent?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const useTimer = gameContent?.settings?.useTimer !== false;

  // Initialize game when questions are available
  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      const questionTime = gameContent?.settings?.timePerQuestion || 30;
      const totalTime = gameContent?.settings?.totalTime || (questions.length * questionTime);
      
      setTimeLeft(useTimer ? questionTime : 0);
      setTotalTimeLeft(useTimer ? totalTime : 0);
      setTimerRunning(useTimer);
      setGameStarted(true);
    }
  }, [gameContent, questions, gameStarted, useTimer]);

  // Question timer
  useEffect(() => {
    if (useTimer && timeLeft > 0 && timerRunning && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (useTimer && timeLeft === 0 && timerRunning && !isAnswered) {
      setTimerRunning(false);
      setIsAnswered(true);
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không trả lời kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, isAnswered, useTimer, toast]);

  // Total timer
  useEffect(() => {
    if (useTimer && totalTimeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTotalTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (useTimer && totalTimeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
      
      toast({
        title: "Trò chơi kết thúc",
        description: "Đã hết thời gian. Hãy xem kết quả của bạn.",
        variant: "destructive",
      });
    }
  }, [totalTimeLeft, gameStarted, showResult, useTimer, toast]);

  const handleOptionSelect = (optionIndex: number, event: React.MouseEvent) => {
    if (isAnswered || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedOption(optionIndex);
    
    // Create ripple effect
    const rect = event.currentTarget.getBoundingClientRect();
    setRipplePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    
    setTimeout(() => {
      setIsAnswered(true);
      setTimerRunning(false);
      
      const isCorrect = optionIndex === questions[currentQuestion].correctAnswer;
      if (isCorrect) {
        setScore(prev => prev + 1);
        
        const bonusTime = gameContent?.settings?.bonusTime || 0;
        if (useTimer && bonusTime > 0) {
          setTotalTimeLeft(prev => prev + bonusTime);
          
          toast({
            title: "Chính xác! ✨ +1 điểm",
            description: `Câu trả lời đúng. +${bonusTime}s thời gian thưởng.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Chính xác! ✨ +1 điểm",
            description: "Câu trả lời của bạn đúng.",
            variant: "default",
          });
        }
      } else {
        const correctAnswer = questions[currentQuestion].options[questions[currentQuestion].correctAnswer];
        toast({
          title: "Không chính xác! 🤔",
          description: `Đáp án đúng là: ${correctAnswer}`,
          variant: "destructive",
        });
      }
      
      setTimeout(() => {
        setIsAnswering(false);
        setRipplePosition(null);
      }, 500);
    }, 800);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      
      if (useTimer) {
        const questionTime = gameContent?.settings?.timePerQuestion || 30;
        setTimeLeft(questionTime);
        setTimerRunning(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setGameStarted(false);
  };

  if (!gameContent || !questions.length) {
    return <div className="p-4">Không có dữ liệu câu hỏi</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-2xl animate-scale-in">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 animate-glow">
            <Trophy className="h-12 w-12 text-yellow-500 animate-celebration" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-primary animate-fade-in">Kết Quả 🎉</h2>
          <p className="text-lg mb-4 text-muted-foreground">
            Chủ đề: <span className="font-semibold text-primary">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-6 animate-fade-in">
            <div className="flex justify-between mb-3">
              <span className="text-muted-foreground">Điểm của bạn</span>
              <span className="font-bold text-primary text-lg">{percentage}%</span>
            </div>
            <Progress 
              value={percentage} 
              className="h-4 shadow-lg animate-progress-glow" 
              indicatorColor="bg-gradient-to-r from-primary via-primary/90 to-primary/80"
              showPercentage={false}
            />
          </div>
          
          <div className="text-4xl font-bold mb-6 text-primary animate-pulse">
            {score} / {questions.length}
          </div>
          
          {useTimer && (
            <div className="text-sm mb-6 text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
              <Clock className="inline h-4 w-4 mr-1" />
              Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-300 hover:scale-105 btn-enhanced">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi Lại
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isTimerUrgent = useTimer && timeLeft <= 10;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header with progress and timer - fixed height */}
      <div className="flex-shrink-0 p-4 pt-16">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
            <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-sm font-medium flex items-center gap-3">
            {useTimer && (
              <>
                <div className={`flex items-center px-3 py-2 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                  isTimerUrgent 
                    ? 'bg-gradient-to-r from-red-500/20 to-red-400/15 border-red-300/30 text-red-700 animate-pulse' 
                    : 'bg-gradient-to-r from-primary/15 to-primary/10 border-primary/20'
                }`}>
                  <Clock className={`h-4 w-4 mr-1 ${isTimerUrgent ? 'text-red-600 animate-pulse' : 'text-primary'}`} />
                  {timeLeft}s
                </div>
                <div className="flex items-center px-3 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/15 backdrop-blur-sm text-primary/80">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              </>
            )}
            <div className="px-3 py-2 bg-gradient-to-r from-green-500/15 to-green-400/10 text-green-700 rounded-full border border-green-300/30 backdrop-blur-sm">
              <Target className="inline h-4 w-4 mr-1" />
              Điểm: <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        <Progress 
          value={progress} 
          className="h-3 shadow-lg" 
          indicatorColor="bg-gradient-to-r from-primary via-primary/90 to-primary/80"
          showPercentage={false}
        />
      </div>

      {/* Content area - flexible height, centered */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <Card className={`p-8 bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-xl transition-all duration-500 ${
            isAnswering ? 'animate-pulse scale-[1.02]' : 'hover:shadow-2xl card-depth'
          }`}>
            <h2 className="text-2xl font-semibold mb-8 text-primary text-center relative">
              {question.question}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-subtle">
                <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
              </div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={(e) => handleOptionSelect(index, e)}
                  className={`p-6 text-left rounded-lg transition-all duration-300 transform relative overflow-hidden btn-enhanced ${
                    selectedOption === index 
                      ? selectedOption === question.correctAnswer
                        ? 'bg-gradient-to-r from-green-500/20 to-green-400/15 border-green-500/40 border-2 shadow-lg scale-105 animate-glow'
                        : 'bg-gradient-to-r from-red-500/20 to-red-400/15 border-red-500/40 border-2 shadow-lg animate-shake'
                      : isAnswered && index === question.correctAnswer
                        ? 'bg-gradient-to-r from-green-500/20 to-green-400/15 border-green-500/40 border-2 shadow-lg animate-glow'
                        : `bg-gradient-to-r from-card to-card/90 hover:from-primary/10 hover:to-primary/5 border-border hover:border-primary/50 border-2 hover:shadow-lg ${
                            !isAnswered ? 'hover:scale-105 interactive-scale' : ''
                          }`
                  }`}
                  disabled={isAnswered}
                >
                  <div className="flex items-center relative z-10">
                    {selectedOption === index ? (
                      selectedOption === question.correctAnswer ? (
                        <CheckCircle className="h-6 w-6 mr-4 text-green-600 flex-shrink-0 animate-celebration" />
                      ) : (
                        <XCircle className="h-6 w-6 mr-4 text-red-600 flex-shrink-0 animate-shake" />
                      )
                    ) : isAnswered && index === question.correctAnswer ? (
                      <CheckCircle className="h-6 w-6 mr-4 text-green-600 flex-shrink-0 animate-celebration" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-primary/30 mr-4 flex items-center justify-center flex-shrink-0 bg-primary/5 transition-all duration-300">
                        <span className="text-sm font-bold text-primary/70">{String.fromCharCode(65 + index)}</span>
                      </div>
                    )}
                    <span className="font-medium text-base">{option}</span>
                  </div>
                  
                  {ripplePosition && selectedOption === index && (
                    <span 
                      className="absolute rounded-full bg-primary/20 animate-ripple pointer-events-none"
                      style={{
                        left: ripplePosition.x - 20,
                        top: ripplePosition.y - 20,
                        width: 40,
                        height: 40
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer buttons - fixed height */}
      <div className="flex-shrink-0 p-4">
        <div className="flex space-x-4 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={handleRestart}
            className="bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40 flex-1 transition-all duration-300 hover:scale-105 btn-enhanced py-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm lại
          </Button>
          
          <Button 
            onClick={handleNextQuestion} 
            disabled={!isAnswered || isAnswering}
            className={`flex-1 transition-all duration-300 hover:scale-105 btn-enhanced py-3 ${
              isAnswered && !isAnswering
                ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg' 
                : 'bg-primary/50 pointer-events-none'
            }`}
          >
            {isAnswering ? (
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              </div>
            ) : (
              <>
                {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizTemplate;

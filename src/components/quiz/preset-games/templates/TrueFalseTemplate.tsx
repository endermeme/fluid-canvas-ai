
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, AlertCircle, Clock, ChevronRight, Sparkles, Target } from 'lucide-react';

interface TrueFalseTemplateProps {
  data?: any;
  content?: any;
  topic: string;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ data, content, topic }) => {
  const gameContent = content || data;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<boolean | null>>([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const { toast } = useToast();

  const questions = gameContent?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentAnswer = userAnswers[currentQuestion];
  const useTimer = gameContent?.settings?.timePerQuestion && gameContent?.settings?.totalTime;

  // Initialize game when questions are available
  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      const questionTime = gameContent?.settings?.timePerQuestion || 15;
      const totalTime = gameContent?.settings?.totalTime || (questions.length * questionTime);
      
      setTimeLeft(useTimer ? questionTime : 0);
      setTotalTimeLeft(useTimer ? totalTime : 0);
      setTimerRunning(useTimer);
      setGameStarted(true);
    }
  }, [gameContent, questions, gameStarted, useTimer]);

  // Question timer
  useEffect(() => {
    if (useTimer && timeLeft > 0 && timerRunning && currentAnswer === null) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (useTimer && timeLeft === 0 && timerRunning && currentAnswer === null) {
      setTimerRunning(false);
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không trả lời kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, currentAnswer, useTimer, toast]);

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

  const handleAnswer = (answer: boolean) => {
    if (currentAnswer !== null || isAnswering) return;
    
    setIsAnswering(true);
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
    setShowExplanation(gameContent?.settings?.showExplanation ?? true);
    setTimerRunning(false);

    const isCorrect = answer === questions[currentQuestion].isTrue;
    
    setTimeout(() => {
      if (isCorrect) {
        setScore(score + 1);
        
        toast({
          title: "Chính xác! ✨",
          description: "Câu trả lời của bạn đúng rồi!",
          variant: "default",
        });
      } else {
        toast({
          title: "Không chính xác! 🤔",
          description: "Câu trả lời của bạn chưa đúng.",
          variant: "destructive",
        });
      }
      
      setIsAnswering(false);
    }, 800);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setIsAnswering(false);
      
      if (useTimer) {
        const questionTime = gameContent?.settings?.timePerQuestion || 15;
        setTimeLeft(questionTime);
        setTimerRunning(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setShowExplanation(false);
    setShowResult(false);
    setGameStarted(false);
    setIsAnswering(false);
  };

  if (!gameContent || !questions.length) {
    return <div className="p-4">Không có dữ liệu câu hỏi</div>;
  }

  if (showResult) {
    const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index].isTrue).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-2xl animate-scale-in">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 animate-glow">
            <Target className="h-10 w-10 text-primary animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-primary animate-fade-in">Kết Quả</h2>
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
              className="h-4 shadow-lg" 
              indicatorColor="bg-gradient-to-r from-primary via-primary/90 to-primary/80"
              showPercentage={false}
            />
          </div>
          
          <div className="text-4xl font-bold mb-6 text-primary animate-pulse">
            {correctAnswers} / {questions.length}
          </div>
          
          {useTimer && (
            <div className="text-sm mb-6 text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
              <Clock className="inline h-4 w-4 mr-1" />
              Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-300 hover:scale-105">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi Lại
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
            <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-sm font-medium flex items-center gap-3">
            {useTimer && (
              <>
                <div className="flex items-center px-3 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                  <Clock className="h-4 w-4 mr-1 text-primary animate-pulse" />
                  {timeLeft}s
                </div>
                <div className="flex items-center px-3 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/15 backdrop-blur-sm text-primary/80">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              </>
            )}
            <div className="px-3 py-2 bg-gradient-to-r from-green-500/15 to-green-400/10 text-green-700 rounded-full border border-green-300/30 backdrop-blur-sm">
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

      <Card className={`p-6 mb-4 bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-xl transition-all duration-500 ${
        isAnswering ? 'animate-pulse scale-[1.02]' : 'hover:shadow-2xl'
      }`}>
        <h2 className="text-xl font-semibold mb-6 text-center text-primary relative">
          {question.statement}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-subtle">
            <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
          </div>
        </h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6 max-w-md mx-auto">
          <Button 
            className={`p-6 flex items-center justify-center text-lg font-medium min-h-[80px] transition-all duration-300 transform relative overflow-hidden ${
              isAnswering 
                ? 'animate-pulse pointer-events-none' 
                : 'hover:scale-105 hover:shadow-lg'
            } ${
              currentAnswer === true 
                ? currentAnswer === question.isTrue
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105 animate-glow'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-shake'
                : 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary'
            }`}
            onClick={() => handleAnswer(true)}
            disabled={currentAnswer !== null || isAnswering}
            size="lg"
          >
            <CheckCircle className="h-8 w-8 mr-3" />
            <span>ĐÚNG</span>
            {!isAnswering && currentAnswer === null && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-shimmer"></div>
            )}
          </Button>
          
          <Button 
            className={`p-6 flex items-center justify-center text-lg font-medium min-h-[80px] transition-all duration-300 transform relative overflow-hidden ${
              isAnswering 
                ? 'animate-pulse pointer-events-none' 
                : 'hover:scale-105 hover:shadow-lg'
            } ${
              currentAnswer === false 
                ? currentAnswer === question.isTrue
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105 animate-glow'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-shake'
                : 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground border-2 border-muted hover:bg-secondary/90'
            }`}
            onClick={() => handleAnswer(false)}
            disabled={currentAnswer !== null || isAnswering}
            size="lg"
          >
            <XCircle className="h-8 w-8 mr-3" />
            <span>SAI</span>
            {!isAnswering && currentAnswer === null && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-shimmer"></div>
            )}
          </Button>
        </div>
        
        {showExplanation && (
          <div className={`p-4 rounded-lg mt-4 animate-fade-in ${
            question.isTrue 
              ? 'bg-gradient-to-r from-green-50/80 to-green-100/50 border border-green-200/50 backdrop-blur-sm' 
              : 'bg-gradient-to-r from-red-50/80 to-red-100/50 border border-red-200/50 backdrop-blur-sm'
          }`}>
            <div className="flex items-start">
              <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${question.isTrue ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium mb-1 text-sm">Giải thích:</p>
                <p className="text-sm">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="mt-auto flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40 flex-1 transition-all duration-300 hover:scale-105"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Làm lại
        </Button>
        
        <Button 
          onClick={handleNextQuestion} 
          disabled={currentAnswer === null || isAnswering}
          className={`flex-1 transition-all duration-300 hover:scale-105 ${
            currentAnswer !== null && !isAnswering 
              ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg' 
              : 'bg-primary/50 pointer-events-none'
          }`}
          size="sm"
        >
          {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default TrueFalseTemplate;

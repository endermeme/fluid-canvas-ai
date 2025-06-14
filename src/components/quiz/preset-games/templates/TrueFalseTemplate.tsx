
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, AlertCircle, Clock, ChevronRight } from 'lucide-react';

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
    if (currentAnswer !== null) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
    setShowExplanation(gameContent?.settings?.showExplanation ?? true);
    setTimerRunning(false);

    const isCorrect = answer === questions[currentQuestion].isTrue;
    if (isCorrect) {
      setScore(score + 1);
      
      toast({
        title: "Chính xác! +1 điểm",
        description: "Câu trả lời của bạn đúng.",
        variant: "default",
      });
    } else {
      toast({
        title: "Không chính xác!",
        description: "Câu trả lời của bạn không đúng.",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      
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
  };

  if (!gameContent || !questions.length) {
    return <div className="p-4">Không có dữ liệu câu hỏi</div>;
  }

  if (showResult) {
    const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index].isTrue).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-background to-background/80">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
          <p className="text-lg mb-4">
            Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Điểm của bạn</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3 bg-secondary" />
          </div>
          
          <div className="text-4xl font-bold mb-6 text-primary">
            {correctAnswers} / {questions.length}
          </div>
          
          {useTimer && (
            <div className="text-sm mb-4 text-muted-foreground">
              Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          <Button onClick={handleRestart} className="w-full">
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
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-sm font-medium flex items-center gap-2">
            {useTimer && (
              <>
                <div className="flex items-center px-3 py-1 bg-primary/10 rounded-full">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  {timeLeft}s
                </div>
                <div className="flex items-center px-3 py-1 bg-primary/10 rounded-full text-primary/80">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              </>
            )}
            <div className="px-3 py-1 bg-primary/10 rounded-full">
              Điểm: <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>

      <Card className="p-6 mb-4 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
        <h2 className="text-xl font-semibold mb-6 text-center text-primary">{question.statement}</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6 max-w-md mx-auto">
          <Button 
            className={`p-6 flex items-center justify-center text-lg font-medium min-h-[80px] ${
              currentAnswer === true 
                ? currentAnswer === question.isTrue
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
            onClick={() => handleAnswer(true)}
            disabled={currentAnswer !== null}
            size="lg"
          >
            <CheckCircle className="h-8 w-8 mr-3" />
            <span>ĐÚNG</span>
          </Button>
          
          <Button 
            className={`p-6 flex items-center justify-center text-lg font-medium min-h-[80px] ${
              currentAnswer === false 
                ? currentAnswer === question.isTrue
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-2 border-muted'
            }`}
            onClick={() => handleAnswer(false)}
            disabled={currentAnswer !== null}
            size="lg"
          >
            <XCircle className="h-8 w-8 mr-3" />
            <span>SAI</span>
          </Button>
        </div>
        
        {showExplanation && (
          <div className={`p-4 rounded-lg mt-4 ${question.isTrue ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start">
              <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${question.isTrue ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium mb-1">Giải thích:</p>
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
          className="bg-background/70 border-primary/20 flex-1"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Làm lại
        </Button>
        
        <Button 
          onClick={handleNextQuestion} 
          disabled={currentAnswer === null}
          className={`flex-1 ${currentAnswer !== null ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary' : 'bg-primary/50'}`}
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

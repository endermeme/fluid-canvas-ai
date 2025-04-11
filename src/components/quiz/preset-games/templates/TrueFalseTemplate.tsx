
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, AlertCircle, Clock } from 'lucide-react';

interface TrueFalseTemplateProps {
  content: any;
  topic: string;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ content, topic }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<boolean | null>>([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(content?.settings?.timePerQuestion || 15);
  const [totalTimeLeft, setTotalTimeLeft] = useState(content?.settings?.totalTime || 150);
  const [timerRunning, setTimerRunning] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const questions = content?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentAnswer = userAnswers[currentQuestion];

  // Initialize the game
  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      
      // Initialize timeLeft with proper settings
      const questionTime = content?.settings?.timePerQuestion || 15;
      const totalTime = content?.settings?.totalTime || (questions.length * questionTime);
      
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
      
      console.log(`Game initialized with ${questionTime}s per question and ${totalTime}s total time`);
    }
  }, [content, questions, gameStarted]);

  // Question timer countdown
  useEffect(() => {
    if (timeLeft > 0 && timerRunning) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không trả lời kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, toast]);

  // Total game timer countdown
  useEffect(() => {
    if (totalTimeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (totalTimeLeft === 0 && gameStarted && !showResult) {
      // Time's up - show results
      setShowResult(true);
      
      toast({
        title: "Trò chơi kết thúc",
        description: "Đã hết thời gian. Hãy xem kết quả của bạn.",
        variant: "destructive",
      });
    }
  }, [totalTimeLeft, gameStarted, showResult, toast]);

  const handleAnswer = (answer: boolean) => {
    if (currentAnswer !== null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
    setShowExplanation(content?.settings?.showExplanation ?? true);
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
      setTimeLeft(content?.settings?.timePerQuestion || 15);
      setTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setShowExplanation(false);
    setShowResult(false);
    setTimeLeft(content?.settings?.timePerQuestion || 15);
    setTotalTimeLeft(content?.settings?.totalTime || 150);
    setTimerRunning(true);
    setGameStarted(true);
  };

  if (!content || !questions.length) {
    return <div className="p-4">Không có dữ liệu câu hỏi</div>;
  }

  if (showResult) {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index].isTrue
    ).length;
    
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Kết Quả</h2>
          <p className="text-lg mb-4">
            Chủ đề: <span className="font-semibold">{content.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Điểm của bạn</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          
          <div className="text-2xl font-bold mb-6">
            {correctAnswers} / {questions.length}
          </div>
          
          <div className="text-sm mb-4 text-muted-foreground">
            Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
          </div>
          
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
  
  // Format total time remaining as mm:ss
  const minutesLeft = Math.floor(totalTimeLeft / 60);
  const secondsLeft = totalTimeLeft % 60;
  const formattedTotalTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Header with progress and timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-sm font-medium flex items-center gap-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {timeLeft}s
            </div>
            <div className="flex items-center text-primary/80">
              <Clock className="h-4 w-4 mr-1" />
              {formattedTotalTime}
            </div>
            <div>
              Điểm: <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="p-6 mb-4">
        <h2 className="text-xl font-semibold mb-6">{question.statement}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button 
            className={`p-6 flex items-center justify-center ${
              currentAnswer === true 
                ? currentAnswer === question.isTrue
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
                : 'bg-primary/80 hover:bg-primary'
            }`}
            onClick={() => handleAnswer(true)}
            disabled={currentAnswer !== null}
          >
            <CheckCircle className="h-8 w-8 mr-2" />
            <span className="text-lg font-medium">Đúng</span>
          </Button>
          
          <Button 
            className={`p-6 flex items-center justify-center ${
              currentAnswer === false 
                ? currentAnswer === question.isTrue
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
                : 'bg-primary/80 hover:bg-primary'
            }`}
            onClick={() => handleAnswer(false)}
            disabled={currentAnswer !== null}
          >
            <XCircle className="h-8 w-8 mr-2" />
            <span className="text-lg font-medium">Sai</span>
          </Button>
        </div>
        
        {showExplanation && (
          <div className={`p-4 rounded-lg mt-4 ${question.isTrue ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start">
              <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${question.isTrue ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium mb-1">Giải thích:</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Controls */}
      <div className="mt-auto">
        <Button 
          onClick={handleNextQuestion} 
          disabled={currentAnswer === null}
          className="w-full"
        >
          {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
        </Button>
      </div>
    </div>
  );
};

export default TrueFalseTemplate;

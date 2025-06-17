import React, { useState, useEffect } from 'react';
import PresetGameHeader from '../PresetGameHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, AlertCircle, Clock, ChevronRight } from 'lucide-react';

interface TrueFalseTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ data, content, topic, onShare }) => {
  const gameContent = content || data;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<boolean | null>>([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timePerQuestion || 15);
  const [totalTimeLeft, setTotalTimeLeft] = useState(gameContent?.settings?.totalTime || 150);
  const [timerRunning, setTimerRunning] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const questions = gameContent?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentAnswer = userAnswers[currentQuestion];

  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      const questionTime = gameContent?.settings?.timePerQuestion || 15;
      const totalTime = gameContent?.settings?.totalTime || (questions.length * questionTime);
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
    }
  }, [gameContent, questions, gameStarted]);

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
      setTimeLeft(gameContent?.settings?.timePerQuestion || 15);
      setTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setShowExplanation(false);
    setShowResult(false);
    setTimeLeft(gameContent?.settings?.timePerQuestion || 15);
    setTotalTimeLeft(gameContent?.settings?.totalTime || 150);
    setTimerRunning(true);
    setGameStarted(true);
  };

  if (!gameContent || !questions.length) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-lg">Không có dữ liệu câu hỏi</p>
            <p className="text-sm text-muted-foreground mt-2">Vui lòng thử lại hoặc chọn game khác</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="max-w-sm w-full p-4 text-center">
          <h2 className="text-xl font-bold mb-3">Kết Quả</h2>
          <p className="text-sm mb-3">
            Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
          </p>
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>Điểm của bạn</span>
              <span className="font-bold">{Math.round((userAnswers.filter((answer, index) => answer === questions[index].isTrue).length / questions.length) * 100)}%</span>
            </div>
            <Progress value={Math.round((userAnswers.filter((answer, index) => answer === questions[index].isTrue).length / questions.length) * 100)} className="h-2" />
          </div>
          <div className="text-xl font-bold mb-4">
            {userAnswers.filter((answer, index) => answer === questions[index].isTrue).length} / {questions.length}
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
  const minutesLeft = Math.floor(totalTimeLeft / 60);
  const secondsLeft = totalTimeLeft % 60;
  const formattedTotalTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="h-full flex flex-col">
      {/* Compact header */}
      <div className="flex-shrink-0 p-2">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs font-medium">
            Câu {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-xs font-medium flex items-center gap-1">
            <div className="flex items-center px-2 py-1 bg-primary/10 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              {timeLeft}s
            </div>
            <div className="flex items-center px-2 py-1 bg-primary/10 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              {formattedTotalTime}
            </div>
            <div className="px-2 py-1 bg-primary/10 rounded-full">
              Điểm: {score}
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      
      {/* Question area */}
      <div className="flex-1 min-h-0 overflow-auto p-2">
        <Card className="p-4 mb-4 bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <h2 className="text-lg font-semibold mb-4 text-center">{question.statement}</h2>
          
          <div className="grid grid-cols-1 gap-3 mb-4 max-w-sm mx-auto">
            <Button 
              className={`p-4 flex items-center justify-center text-base font-medium min-h-[60px] ${
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
              <CheckCircle className="h-6 w-6 mr-2" />
              <span>ĐÚNG</span>
            </Button>
            
            <Button 
              className={`p-4 flex items-center justify-center text-base font-medium min-h-[60px] ${
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
              <XCircle className="h-6 w-6 mr-2" />
              <span>SAI</span>
            </Button>
          </div>
          
          {showExplanation && (
            <div className={`p-3 rounded-lg mt-3 ${question.isTrue ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                <AlertCircle className={`h-4 w-4 mr-2 mt-0.5 ${question.isTrue ? 'text-green-600' : 'text-red-600'}`} />
                <div>
                  <p className="font-medium mb-1 text-sm">Giải thích:</p>
                  <p className="text-sm">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Compact footer */}
      <div className="flex-shrink-0 p-2 border-t border-primary/10">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRestart} 
            className="flex-1 text-xs h-8"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Làm lại
          </Button>
          <Button 
            onClick={handleNextQuestion} 
            disabled={currentAnswer === null}
            className="flex-1 text-xs h-8"
            size="sm"
          >
            {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrueFalseTemplate;

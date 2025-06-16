
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, Clock, Trophy, Zap, Target } from 'lucide-react';

interface QuizTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  isSharedMode?: boolean;
  onScoreSubmit?: (score: number, total: number) => void;
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ 
  data, 
  content, 
  topic, 
  isSharedMode = false, 
  onScoreSubmit 
}) => {
  const gameContent = content || data;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Array<number | null>>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bonusTime, setBonusTime] = useState(0);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const { toast } = useToast();

  const questions = gameContent?.questions || [];
  const useTimer = gameContent?.settings?.useTimer;
  const questionTime = gameContent?.settings?.timePerQuestion || 30;
  const bonusTimeEnabled = gameContent?.settings?.bonusTime;

  useEffect(() => {
    if (useTimer) {
      setTimeLeft(questionTime);
    }
  }, [currentQuestion, questionTime, useTimer]);

  useEffect(() => {
    if (useTimer && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (useTimer && timeLeft === 0 && !showResult) {
      toast({
        title: "Hết giờ!",
        description: "Bạn đã hết thời gian cho câu hỏi này.",
        variant: "destructive",
      });
      handleNextQuestion();
    }
  }, [timeLeft, useTimer, showResult, toast]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      let points = 1;
      if (bonusTimeEnabled && timeLeft > questionTime * 0.5) {
        points += 0.5;
        setBonusTime(bonusTime + 0.5);
      }
      setScore(score + points);
      
      toast({
        title: "Chính xác! ✨",
        description: bonusTimeEnabled && timeLeft > questionTime * 0.5 ? 
          `+${points} điểm (có bonus thời gian!)` : "+1 điểm",
        variant: "default",
      });
    } else {
      toast({
        title: "Không chính xác! 🤔",
        description: "Câu trả lời chưa đúng.",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setShowResult(true);
      
      // Submit score only once when game ends in shared mode
      if (isSharedMode && onScoreSubmit && !hasSubmittedScore) {
        onScoreSubmit(score, questions.length);
        setHasSubmittedScore(true);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      if (useTimer) {
        setTimeLeft(questionTime);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(questions.length).fill(null));
    setScore(0);
    setBonusTime(0);
    setShowResult(false);
    setHasSubmittedScore(false);
    if (useTimer) {
      setTimeLeft(questionTime);
    }
    
    // Don't submit score on restart in shared mode
  };

  if (!gameContent || !questions.length) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-foreground">Không có dữ liệu câu hỏi</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-background to-background/95 overflow-hidden">
        <Card className="max-w-md w-full p-8 text-center bg-card shadow-2xl border">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-primary/10">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-foreground">Kết Quả</h2>
          <p className="text-lg mb-4 text-muted-foreground">
            Chủ đề: <span className="font-semibold text-foreground">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-muted-foreground">Điểm của bạn</span>
              <span className="font-bold text-foreground text-lg">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-4" />
          </div>
          
          <div className="text-4xl font-bold mb-4 text-foreground">
            {score.toFixed(1)} / {questions.length}
          </div>
          
          {bonusTimeEnabled && bonusTime > 0 && (
            <div className="mb-4 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              <Zap className="inline h-4 w-4 mr-1" />
              Bonus thời gian: +{bonusTime.toFixed(1)} điểm
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
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-background/95 overflow-hidden">
      {/* Fixed Header với điểm số */}
      <div className="flex-shrink-0 p-4 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="flex items-center gap-3">
            {useTimer && (
              <div className="flex items-center px-3 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Clock className="h-4 w-4 mr-1 text-primary" />
                <span className="text-foreground">{timeLeft}s</span>
              </div>
            )}
            <div className="px-3 py-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full border border-green-300/30">
              Điểm: <span className="font-bold">{score.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Main Game Area - Scaled up */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Question Card - Scaled larger */}
          <Card className="p-8 mb-8 bg-card shadow-xl border">
            <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">
              {question.question}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {question.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  className={`p-6 text-lg text-left justify-start min-h-[100px] transition-all duration-300 ${
                    selectedAnswer === index
                      ? index === question.correctAnswer
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg scale-105'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                      : 'bg-card hover:bg-accent border-2 border-muted hover:border-primary/40 hover:scale-105 text-foreground'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  size="lg"
                  variant="outline"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {selectedAnswer === index && (
                      <div className="ml-auto">
                        {index === question.correctAnswer ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <XCircle className="h-6 w-6 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Footer Controls */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleRestart}
              className="bg-card border-primary/20 hover:bg-primary/10 hover:border-primary/40"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTemplate;

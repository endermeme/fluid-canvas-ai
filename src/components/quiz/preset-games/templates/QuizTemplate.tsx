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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Không có dữ liệu câu hỏi</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-2xl">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
          <p className="text-lg mb-4 text-muted-foreground">
            Chủ đề: <span className="font-semibold text-primary">{gameContent.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-muted-foreground">Điểm của bạn</span>
              <span className="font-bold text-primary text-lg">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-4 shadow-lg" />
          </div>
          
          <div className="text-4xl font-bold mb-4 text-primary">
            {score.toFixed(1)} / {questions.length}
          </div>
          
          {bonusTimeEnabled && bonusTime > 0 && (
            <div className="mb-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <Zap className="inline h-4 w-4 mr-1" />
              Bonus thời gian: +{bonusTime.toFixed(1)} điểm
            </div>
          )}
          
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg">
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20">
              Câu hỏi {currentQuestion + 1}/{questions.length}
            </div>
            <div className="flex items-center gap-3">
              {useTimer && (
                <div className="flex items-center px-3 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  {timeLeft}s
                </div>
              )}
              <div className="px-3 py-2 bg-gradient-to-r from-green-500/15 to-green-400/10 text-green-700 rounded-full border border-green-300/30">
                Điểm: <span className="font-bold">{score.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-3 shadow-lg" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-primary/5 via-card/95 to-primary/10 backdrop-blur-sm border-primary/20 shadow-xl">
          <h2 className="text-2xl font-semibold mb-8 text-center text-primary">
            {question.question}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {question.options.map((option: string, index: number) => (
              <Button
                key={index}
                className={`p-6 text-base text-left justify-start min-h-[80px] transition-all duration-300 ${
                  selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-card to-card/80 hover:from-primary/10 hover:to-primary/5 border border-primary/20 hover:border-primary/40 hover:scale-105'
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                size="lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
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

        {/* Footer */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleRestart}
            className="bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizTemplate;

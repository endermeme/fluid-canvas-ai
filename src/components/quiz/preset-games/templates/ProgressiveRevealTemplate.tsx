
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Trophy, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressiveRevealData {
  title: string;
  description?: string;
  items: {
    imageUrl: string;
    answer: string;
    options: string[];
    hint?: string;
  }[];
  settings: {
    timePerQuestion: number;
    totalTime: number;
    revealLevels: number;
    revealInterval: number;
  };
}

interface ProgressiveRevealTemplateProps {
  data: ProgressiveRevealData;
  onBack: () => void;
  topic?: string;
  content?: any;
}

const ProgressiveRevealTemplate: React.FC<ProgressiveRevealTemplateProps> = ({ 
  data, 
  onBack, 
  topic = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blurLevel, setBlurLevel] = useState(5);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(data?.settings?.timePerQuestion || 30);
  const [revealTimer, setRevealTimer] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const { toast } = useToast();

  const currentItem = data?.items?.[currentIndex];
  const maxBlur = data?.settings?.revealLevels || 5;
  const revealInterval = data?.settings?.revealInterval || 3000;

  // Timer cho countdown
  useEffect(() => {
    if (gameOver || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, gameOver, showResult]);

  // Timer cho reveal
  useEffect(() => {
    if (gameOver || showResult) return;

    const timer = setInterval(() => {
      setRevealTimer(prev => {
        const newTime = prev + 1000;
        const newBlurLevel = Math.max(1, maxBlur - Math.floor(newTime / revealInterval));
        
        if (newBlurLevel !== blurLevel && newBlurLevel >= 1) {
          setBlurLevel(newBlurLevel);
          setIsRevealing(true);
          setTimeout(() => setIsRevealing(false), 500);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, gameOver, showResult, blurLevel]);

  const calculateScore = () => {
    const baseScore = 100;
    const blurBonus = blurLevel * 20; // Bonus cho đoán khi blur
    const timeBonus = Math.floor(timeLeft / 2); // Bonus cho thời gian còn lại
    return baseScore + blurBonus + timeBonus;
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentItem?.answer;
    
    if (isCorrect) {
      const earnedScore = calculateScore();
      setScore(prev => prev + earnedScore);
      
      toast({
        title: "Chính xác! 🎉",
        description: `+${earnedScore} điểm (Blur level: ${blurLevel}, Time bonus: ${Math.floor(timeLeft / 2)})`,
      });
    } else {
      toast({
        title: "Sai rồi! 😅",
        description: `Đáp án đúng: ${currentItem?.answer}`,
        variant: "destructive"
      });
    }

    setTimeout(() => {
      nextQuestion();
    }, 2500);
  };

  const handleTimeUp = () => {
    if (!showResult) {
      setSelectedAnswer(null);
      setShowResult(true);
      
      toast({
        title: "Hết giờ! ⏰",
        description: `Đáp án đúng: ${currentItem?.answer}`,
        variant: "destructive"
      });

      setTimeout(() => {
        nextQuestion();
      }, 2500);
    }
  };

  const nextQuestion = () => {
    if (currentIndex >= (data?.items?.length || 1) - 1) {
      setGameOver(true);
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setBlurLevel(maxBlur);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(data?.settings?.timePerQuestion || 30);
    setRevealTimer(0);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setBlurLevel(maxBlur);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setTimeLeft(data?.settings?.timePerQuestion || 30);
    setRevealTimer(0);
  };

  const getBlurIntensity = () => {
    const intensity = (blurLevel / maxBlur) * 20; // 0-20px blur
    return intensity;
  };

  const getScoreColor = () => {
    if (blurLevel >= 4) return "text-green-600";
    if (blurLevel >= 3) return "text-blue-600";
    if (blurLevel >= 2) return "text-orange-600";
    return "text-red-600";
  };

  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Không có dữ liệu game Progressive Reveal</p>
          <Button onClick={onBack} className="mt-4">Quay lại</Button>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Hoàn thành!</h2>
          <div className="text-3xl font-bold text-primary mb-2">{score} điểm</div>
          <p className="text-muted-foreground mb-6">
            Bạn đã hoàn thành {data.items.length} câu hỏi
          </p>
          <div className="flex gap-3">
            <Button onClick={resetGame} variant="outline" className="flex-1">
              Chơi lại
            </Button>
            <Button onClick={onBack} className="flex-1">
              Quay lại
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            ← Quay lại
          </Button>
          <h1 className="text-xl font-bold">{data.title || "Progressive Reveal"}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Level {blurLevel}/{maxBlur}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            {score} điểm
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Câu {currentIndex + 1}/{data.items.length}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {timeLeft}s
          </span>
        </div>
        <Progress value={(currentIndex / data.items.length) * 100} className="mb-2" />
        <Progress value={(timeLeft / (data?.settings?.timePerQuestion || 30)) * 100} className="h-2" />
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Image Area */}
        <div className="flex-1 flex items-center justify-center">
          <Card className={`p-4 ${isRevealing ? 'animate-pulse' : ''}`}>
            <div className="relative">
              <img
                src={currentItem?.imageUrl || '/placeholder.svg'}
                alt="Progressive reveal image"
                className="w-full max-w-md mx-auto rounded-lg transition-all duration-500"
                style={{
                  filter: `blur(${getBlurIntensity()}px)`,
                  maxHeight: '400px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              
              {/* Blur level indicator */}
              <div className="absolute top-2 right-2">
                <Badge className={`${getScoreColor()} bg-background/80`}>
                  <Zap className="h-3 w-3 mr-1" />
                  +{calculateScore()} điểm
                </Badge>
              </div>
              
              {/* Reveal hint */}
              {blurLevel > 1 && !showResult && (
                <div className="absolute bottom-2 left-2 right-2">
                  <Badge variant="outline" className="bg-background/80 w-full justify-center">
                    {blurLevel > 3 ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                    {blurLevel === maxBlur ? "Ảnh sẽ rõ dần..." : `Còn ${blurLevel - 1} level nữa`}
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Answer Options */}
        <div className="flex-1 max-w-md">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Đây là gì?</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {currentItem?.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentItem.answer;
                const shouldShowCorrect = showResult && isCorrect;
                const shouldShowWrong = showResult && isSelected && !isCorrect;
                
                return (
                  <Button
                    key={index}
                    variant={shouldShowCorrect ? "default" : shouldShowWrong ? "destructive" : "outline"}
                    className={`justify-start h-auto p-4 text-left ${
                      shouldShowCorrect ? "bg-green-500 hover:bg-green-600" : ""
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                    {shouldShowCorrect && (
                      <span className="ml-auto">✓</span>
                    )}
                    {shouldShowWrong && (
                      <span className="ml-auto">✗</span>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Hint */}
            {currentItem?.hint && blurLevel <= 2 && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Gợi ý:</span> {currentItem.hint}
                </p>
              </div>
            )}

            {/* Skip option */}
            {!showResult && blurLevel === 1 && (
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => handleAnswer("")}
              >
                Bỏ qua câu này
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveRevealTemplate;

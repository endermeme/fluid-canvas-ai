import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();

  const currentItem = data?.items?.[currentIndex];
  const maxBlur = data?.settings?.revealLevels || 5;
  const revealInterval = data?.settings?.revealInterval || 3000;

  // Reset khi chuyển câu mới
  useEffect(() => {
    if (currentItem) {
      setImageLoaded(false);
      setIsTransitioning(true);
      
      // Preload image
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        setIsTransitioning(false);
      };
      img.onerror = () => {
        setImageLoaded(true);
        setIsTransitioning(false);
      };
      img.src = currentItem.imageUrl;
    }
  }, [currentIndex, currentItem]);

  // Timer cho countdown
  useEffect(() => {
    if (gameOver || showResult || !imageLoaded) return;

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
  }, [currentIndex, gameOver, showResult, imageLoaded]);

  // Timer cho reveal
  useEffect(() => {
    if (gameOver || showResult || !imageLoaded) return;

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
  }, [currentIndex, gameOver, showResult, imageLoaded, blurLevel]);

  const calculateScore = () => {
    // Giới hạn điểm max = 100
    const baseScore = 50; // Base điểm thấp hơn
    const blurBonus = blurLevel * 8; // Giảm bonus từ 20 xuống 8
    const timeBonus = Math.min(20, Math.floor(timeLeft / 2)); // Max time bonus = 20
    const totalScore = baseScore + blurBonus + timeBonus;
    return Math.min(100, totalScore); // Đảm bảo không quá 100
  };

  const handleAnswer = (answer: string) => {
    if (showResult || !imageLoaded) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentItem?.answer;
    
    if (isCorrect) {
      const earnedScore = calculateScore();
      setScore(prev => prev + earnedScore);
      
      toast({
        title: "Chính xác! 🎉",
        description: `+${earnedScore} điểm (Blur: ${blurLevel}/${maxBlur}, Time: +${Math.min(20, Math.floor(timeLeft / 2))})`,
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

    // Reset tất cả state cho câu mới
    setCurrentIndex(prev => prev + 1);
    setBlurLevel(maxBlur);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(data?.settings?.timePerQuestion || 30);
    setRevealTimer(0);
    setImageLoaded(false);
    setIsTransitioning(true);
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
    setImageLoaded(false);
    setIsTransitioning(true);
  };

  const getBlurIntensity = () => {
    const intensity = (blurLevel / maxBlur) * 20; // 0-20px blur
    return intensity;
  };

  const getScoreColor = () => {
    const currentScore = calculateScore();
    if (currentScore >= 80) return "text-green-600";
    if (currentScore >= 60) return "text-blue-600";
    if (currentScore >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Không có dữ liệu game Progressive Reveal</p>
            <Button onClick={onBack} size="lg" className="w-full">Quay lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Hoàn thành!</h2>
            <div className="text-4xl font-bold text-primary mb-4">{score} điểm</div>
            <p className="text-muted-foreground mb-2">
              Bạn đã hoàn thành {data.items.length} câu hỏi
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Điểm trung bình: {Math.round(score / data.items.length)} điểm/câu
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={resetGame} variant="outline" size="lg">
                Chơi lại
              </Button>
              <Button onClick={onBack} size="lg">
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto h-full">
        {/* Header Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onBack} size="sm">
                  ← Quay lại
                </Button>
                <h1 className="text-xl font-bold truncate">{data.title || "Progressive Reveal"}</h1>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Level {blurLevel}/{maxBlur}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {score} điểm
                </Badge>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {timeLeft}s
                </Badge>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Câu {currentIndex + 1}/{data.items.length}</span>
                <span>Thời gian còn lại</span>
              </div>
              <Progress value={(currentIndex / data.items.length) * 100} className="h-2" />
              <Progress value={(timeLeft / (data?.settings?.timePerQuestion || 30)) * 100} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Main Game Grid */}
        <div className="grid lg:grid-cols-2 gap-6 h-auto">
          {/* Image Section */}
          <Card className={`${isRevealing ? 'animate-pulse' : ''}`}>
            <CardContent className="p-6">
              <div className="relative bg-muted/30 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                {/* Loading State */}
                {(isTransitioning || !imageLoaded) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-muted-foreground">Đang tải ảnh...</p>
                    </div>
                  </div>
                )}
                
                {/* Main Image */}
                <img
                  src={currentItem?.imageUrl || '/placeholder.svg'}
                  alt="Progressive reveal image"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    filter: imageLoaded ? `blur(${getBlurIntensity()}px)` : 'blur(20px)'
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                    setImageLoaded(true);
                  }}
                />
                
                {/* Score Overlay */}
                {imageLoaded && (
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getScoreColor()} bg-background/90 backdrop-blur-sm`}>
                      <Zap className="h-3 w-3 mr-1" />
                      +{calculateScore()} điểm
                    </Badge>
                  </div>
                )}
                
                {/* Reveal Status Overlay */}
                {imageLoaded && blurLevel > 1 && !showResult && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm w-full justify-center">
                      {blurLevel > 3 ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                      {blurLevel === maxBlur ? "Ảnh sẽ rõ dần..." : `Còn ${blurLevel - 1} level nữa`}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Answer Section */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-center">Đây là gì?</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Answer Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {currentItem?.options?.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentItem.answer;
                  const shouldShowCorrect = showResult && isCorrect;
                  const shouldShowWrong = showResult && isSelected && !isCorrect;
                  const isDisabled = showResult || !imageLoaded || isTransitioning;
                  
                  return (
                    <Button
                      key={index}
                      variant={shouldShowCorrect ? "default" : shouldShowWrong ? "destructive" : "outline"}
                      className={`justify-between h-auto p-4 text-left transition-all ${
                        shouldShowCorrect ? "bg-green-500 hover:bg-green-600 text-white" : ""
                      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => handleAnswer(option)}
                      disabled={isDisabled}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-base">{option}</span>
                      </div>
                      {shouldShowCorrect && (
                        <span className="text-xl">✓</span>
                      )}
                      {shouldShowWrong && (
                        <span className="text-xl">✗</span>
                      )}
                    </Button>
                  );
                })}
              </div>

              {/* Hint Section */}
              {currentItem?.hint && blurLevel <= 2 && imageLoaded && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">💡 Gợi ý:</span> {currentItem.hint}
                  </p>
                </div>
              )}

              {/* Skip Option */}
              {!showResult && blurLevel === 1 && imageLoaded && (
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => handleAnswer("")}
                >
                  Bỏ qua câu này
                </Button>
              )}

              {/* Loading State for Options */}
              {!imageLoaded && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Vui lòng đợi ảnh tải xong...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveRevealTemplate;

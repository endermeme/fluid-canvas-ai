
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, RotateCcw, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Balloon {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  color: string;
  explanation: string;
}

interface BalloonPopData {
  title: string;
  description: string;
  balloons: Balloon[];
  settings: {
    timePerQuestion: number;
    totalTime: number;
    allowSkip: boolean;
    showExplanation: boolean;
    balloonPopAnimation: boolean;
  };
}

interface BalloonPopTemplateProps {
  data: BalloonPopData;
  onBack?: () => void;
  topic?: string;
  content?: BalloonPopData;
}

const BalloonShape: React.FC<{ color: string; isPopped: boolean; onClick: () => void }> = ({ color, isPopped, onClick }) => {
  if (isPopped) {
    return (
      <div className="w-20 h-20 flex items-center justify-center">
        <div className="text-4xl animate-pulse">💥</div>
      </div>
    );
  }

  return (
    <div 
      className="cursor-pointer transition-all duration-300 hover:scale-110 animate-bounce"
      onClick={onClick}
    >
      <div className="relative">
        <div 
          className="w-16 h-20 rounded-full shadow-lg border-2 border-white"
          style={{ backgroundColor: color }}
        />
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-6 rounded-full"
          style={{ backgroundColor: color, filter: 'brightness(0.8)' }}
        />
        <div className="absolute top-2 left-4 w-3 h-3 bg-white rounded-full opacity-60" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-600" />
      </div>
    </div>
  );
};

const BalloonPopTemplate: React.FC<BalloonPopTemplateProps> = ({ 
  data, 
  onBack,
  topic = "",
  content
}) => {
  const gameData = content || data;
  const { toast } = useToast();
  
  const [currentBalloonIndex, setCurrentBalloonIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.totalTime || 300);
  const [gameState, setGameState] = useState<'playing' | 'finished' | 'popping'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [balloonPositions, setBalloonPositions] = useState<{x: number, y: number, color: string}[]>([]);

  const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  useEffect(() => {
    if (gameData?.balloons) {
      const positions = gameData.balloons.map((_, index) => ({
        x: Math.random() * 70 + 15,
        y: Math.random() * 50 + 25,
        color: balloonColors[index % balloonColors.length]
      }));
      setBalloonPositions(positions);
    }
  }, [gameData]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBalloonPop = (balloonIndex: number) => {
    if (poppedBalloons.includes(balloonIndex) || gameState !== 'playing') return;
    
    setCurrentBalloonIndex(balloonIndex);
    setGameState('popping');
    setPoppedBalloons(prev => [...prev, balloonIndex]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentBalloon = gameData.balloons[currentBalloonIndex];
    const isCorrect = answerIndex === currentBalloon.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast({
        title: "Chính xác!",
        description: "Bạn đã trả lời đúng!",
      });
    } else {
      toast({
        title: "Sai rồi!",
        description: "Đáp án không chính xác.",
        variant: "destructive"
      });
    }
    
    if (gameData.settings.showExplanation) {
      setShowExplanation(true);
    } else {
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameState('playing');
    
    if (currentBalloonIndex >= gameData.balloons.length - 1) {
      setGameState('finished');
    }
  };

  const resetGame = () => {
    setCurrentBalloonIndex(0);
    setScore(0);
    setTimeLeft(gameData?.settings?.totalTime || 300);
    setGameState('playing');
    setSelectedAnswer(null);
    setShowExplanation(false);
    setPoppedBalloons([]);
  };

  const calculateStars = () => {
    const percentage = (score / (gameData.balloons.length * 10)) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  if (!gameData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Đang tải dữ liệu game...</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    const stars = calculateStars();
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-blue-50 to-purple-50">
        <Card className="p-8 max-w-md w-full text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Hoàn thành!</h2>
          
          <div className="flex justify-center mb-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 ${
                  star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="space-y-2 mb-6">
            <p className="text-xl">Điểm số: <span className="font-bold text-primary">{score}</span></p>
            <p>Số bóng bay đã nổ: {poppedBalloons.length}/{gameData.balloons.length}</p>
            <p>Thời gian còn lại: {formatTime(timeLeft)}</p>
            <p>Độ chính xác: {Math.round((score / (gameData.balloons.length * 10)) * 100)}%</p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Chơi lại
            </Button>
            {onBack && (
              <Button onClick={onBack}>
                Về trang chủ
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === 'popping') {
    const currentBalloon = gameData.balloons[currentBalloonIndex];
    
    return (
      <div className="h-full p-6 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{gameData.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">Điểm: {score}</div>
            <div className="text-sm text-muted-foreground">
              {poppedBalloons.length}/{gameData.balloons.length} bóng bay
            </div>
          </div>
        </div>

        <Progress value={(poppedBalloons.length / gameData.balloons.length) * 100} className="mb-6" />

        <Card className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 animate-bounce bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              💥
            </div>
            <h3 className="text-2xl font-bold mb-4">Câu hỏi {currentBalloonIndex + 1}</h3>
            <p className="text-xl">{currentBalloon.question}</p>
          </div>

          {!showExplanation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentBalloon.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? 
                    (index === currentBalloon.correctAnswer ? "default" : "destructive") : 
                    "outline"
                  }
                  className="p-6 h-auto text-left justify-start text-lg"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="font-semibold mr-3 text-xl">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Giải thích:</h4>
                <p className="text-lg">{currentBalloon.explanation}</p>
              </div>
              <div className="text-center">
                <Button onClick={nextQuestion} size="lg">
                  {currentBalloonIndex >= gameData.balloons.length - 1 ? 'Kết thúc' : 'Câu tiếp theo'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-gradient-to-b from-blue-50 to-purple-50 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{gameData.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Điểm: {score}</div>
          <div className="text-sm text-muted-foreground">
            {poppedBalloons.length}/{gameData.balloons.length} bóng bay
          </div>
        </div>
      </div>

      <Progress value={(poppedBalloons.length / gameData.balloons.length) * 100} className="mb-6 relative z-10" />

      <div className="text-center mb-8 relative z-10">
        <h2 className="text-xl font-semibold mb-2">Nhấp vào bóng bay để nổ và xem câu hỏi!</h2>
        <p className="text-muted-foreground">Trả lời đúng để ghi điểm. Thời gian có hạn!</p>
      </div>

      <div className="relative h-96 overflow-hidden">
        {gameData.balloons.map((balloon, index) => {
          const position = balloonPositions[index];
          const isPopped = poppedBalloons.includes(index);
          
          if (!position) return null;
          
          return (
            <div
              key={balloon.id}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <BalloonShape
                color={position.color}
                isPopped={isPopped}
                onClick={() => !isPopped && handleBalloonPop(index)}
              />
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-6 right-6 flex gap-3 z-20">
        <Button onClick={resetGame} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Chơi lại
        </Button>
        {onBack && (
          <Button onClick={onBack} variant="outline" size="sm">
            Về trang chủ
          </Button>
        )}
      </div>
    </div>
  );
};

export default BalloonPopTemplate;

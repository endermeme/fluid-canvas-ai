
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, RotateCcw, Star, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WheelSection {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  color: string;
  explanation: string;
}

interface SpinWheelData {
  title: string;
  description: string;
  wheelSections: WheelSection[];
  settings: {
    spinDuration: number;
    timePerQuestion: number;
    totalTime: number;
    allowSkip: boolean;
    showExplanation: boolean;
    autoSpin: boolean;
  };
}

interface SpinWheelTemplateProps {
  data: SpinWheelData;
  onBack?: () => void;
  topic?: string;
  content?: SpinWheelData;
}

const SpinWheelTemplate: React.FC<SpinWheelTemplateProps> = ({ 
  data, 
  onBack,
  topic = "",
  content
}) => {
  const gameData = content || data;
  const { toast } = useToast();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.totalTime || 300);
  const [gameState, setGameState] = useState<'spinning' | 'answering' | 'finished'>('spinning');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'answering' && timeLeft > 0) {
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

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const randomRotation = Math.floor(Math.random() * 360) + 720; // At least 2 full rotations
    setWheelRotation(prev => prev + randomRotation);
    
    setTimeout(() => {
      const sectionAngle = 360 / gameData.wheelSections.length;
      const finalAngle = (wheelRotation + randomRotation) % 360;
      const selectedIndex = Math.floor(finalAngle / sectionAngle);
      
      setCurrentSectionIndex(selectedIndex);
      setIsSpinning(false);
      setGameState('answering');
    }, gameData.settings.spinDuration * 1000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentSection = gameData.wheelSections[currentSectionIndex];
    const isCorrect = answerIndex === currentSection.correctAnswer;
    
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
    
    setAnsweredQuestions(prev => [...prev, currentSectionIndex]);
    
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
    
    if (answeredQuestions.length >= gameData.wheelSections.length - 1) {
      setGameState('finished');
    } else {
      setGameState('spinning');
    }
  };

  const resetGame = () => {
    setCurrentSectionIndex(0);
    setScore(0);
    setTimeLeft(gameData?.settings?.totalTime || 300);
    setGameState('spinning');
    setSelectedAnswer(null);
    setShowExplanation(false);
    setWheelRotation(0);
    setIsSpinning(false);
    setAnsweredQuestions([]);
  };

  const calculateStars = () => {
    const percentage = (score / (gameData.wheelSections.length * 10)) * 100;
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
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-purple-50 to-pink-50">
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
            <p>Câu đã trả lời: {answeredQuestions.length}/{gameData.wheelSections.length}</p>
            <p>Thời gian còn lại: {formatTime(timeLeft)}</p>
            <p>Độ chính xác: {Math.round((score / (answeredQuestions.length * 10)) * 100)}%</p>
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

  if (gameState === 'answering') {
    const currentSection = gameData.wheelSections[currentSectionIndex];
    
    return (
      <div className="h-full p-6 bg-gradient-to-b from-purple-50 to-pink-50">
        {/* Header */}
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
              {answeredQuestions.length}/{gameData.wheelSections.length} câu
            </div>
          </div>
        </div>

        {/* Progress */}
        <Progress value={(answeredQuestions.length / gameData.wheelSections.length) * 100} className="mb-6" />

        {/* Question Card */}
        <Card className="p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              style={{ backgroundColor: currentSection.color }}
            >
              🎯
            </div>
            <h3 className="text-xl font-bold mb-2">Câu hỏi {answeredQuestions.length + 1}</h3>
            <p className="text-lg">{currentSection.question}</p>
          </div>

          {!showExplanation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSection.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? 
                    (index === currentSection.correctAnswer ? "default" : "destructive") : 
                    "outline"
                  }
                  className="p-4 h-auto text-left justify-start"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Giải thích:</h4>
                <p>{currentSection.explanation}</p>
              </div>
              <div className="text-center">
                <Button onClick={nextQuestion}>
                  {answeredQuestions.length >= gameData.wheelSections.length - 1 ? 'Kết thúc' : 'Quay tiếp'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Spinning state - show wheel
  return (
    <div className="h-full p-6 bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
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
            {answeredQuestions.length}/{gameData.wheelSections.length} câu
          </div>
        </div>
      </div>

      {/* Progress */}
      <Progress value={(answeredQuestions.length / gameData.wheelSections.length) * 100} className="mb-6" />

      {/* Wheel */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div 
            className={`w-80 h-80 rounded-full border-8 border-white shadow-2xl transition-transform duration-${gameData.settings.spinDuration * 1000} ${isSpinning ? 'ease-out' : ''}`}
            style={{ 
              transform: `rotate(${wheelRotation}deg)`,
              background: `conic-gradient(${gameData.wheelSections.map((section, index) => 
                `${section.color} ${(index * 360) / gameData.wheelSections.length}deg ${((index + 1) * 360) / gameData.wheelSections.length}deg`
              ).join(', ')})`
            }}
          >
            {gameData.wheelSections.map((section, index) => {
              const angle = (360 / gameData.wheelSections.length) * index;
              return (
                <div
                  key={section.id}
                  className="absolute w-full h-full flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    transform: `rotate(${angle + (360 / gameData.wheelSections.length) / 2}deg)`,
                    transformOrigin: 'center'
                  }}
                >
                  <span 
                    className="absolute"
                    style={{ 
                      top: '20px',
                      transform: `rotate(-${angle + (360 / gameData.wheelSections.length) / 2}deg)`
                    }}
                  >
                    {index + 1}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Nhấp "Quay bánh xe" để bắt đầu!</h2>
          <p className="text-muted-foreground">Bánh xe sẽ chọn ngẫu nhiên một câu hỏi cho bạn</p>
        </div>

        <Button 
          onClick={spinWheel} 
          disabled={isSpinning}
          size="lg"
          className="min-w-40"
        >
          <Play className="h-5 w-5 mr-2" />
          {isSpinning ? 'Đang quay...' : 'Quay bánh xe'}
        </Button>
      </div>

      {/* Control Buttons */}
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

export default SpinWheelTemplate;

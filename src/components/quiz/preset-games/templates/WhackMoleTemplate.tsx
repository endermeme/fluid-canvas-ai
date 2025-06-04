
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, RotateCcw, Star, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
}

interface Mole {
  id: string;
  holeIndex: number;
  answer: string;
  isCorrect: boolean;
  showTime: number;
}

interface WhackMoleData {
  title: string;
  description: string;
  questions: Question[];
  settings: {
    gameTime: number;
    moleShowTime: number;
    pointsPerCorrect: number;
    pointsPerWrong: number;
    holesCount: number;
    maxMolesAtOnce: number;
  };
}

interface WhackMoleTemplateProps {
  data: WhackMoleData;
  onBack?: () => void;
  topic?: string;
  content?: WhackMoleData;
}

const MoleComponent: React.FC<{ isCorrect: boolean; answer: string; onClick: () => void; isHit: boolean }> = ({ 
  isCorrect, 
  answer, 
  onClick, 
  isHit 
}) => {
  if (isHit) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-4xl animate-ping z-10">
        💥
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer transform hover:scale-110 transition-transform animate-bounce z-10"
      onClick={onClick}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg relative ${
        isCorrect ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gradient-to-b from-red-400 to-red-600'
      }`}>
        <div className="w-12 h-10 bg-gray-600 rounded-full relative">
          <div className="absolute top-1 left-2 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-1 right-2 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-300 rounded-full"></div>
          <div className="absolute top-6 left-3 w-2 h-1 bg-white rounded-full"></div>
          <div className="absolute top-6 right-3 w-2 h-1 bg-white rounded-full"></div>
          <div className="absolute -top-1 left-1 w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="absolute -top-1 right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
        </div>
      </div>
      <div className="absolute -bottom-8 bg-white px-2 py-1 rounded text-xs font-semibold shadow-md max-w-20 truncate border">
        {answer}
      </div>
    </div>
  );
};

const WhackMoleTemplate: React.FC<WhackMoleTemplateProps> = ({ 
  data, 
  onBack,
  topic = "",
  content
}) => {
  const gameData = content || data;
  const { toast } = useToast();
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.gameTime || 60);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'finished'>('ready');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeMoles, setActiveMoles] = useState<Mole[]>([]);
  const [hitMoles, setHitMoles] = useState<string[]>([]);

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

  const spawnMole = useCallback(() => {
    if (gameState !== 'playing' || currentQuestionIndex >= gameData.questions.length) return;
    
    const currentQuestion = gameData.questions[currentQuestionIndex];
    const availableHoles = Array.from({ length: gameData.settings.holesCount }, (_, i) => i)
      .filter(hole => !activeMoles.some(mole => mole.holeIndex === hole));
    
    if (availableHoles.length === 0 || activeMoles.length >= 3) return;
    
    const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    const allAnswers = [currentQuestion.correctAnswer, ...currentQuestion.wrongAnswers];
    const randomAnswer = allAnswers[Math.floor(Math.random() * allAnswers.length)];
    
    const newMole: Mole = {
      id: `mole-${Date.now()}-${randomHole}`,
      holeIndex: randomHole,
      answer: randomAnswer,
      isCorrect: randomAnswer === currentQuestion.correctAnswer,
      showTime: gameData.settings.moleShowTime
    };
    
    setActiveMoles(prev => [...prev, newMole]);
    
    setTimeout(() => {
      setActiveMoles(prev => prev.filter(mole => mole.id !== newMole.id));
    }, gameData.settings.moleShowTime * 1000);
    
  }, [gameState, currentQuestionIndex, activeMoles, gameData]);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        spawnMole();
      }, 1200);
      
      return () => clearInterval(interval);
    }
  }, [gameState, spawnMole]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMoleClick = (mole: Mole) => {
    if (hitMoles.includes(mole.id)) return;
    
    setHitMoles(prev => [...prev, mole.id]);
    setActiveMoles(prev => prev.filter(m => m.id !== mole.id));
    
    if (mole.isCorrect) {
      setScore(prev => prev + gameData.settings.pointsPerCorrect);
      toast({
        title: "Chính xác!",
        description: `+${gameData.settings.pointsPerCorrect} điểm`,
      });
      
      if (currentQuestionIndex < gameData.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } else {
      setScore(prev => Math.max(0, prev + gameData.settings.pointsPerWrong));
      toast({
        title: "Sai rồi!",
        description: `${gameData.settings.pointsPerWrong} điểm`,
        variant: "destructive"
      });
    }
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(gameData.settings.gameTime);
    setScore(0);
    setCurrentQuestionIndex(0);
    setActiveMoles([]);
    setHitMoles([]);
  };

  const pauseGame = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setGameState('ready');
    setTimeLeft(gameData.settings.gameTime);
    setScore(0);
    setCurrentQuestionIndex(0);
    setActiveMoles([]);
    setHitMoles([]);
  };

  const calculateStars = () => {
    const maxScore = gameData.questions.length * gameData.settings.pointsPerCorrect;
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 3;
    if (percentage >= 60) return 2;
    if (percentage >= 40) return 1;
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
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-green-50 to-yellow-50">
        <Card className="p-8 max-w-md w-full text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Hết giờ!</h2>
          
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
            <p>Câu đã trả lời: {currentQuestionIndex}/{gameData.questions.length}</p>
            <p>Chuột đã đập: {hitMoles.length}</p>
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

  const currentQuestion = gameData.questions[currentQuestionIndex];

  return (
    <div className="h-full p-4 bg-gradient-to-b from-green-50 to-yellow-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{gameData.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Điểm: {score}</div>
          <div className="text-sm text-muted-foreground">
            Câu {currentQuestionIndex + 1}/{gameData.questions.length}
          </div>
        </div>
      </div>

      <Progress value={(currentQuestionIndex / gameData.questions.length) * 100} className="mb-4" />

      {gameState !== 'ready' && currentQuestion && (
        <Card className="p-4 mb-4 text-center bg-blue-50">
          <h3 className="text-lg font-bold">{currentQuestion.question}</h3>
          <p className="text-sm text-muted-foreground mt-1">Đập chuột có đáp án đúng!</p>
        </Card>
      )}

      <div className="flex justify-center mb-4 gap-3">
        {gameState === 'ready' && (
          <Button onClick={startGame} size="lg">
            <Play className="h-5 w-5 mr-2" />
            Bắt đầu
          </Button>
        )}
        {(gameState === 'playing' || gameState === 'paused') && (
          <Button onClick={pauseGame} variant="outline">
            {gameState === 'playing' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {gameState === 'playing' ? 'Tạm dừng' : 'Tiếp tục'}
          </Button>
        )}
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Chơi lại
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: gameData.settings.holesCount }, (_, index) => {
            const moleInHole = activeMoles.find(mole => mole.holeIndex === index);
            const isHit = moleInHole && hitMoles.includes(moleInHole.id);
            
            return (
              <div 
                key={index}
                className="relative w-28 h-28 mx-auto"
              >
                <div className="w-28 h-28 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full border-4 border-amber-800 shadow-inner relative">
                  <div className="absolute inset-2 bg-black rounded-full opacity-50"></div>
                </div>
                
                {moleInHole && (
                  <MoleComponent
                    isCorrect={moleInHole.isCorrect}
                    answer={moleInHole.answer}
                    onClick={() => handleMoleClick(moleInHole)}
                    isHit={isHit}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {gameState === 'ready' && (
        <div className="text-center mt-8">
          <h2 className="text-xl font-semibold mb-2">Cách chơi:</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Nhấp vào chuột có đáp án đúng! Chuột xanh = đúng, chuột đỏ = sai. 
            Thời gian có hạn, hãy nhanh tay!
          </p>
        </div>
      )}

      {onBack && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={onBack} variant="outline" size="sm">
            Về trang chủ
          </Button>
        </div>
      )}
    </div>
  );
};

export default WhackMoleTemplate;

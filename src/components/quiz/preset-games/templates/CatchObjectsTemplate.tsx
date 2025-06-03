
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, RotateCcw, Star, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  correctObjects: string[];
  wrongObjects: string[];
  category: string;
}

interface FallingObject {
  id: string;
  content: string;
  x: number;
  y: number;
  isCorrect: boolean;
  speed: number;
}

interface CatchObjectsData {
  title: string;
  description: string;
  questions: Question[];
  settings: {
    gameTime: number;
    objectSpeed: number;
    spawnRate: number;
    pointsPerCorrect: number;
    pointsPerWrong: number;
    basketSize: number;
    objectSize: number;
  };
}

interface CatchObjectsTemplateProps {
  data: CatchObjectsData;
  onBack?: () => void;
  topic?: string;
  content?: CatchObjectsData;
}

const CatchObjectsTemplate: React.FC<CatchObjectsTemplateProps> = ({ 
  data, 
  onBack,
  topic = "",
  content
}) => {
  const gameData = content || data;
  const { toast } = useToast();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.gameTime || 90);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'finished'>('ready');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [basketPosition, setBasketPosition] = useState(50); // percentage from left
  const [caughtObjects, setCaughtObjects] = useState<{correct: number, wrong: number}>({correct: 0, wrong: 0});

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

  // Object spawning
  const spawnObject = useCallback(() => {
    if (gameState !== 'playing' || currentQuestionIndex >= gameData.questions.length) return;
    
    const currentQuestion = gameData.questions[currentQuestionIndex];
    const allObjects = [...currentQuestion.correctObjects, ...currentQuestion.wrongObjects];
    const randomObject = allObjects[Math.floor(Math.random() * allObjects.length)];
    const isCorrect = currentQuestion.correctObjects.includes(randomObject);
    
    const newObject: FallingObject = {
      id: `obj-${Date.now()}-${Math.random()}`,
      content: randomObject,
      x: Math.random() * 90 + 5, // 5% to 95% from left
      y: -10,
      isCorrect,
      speed: gameData.settings.objectSpeed + Math.random() * 1
    };
    
    setFallingObjects(prev => [...prev, newObject]);
  }, [gameState, currentQuestionIndex, gameData]);

  // Spawn objects periodically
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        spawnObject();
      }, gameData.settings.spawnRate * 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameState, spawnObject, gameData.settings.spawnRate]);

  // Move objects and check collisions
  useEffect(() => {
    if (gameState === 'playing') {
      const moveInterval = setInterval(() => {
        setFallingObjects(prev => {
          const gameArea = gameAreaRef.current;
          if (!gameArea) return prev;
          
          const gameHeight = gameArea.clientHeight;
          const basketWidth = gameData.settings.basketSize;
          const objectSize = gameData.settings.objectSize;
          
          return prev.map(obj => {
            const newY = obj.y + obj.speed;
            
            // Check collision with basket
            const basketLeft = basketPosition - basketWidth / 200; // Convert to percentage
            const basketRight = basketPosition + basketWidth / 200;
            const basketTop = 85; // Basket is at 85% from top
            
            if (newY >= basketTop && newY <= basketTop + 10 && 
                obj.x >= basketLeft && obj.x <= basketRight) {
              // Collision detected
              if (obj.isCorrect) {
                setScore(prev => prev + gameData.settings.pointsPerCorrect);
                setCaughtObjects(prev => ({...prev, correct: prev.correct + 1}));
                toast({
                  title: "Đúng rồi!",
                  description: `+${gameData.settings.pointsPerCorrect} điểm`,
                });
              } else {
                setScore(prev => Math.max(0, prev + gameData.settings.pointsPerWrong));
                setCaughtObjects(prev => ({...prev, wrong: prev.wrong + 1}));
                toast({
                  title: "Sai rồi!",
                  description: `${gameData.settings.pointsPerWrong} điểm`,
                  variant: "destructive"
                });
              }
              return null; // Remove object
            }
            
            // Remove objects that fall off screen
            if (newY > 100) {
              return null;
            }
            
            return { ...obj, y: newY };
          }).filter(Boolean) as FallingObject[];
        });
      }, 50); // 20 FPS
      
      return () => clearInterval(moveInterval);
    }
  }, [gameState, basketPosition, gameData.settings, toast]);

  // Mouse movement for basket
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState === 'playing' && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setBasketPosition(Math.max(5, Math.min(95, x)));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(gameData.settings.gameTime);
    setScore(0);
    setCurrentQuestionIndex(0);
    setFallingObjects([]);
    setCaughtObjects({correct: 0, wrong: 0});
    setBasketPosition(50);
  };

  const pauseGame = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setGameState('ready');
    setTimeLeft(gameData.settings.gameTime);
    setScore(0);
    setCurrentQuestionIndex(0);
    setFallingObjects([]);
    setCaughtObjects({correct: 0, wrong: 0});
    setBasketPosition(50);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < gameData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFallingObjects([]);
    } else {
      setGameState('finished');
    }
  };

  const calculateStars = () => {
    const accuracy = caughtObjects.correct + caughtObjects.wrong > 0 
      ? (caughtObjects.correct / (caughtObjects.correct + caughtObjects.wrong)) * 100 
      : 0;
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    if (accuracy >= 50) return 1;
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
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-cyan-50 to-blue-50">
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
            <p>Bắt đúng: {caughtObjects.correct}</p>
            <p>Bắt sai: {caughtObjects.wrong}</p>
            <p>Độ chính xác: {Math.round((caughtObjects.correct / (caughtObjects.correct + caughtObjects.wrong || 1)) * 100)}%</p>
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
    <div className="h-full p-6 bg-gradient-to-b from-cyan-50 to-blue-50">
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
            Đúng: {caughtObjects.correct} | Sai: {caughtObjects.wrong}
          </div>
        </div>
      </div>

      {/* Progress */}
      <Progress value={(currentQuestionIndex / gameData.questions.length) * 100} className="mb-6" />

      {/* Current Question */}
      {gameState !== 'ready' && currentQuestion && (
        <Card className="p-4 mb-6 text-center bg-blue-50">
          <h3 className="text-lg font-bold">{currentQuestion.question}</h3>
          <p className="text-sm text-muted-foreground mt-1">Di chuyển chuột để điều khiển rổ bắt đúng {currentQuestion.category}!</p>
        </Card>
      )}

      {/* Game Controls */}
      <div className="flex justify-center mb-6 gap-3">
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
        {gameState !== 'ready' && (
          <Button onClick={nextQuestion} variant="outline">
            Câu tiếp theo
          </Button>
        )}
      </div>

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        className="relative h-96 bg-gradient-to-b from-sky-200 to-sky-400 rounded-lg overflow-hidden cursor-none border-4 border-white shadow-lg"
        onMouseMove={handleMouseMove}
      >
        {/* Falling Objects */}
        {fallingObjects.map((obj) => (
          <div
            key={obj.id}
            className="absolute text-2xl transition-none pointer-events-none"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              width: `${gameData.settings.objectSize}px`,
              height: `${gameData.settings.objectSize}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: obj.isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              border: `2px solid ${obj.isCorrect ? '#22c55e' : '#ef4444'}`
            }}
          >
            {obj.content}
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute bottom-4 transition-all duration-100 ease-out"
          style={{
            left: `${basketPosition}%`,
            transform: 'translateX(-50%)',
            width: `${gameData.settings.basketSize}px`,
            height: '40px'
          }}
        >
          <div className="w-full h-full bg-amber-600 rounded-b-full border-4 border-amber-800 flex items-center justify-center">
            🧺
          </div>
        </div>

        {/* Instructions */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Cách chơi:</h2>
              <p className="text-lg">Di chuyển chuột để điều khiển rổ</p>
              <p>Bắt các vật thể đúng, tránh vật thể sai!</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold">Tạm dừng</h2>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-20">
        {onBack && (
          <Button onClick={onBack} variant="outline" size="sm">
            Về trang chủ
          </Button>
        )}
      </div>
    </div>
  );
};

export default CatchObjectsTemplate;

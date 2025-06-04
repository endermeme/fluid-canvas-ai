
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import CatchObjectsHeader from './components/CatchObjectsHeader';
import GameArea from './components/GameArea';
import GameControls from './components/GameControls';
import GameResultModal from './components/GameResultModal';
import './styles/catch-objects.css';

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

interface CatchObjectsGameProps {
  data?: CatchObjectsData;
  content?: CatchObjectsData;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const CatchObjectsGame: React.FC<CatchObjectsGameProps> = ({ 
  data, 
  content,
  topic,
  onBack,
  onShare
}) => {
  const gameData = content || data;
  const { toast } = useToast();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.gameTime || 90);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'finished'>('ready');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [basketPosition, setBasketPosition] = useState(50);
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
      x: Math.random() * 90 + 5,
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
          
          return prev.map(obj => {
            const newY = obj.y + obj.speed;
            
            // Check collision with basket
            const basketLeft = basketPosition - basketWidth / 200;
            const basketRight = basketPosition + basketWidth / 200;
            const basketTop = 85;
            
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
              return null;
            }
            
            if (newY > 100) {
              return null;
            }
            
            return { ...obj, y: newY };
          }).filter(Boolean) as FallingObject[];
        });
      }, 50);
      
      return () => clearInterval(moveInterval);
    }
  }, [gameState, basketPosition, gameData.settings, toast]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState === 'playing' && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setBasketPosition(Math.max(5, Math.min(95, x)));
    }
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

  if (!gameData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Đang tải dữ liệu game...</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <GameResultModal
        score={score}
        caughtObjects={caughtObjects}
        onRestart={resetGame}
        onBack={onBack}
      />
    );
  }

  const currentQuestion = gameData.questions[currentQuestionIndex];

  return (
    <div className="catch-objects-game">
      <CatchObjectsHeader
        title={gameData.title}
        timeLeft={timeLeft}
        score={score}
        caughtObjects={caughtObjects}
      />

      {gameState !== 'ready' && currentQuestion && (
        <div className="current-question">
          <h3 className="question-title">{currentQuestion.question}</h3>
          <p className="question-subtitle">Di chuyển chuột để điều khiển rổ bắt đúng {currentQuestion.category}!</p>
        </div>
      )}

      <GameControls
        gameState={gameState}
        onStart={startGame}
        onPause={pauseGame}
        onRestart={resetGame}
        onNext={nextQuestion}
        onBack={onBack}
      />

      <GameArea
        ref={gameAreaRef}
        gameState={gameState}
        fallingObjects={fallingObjects}
        basketPosition={basketPosition}
        basketSize={gameData.settings.basketSize}
        objectSize={gameData.settings.objectSize}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
};

export default CatchObjectsGame;

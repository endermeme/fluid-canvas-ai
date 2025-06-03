
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Play, Pause } from 'lucide-react';

interface CatchObjectsData {
  title: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
  settings: {
    timePerQuestion: number;
    totalTime: number;
    objectSpeed?: number;
  };
}

interface CatchObjectsTemplateProps {
  data: CatchObjectsData;
  onBack: () => void;
}

interface FallingObject {
  id: number;
  x: number;
  y: number;
  text: string;
  isCorrect: boolean;
  color: string;
  speed: number;
  questionIndex: number;
}

const CatchObjectsTemplate: React.FC<CatchObjectsTemplateProps> = ({ data, onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(data?.settings?.totalTime || 60);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [basketPosition, setBasksetPosition] = useState(50);
  const [showCurrentQuestion, setShowCurrentQuestion] = useState(true);
  const [lives, setLives] = useState(3);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, isPaused, gameOver]);

  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      createFallingObject();
      animateObjects();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [gameStarted, isPaused, gameOver, currentQuestionIndex]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameAreaRef.current && gameStarted && !isPaused && !gameOver) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setBasksetPosition(Math.max(5, Math.min(95, x)));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameStarted, isPaused, gameOver]);

  const createFallingObject = () => {
    if (!data?.questions || currentQuestionIndex >= data.questions.length) return;

    const currentQuestion = data.questions[currentQuestionIndex];
    const allOptions = [...currentQuestion.options];
    
    // Tạo object ngẫu nhiên từ các đáp án
    const randomIndex = Math.floor(Math.random() * allOptions.length);
    const selectedOption = allOptions[randomIndex];
    const isCorrect = randomIndex === currentQuestion.correctAnswer;

    const newObject: FallingObject = {
      id: Date.now() + Math.random(),
      x: Math.random() * 90 + 5, // 5% to 95%
      y: -10,
      text: selectedOption,
      isCorrect,
      color: isCorrect ? '#22C55E' : '#EF4444',
      speed: (data?.settings?.objectSpeed || 3) + Math.random() * 2,
      questionIndex: currentQuestionIndex
    };

    setFallingObjects(prev => [...prev, newObject]);

    // Tạo object tiếp theo sau khoảng thời gian ngẫu nhiên
    setTimeout(() => {
      if (gameStarted && !gameOver) {
        createFallingObject();
      }
    }, 1000 + Math.random() * 2000);
  };

  const animateObjects = () => {
    setFallingObjects(prev => 
      prev
        .map(obj => ({ ...obj, y: obj.y + obj.speed }))
        .filter(obj => {
          // Nếu object chạm đáy, trừ mạng nếu là đáp án đúng
          if (obj.y > 100) {
            if (obj.isCorrect) {
              setLives(prevLives => {
                const newLives = prevLives - 1;
                if (newLives <= 0) {
                  setGameOver(true);
                }
                return newLives;
              });
            }
            return false;
          }
          return true;
        })
    );

    if (gameStarted && !isPaused && !gameOver) {
      animationRef.current = requestAnimationFrame(animateObjects);
    }
  };

  const handleObjectCatch = (obj: FallingObject) => {
    // Kiểm tra nếu object trong phạm vi rổ
    const basketWidth = 10; // 10% width
    const basketLeft = basketPosition - basketWidth / 2;
    const basketRight = basketPosition + basketWidth / 2;

    if (obj.x >= basketLeft && obj.x <= basketRight && obj.y >= 80 && obj.y <= 100) {
      setFallingObjects(prev => prev.filter(o => o.id !== obj.id));

      if (obj.isCorrect) {
        setScore(prev => prev + 10);
        // Chuyển sang câu hỏi tiếp theo
        if (currentQuestionIndex < data.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          setGameOver(true);
        }
      } else {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
          }
          return newLives;
        });
      }
    }
  };

  // Check collision continuously
  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      const checkCollisions = () => {
        fallingObjects.forEach(obj => {
          const basketWidth = 10;
          const basketLeft = basketPosition - basketWidth / 2;
          const basketRight = basketPosition + basketWidth / 2;

          if (obj.x >= basketLeft && obj.x <= basketRight && obj.y >= 80 && obj.y <= 100) {
            handleObjectCatch(obj);
          }
        });
      };

      const interval = setInterval(checkCollisions, 50);
      return () => clearInterval(interval);
    }
  }, [fallingObjects, basketPosition, gameStarted, isPaused, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setTimeLeft(data?.settings?.totalTime || 60);
    setCurrentQuestionIndex(0);
    setFallingObjects([]);
    setIsPaused(false);
    setBasksetPosition(50);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setTimeLeft(data?.settings?.totalTime || 60);
    setCurrentQuestionIndex(0);
    setFallingObjects([]);
    setIsPaused(false);
    setBasksetPosition(50);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (!data?.questions) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6 text-center">
          <h3 className="text-xl font-bold mb-4">Không có dữ liệu game</h3>
          <Button onClick={onBack}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-200 to-green-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <h1 className="text-xl font-bold">{data.title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold">Điểm: {score}</div>
          <div className="text-lg font-bold">❤️ {lives}</div>
          <div className="text-lg font-bold">
            ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          
          {gameStarted && !gameOver && (
            <Button onClick={togglePause} variant="outline" size="sm">
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          )}
          
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Question Display */}
      {gameStarted && !gameOver && showCurrentQuestion && data.questions[currentQuestionIndex] && (
        <div className="p-4 bg-yellow-100 border-b">
          <div className="text-center">
            <p className="text-lg font-bold">
              🎯 {data.questions[currentQuestionIndex].question}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Bắt đáp án đúng (màu xanh) và tránh đáp án sai (màu đỏ)!
            </p>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div className="flex-1 relative overflow-hidden" ref={gameAreaRef}>
        {!gameStarted ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center bg-white/90">
              <h2 className="text-3xl font-bold mb-4">🎯 Catch the Answer!</h2>
              <p className="mb-6 text-gray-600 text-lg">
                Di chuyển chuột để điều khiển rổ.<br/>
                Bắt đáp án đúng và tránh đáp án sai!
              </p>
              <Button onClick={startGame} size="lg" className="bg-green-500 hover:bg-green-600">
                Bắt đầu chơi
              </Button>
            </Card>
          </div>
        ) : gameOver ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center bg-white/90">
              <h2 className="text-3xl font-bold mb-4">
                {lives <= 0 ? "💔 Game Over!" : "🎉 Hoàn thành!"}
              </h2>
              <p className="text-2xl mb-2">Điểm cuối cùng: <span className="font-bold text-green-600">{score}</span></p>
              <p className="mb-6 text-gray-600 text-lg">
                Bạn đã trả lời đúng {Math.floor(score / 10)}/{data.questions.length} câu hỏi!
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  Chơi lại
                </Button>
                <Button onClick={onBack} variant="outline">
                  Quay lại
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <>
            {/* Falling Objects */}
            {fallingObjects.map(obj => (
              <div
                key={obj.id}
                className="absolute px-3 py-2 rounded-lg text-white font-bold text-sm text-center shadow-lg transition-all"
                style={{
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                  backgroundColor: obj.color,
                  transform: 'translateX(-50%)',
                  minWidth: '80px',
                  maxWidth: '120px'
                }}
              >
                {obj.text}
              </div>
            ))}

            {/* Basket */}
            <div
              className="absolute bottom-4 w-20 h-16 bg-yellow-600 rounded-b-lg flex items-center justify-center text-2xl transition-all duration-100"
              style={{
                left: `${basketPosition}%`,
                transform: 'translateX(-50%)'
              }}
            >
              🧺
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-white/80 p-3 rounded-lg">
              <p className="text-sm font-medium">
                📱 Di chuyển chuột để điều khiển rổ
              </p>
            </div>

            {isPaused && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Card className="p-6 text-center bg-white">
                  <h3 className="text-xl font-bold mb-4">Game đã tạm dừng</h3>
                  <Button onClick={togglePause}>Tiếp tục</Button>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CatchObjectsTemplate;

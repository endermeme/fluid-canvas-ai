
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Play, Pause } from 'lucide-react';

interface SnakeQuizData {
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
    gameSpeed?: number;
  };
}

interface SnakeQuizTemplateProps {
  data: SnakeQuizData;
  onBack: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface Food {
  position: Position;
  questionIndex: number;
  isCorrect: boolean;
}

const SnakeQuizTemplate: React.FC<SnakeQuizTemplateProps> = ({ data, onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [food, setFood] = useState<Food | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameSpeed = data?.settings?.gameSpeed || 150;

  const CANVAS_SIZE = 400;
  const GRID_SIZE = 20;

  const generateFood = useCallback(() => {
    if (!data?.questions) return;
    
    const x = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE));
    const y = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE));
    const questionIndex = Math.floor(Math.random() * data.questions.length);
    
    setFood({
      position: { x, y },
      questionIndex,
      isCorrect: true
    });
  }, [data?.questions]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw food
    if (food) {
      ctx.fillStyle = '#f00';
      ctx.fillRect(food.position.x * GRID_SIZE, food.position.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
      
      // Draw question mark on food
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('?', 
        food.position.x * GRID_SIZE + GRID_SIZE / 2, 
        food.position.y * GRID_SIZE + GRID_SIZE / 2 + 4
      );
    }
  }, [snake, food]);

  const checkCollision = useCallback(() => {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || 
        head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
      return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    
    return false;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (isPaused || showQuestion || !gameStarted || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;
      newSnake.unshift(head);

      // Check food collision
      if (food && head.x === food.position.x && head.y === food.position.y) {
        setCurrentQuestion(food.questionIndex);
        setShowQuestion(true);
        setIsPaused(true);
        setFood(null);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, showQuestion, gameStarted, gameOver]);

  useEffect(() => {
    if (checkCollision()) {
      setGameOver(true);
    }
  }, [checkCollision]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameSpeed]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  useEffect(() => {
    if (gameStarted && !food && !showQuestion) {
      generateFood();
    }
  }, [gameStarted, food, showQuestion, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || isPaused || showQuestion) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, isPaused, showQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!data?.questions) return;

    const question = data.questions[currentQuestion];
    const isCorrect = answerIndex === question.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      // Grow snake
      setSnake(prev => [...prev, prev[prev.length - 1]]);
    }

    setShowQuestion(false);
    setIsPaused(false);
    generateFood();
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setFood(null);
    setShowQuestion(false);
    setIsPaused(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setFood(null);
    setShowQuestion(false);
    setIsPaused(false);
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
    <div className="flex flex-col h-full bg-gradient-to-b from-green-900 to-black">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <h1 className="text-xl font-bold">{data.title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold">Điểm: {score}</div>
          <div className="text-lg font-bold">Độ dài: {snake.length}</div>
          
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

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {!gameStarted ? (
          <Card className="p-8 text-center bg-white/90">
            <h2 className="text-3xl font-bold mb-4">🐍 Snake Quiz</h2>
            <p className="mb-6 text-gray-600 text-lg">
              Điều khiển rắn bằng phím mũi tên để ăn thức ăn.<br/>
              Trả lời câu hỏi để rắn lớn lên!
            </p>
            <div className="mb-4 text-sm text-gray-500">
              ⬆️⬇️⬅️➡️ Sử dụng phím mũi tên để điều khiển
            </div>
            <Button onClick={startGame} size="lg" className="bg-green-600 hover:bg-green-700">
              Bắt đầu chơi
            </Button>
          </Card>
        ) : gameOver ? (
          <Card className="p-8 text-center bg-white/90">
            <h2 className="text-3xl font-bold mb-4">🏆 Game Over!</h2>
            <p className="text-2xl mb-2">Điểm cuối cùng: <span className="font-bold text-green-600">{score}</span></p>
            <p className="text-xl mb-4">Độ dài rắn: <span className="font-bold">{snake.length}</span></p>
            <p className="mb-6 text-gray-600">
              Bạn đã trả lời đúng {Math.floor(score / 10)} câu hỏi!
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                Chơi lại
              </Button>
              <Button onClick={onBack} variant="outline">
                Quay lại
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="border-2 border-green-400 bg-black"
            />
            
            <div className="text-white text-center">
              <p className="text-sm">Sử dụng phím mũi tên để điều khiển rắn</p>
              <p className="text-xs text-gray-300 mt-1">Ăn thức ăn đỏ để nhận câu hỏi!</p>
            </div>

            {isPaused && !showQuestion && (
              <Card className="p-4 text-center bg-white/90">
                <h3 className="text-lg font-bold mb-2">Game đã tạm dừng</h3>
                <Button onClick={togglePause}>Tiếp tục</Button>
              </Card>
            )}
          </div>
        )}

        {/* Question Modal */}
        {showQuestion && data.questions[currentQuestion] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4">
            <Card className="p-6 max-w-2xl w-full bg-white">
              <h3 className="text-xl font-bold mb-4">
                🐍 {data.questions[currentQuestion].question}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {data.questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant="outline"
                    className="text-left justify-start p-4 h-auto hover:bg-green-50"
                  >
                    <span className="font-bold mr-3 text-green-600">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeQuizTemplate;

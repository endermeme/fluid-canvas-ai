
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Play, Pause } from 'lucide-react';

interface TetrisQuizData {
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
    dropSpeed?: number;
  };
}

interface TetrisQuizTemplateProps {
  data: TetrisQuizData;
  onBack: () => void;
}

const TetrisQuizTemplate: React.FC<TetrisQuizTemplateProps> = ({ data, onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 600;
  const BLOCK_SIZE = 30;
  const BOARD_WIDTH = CANVAS_WIDTH / BLOCK_SIZE;
  const BOARD_HEIGHT = CANVAS_HEIGHT / BLOCK_SIZE;

  const [board, setBoard] = useState<number[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );

  const [currentPiece, setCurrentPiece] = useState({
    shape: [[1, 1, 1, 1]], // I-piece
    x: Math.floor(BOARD_WIDTH / 2) - 2,
    y: 0,
    color: '#00f'
  });

  const pieces = [
    { shape: [[1, 1, 1, 1]], color: '#00f' }, // I
    { shape: [[1, 1], [1, 1]], color: '#ff0' }, // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#800080' }, // T
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#0f0' }, // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00' }, // Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#ffa500' }, // J
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#0ff' }, // L
  ];

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x]) {
          ctx.fillStyle = '#666';
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      }
    }

    // Draw current piece
    if (currentPiece && !showQuestion) {
      ctx.fillStyle = currentPiece.color;
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
          if (value) {
            const x = (currentPiece.x + dx) * BLOCK_SIZE;
            const y = (currentPiece.y + dy) * BLOCK_SIZE;
            ctx.fillRect(x, y, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });
    }

    // Draw grid
    ctx.strokeStyle = '#333';
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * BLOCK_SIZE);
      ctx.stroke();
    }
  }, [board, currentPiece, showQuestion]);

  const checkCollision = useCallback((piece: any, board: number[][], dx = 0, dy = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const rotatePiece = useCallback((piece: any) => {
    const rotated = piece.shape[0].map((_: any, index: number) =>
      piece.shape.map((row: any) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const clearLines = useCallback(() => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) linesCleared++;
      return !isFull;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100);
      setBoard(newBoard);
      
      // Show question after clearing lines
      if (data?.questions && Math.random() < 0.3) { // 30% chance
        setCurrentQuestion(Math.floor(Math.random() * data.questions.length));
        setShowQuestion(true);
        setIsPaused(true);
      }
    }
  }, [board, data?.questions]);

  const placePiece = useCallback(() => {
    const newBoard = [...board];
    currentPiece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) {
          const boardX = currentPiece.x + dx;
          const boardY = currentPiece.y + dy;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      });
    });
    
    setBoard(newBoard);
    
    // Generate new piece
    const newPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const newCurrentPiece = {
      ...newPiece,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    };
    
    // Check game over
    if (checkCollision(newCurrentPiece, newBoard)) {
      setGameOver(true);
      return;
    }
    
    setCurrentPiece(newCurrentPiece);
    
    setTimeout(() => {
      clearLines();
    }, 100);
  }, [board, currentPiece, checkCollision, clearLines, pieces]);

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!checkCollision(currentPiece, board, dx, dy)) {
      setCurrentPiece(prev => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy
      }));
    } else if (dy > 0) {
      placePiece();
    }
  }, [currentPiece, board, checkCollision, placePiece]);

  const dropPiece = useCallback(() => {
    if (!isPaused && !showQuestion && gameStarted && !gameOver) {
      movePiece(0, 1);
    }
  }, [movePiece, isPaused, showQuestion, gameStarted, gameOver]);

  useEffect(() => {
    const dropInterval = setInterval(dropPiece, data?.settings?.dropSpeed || 500);
    return () => clearInterval(dropInterval);
  }, [dropPiece, data?.settings?.dropSpeed]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || isPaused || showQuestion || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          break;
        case 'ArrowUp':
        case ' ':
          const rotated = rotatePiece(currentPiece);
          if (!checkCollision(rotated, board)) {
            setCurrentPiece(rotated);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, board, checkCollision, rotatePiece, movePiece, gameStarted, isPaused, showQuestion, gameOver]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!data?.questions) return;

    const question = data.questions[currentQuestion];
    const isCorrect = answerIndex === question.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 50);
    }

    setShowQuestion(false);
    setIsPaused(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    const newPiece = pieces[Math.floor(Math.random() * pieces.length)];
    setCurrentPiece({
      ...newPiece,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    });
    setShowQuestion(false);
    setIsPaused(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
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
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-900 to-black">
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
          <div className="text-lg font-bold">Dòng: {lines}</div>
          
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
            <h2 className="text-3xl font-bold mb-4">🧩 Tetris Quiz</h2>
            <p className="mb-6 text-gray-600 text-lg">
              Xếp các khối Tetris để xóa dòng.<br/>
              Trả lời câu hỏi để ghi thêm điểm!
            </p>
            <div className="mb-4 text-sm text-gray-500">
              ⬅️➡️ Di chuyển | ⬇️ Rơi nhanh | ⬆️/Space Xoay
            </div>
            <Button onClick={startGame} size="lg" className="bg-purple-600 hover:bg-purple-700">
              Bắt đầu chơi
            </Button>
          </Card>
        ) : gameOver ? (
          <Card className="p-8 text-center bg-white/90">
            <h2 className="text-3xl font-bold mb-4">🏆 Game Over!</h2>
            <p className="text-2xl mb-2">Điểm cuối cùng: <span className="font-bold text-purple-600">{score}</span></p>
            <p className="text-xl mb-4">Dòng đã xóa: <span className="font-bold">{lines}</span></p>
            <p className="mb-6 text-gray-600">
              Bạn đã trả lời đúng {Math.floor((score % 1000) / 50)} câu hỏi!
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
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
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-2 border-purple-400 bg-black"
            />
            
            <div className="text-white text-center">
              <p className="text-sm">⬅️➡️ Di chuyển | ⬇️ Rơi nhanh | ⬆️ Xoay</p>
              <p className="text-xs text-gray-300 mt-1">Xóa dòng để nhận câu hỏi!</p>
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
                🧩 {data.questions[currentQuestion].question}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {data.questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant="outline"
                    className="text-left justify-start p-4 h-auto hover:bg-purple-50"
                  >
                    <span className="font-bold mr-3 text-purple-600">
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

export default TetrisQuizTemplate;

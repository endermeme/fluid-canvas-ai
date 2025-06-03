
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Play, Pause } from 'lucide-react';

interface BalloonData {
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
    balloonSpeed?: number;
  };
}

interface BalloonPopTemplateProps {
  data: BalloonData;
  onBack: () => void;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  questionIndex: number;
  speed: number;
}

const BalloonPopTemplate: React.FC<BalloonPopTemplateProps> = ({ data, onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(data?.settings?.totalTime || 300);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedBalloon, setSelectedBalloon] = useState<Balloon | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];

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
      createBalloon();
      animateBalloons();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [gameStarted, isPaused, gameOver]);

  const createBalloon = () => {
    const gameArea = gameAreaRef.current;
    if (!gameArea || !data?.questions) return;

    const newBalloon: Balloon = {
      id: Date.now(),
      x: Math.random() * (gameArea.clientWidth - 80),
      y: gameArea.clientHeight,
      color: colors[Math.floor(Math.random() * colors.length)],
      questionIndex: Math.floor(Math.random() * data.questions.length),
      speed: (data?.settings?.balloonSpeed || 2) + Math.random() * 2
    };

    setBalloons(prev => [...prev, newBalloon]);

    setTimeout(() => {
      if (gameStarted && !gameOver) {
        createBalloon();
      }
    }, 2000 + Math.random() * 3000);
  };

  const animateBalloons = () => {
    setBalloons(prev => 
      prev
        .map(balloon => ({
          ...balloon,
          y: balloon.y - balloon.speed
        }))
        .filter(balloon => balloon.y > -100)
    );

    if (gameStarted && !isPaused && !gameOver) {
      animationRef.current = requestAnimationFrame(animateBalloons);
    }
  };

  const handleBalloonClick = (balloon: Balloon) => {
    if (!data?.questions || gameOver) return;
    
    setSelectedBalloon(balloon);
    setCurrentQuestionIndex(balloon.questionIndex);
    setShowQuestion(true);
    setIsPaused(true);
    
    setBalloons(prev => prev.filter(b => b.id !== balloon.id));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!data?.questions || !selectedBalloon) return;

    const currentQuestion = data.questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    setShowQuestion(false);
    setSelectedBalloon(null);
    setIsPaused(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(data?.settings?.totalTime || 300);
    setBalloons([]);
    setShowQuestion(false);
    setIsPaused(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(data?.settings?.totalTime || 300);
    setBalloons([]);
    setShowQuestion(false);
    setIsPaused(false);
    setCurrentQuestionIndex(0);
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
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-200 to-sky-400">
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
          <div className="text-lg font-bold">Thời gian: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
          
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
      <div className="flex-1 relative overflow-hidden" ref={gameAreaRef}>
        {!gameStarted ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center bg-white/90">
              <h2 className="text-2xl font-bold mb-4">🎈 Balloon Pop Quiz</h2>
              <p className="mb-6 text-gray-600">
                Nhấp vào bóng bay để trả lời câu hỏi và ghi điểm!
              </p>
              <Button onClick={startGame} size="lg" className="bg-pink-500 hover:bg-pink-600">
                Bắt đầu chơi
              </Button>
            </Card>
          </div>
        ) : gameOver ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center bg-white/90">
              <h2 className="text-2xl font-bold mb-4">🎉 Game Over!</h2>
              <p className="text-xl mb-2">Điểm của bạn: <span className="font-bold text-green-600">{score}</span></p>
              <p className="mb-6 text-gray-600">
                Bạn đã trả lời {Math.floor(score / 10)} câu hỏi đúng!
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={startGame} className="bg-pink-500 hover:bg-pink-600">
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
            {/* Balloons */}
            {balloons.map(balloon => (
              <div
                key={balloon.id}
                className="absolute cursor-pointer transition-transform hover:scale-110"
                style={{
                  left: balloon.x,
                  top: balloon.y,
                  width: '80px',
                  height: '100px'
                }}
                onClick={() => handleBalloonClick(balloon)}
              >
                <div
                  className="w-16 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: balloon.color }}
                >
                  ?
                </div>
                <div
                  className="w-1 h-8 mx-auto"
                  style={{ backgroundColor: balloon.color }}
                />
              </div>
            ))}

            {isPaused && !showQuestion && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Card className="p-6 text-center bg-white">
                  <h3 className="text-xl font-bold mb-4">Game đã tạm dừng</h3>
                  <Button onClick={togglePause}>Tiếp tục</Button>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Question Modal */}
        {showQuestion && selectedBalloon && data.questions[currentQuestionIndex] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4">
            <Card className="p-6 max-w-2xl w-full bg-white">
              <h3 className="text-xl font-bold mb-4">
                {data.questions[currentQuestionIndex].question}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {data.questions[currentQuestionIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant="outline"
                    className="text-left justify-start p-4 h-auto"
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
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

export default BalloonPopTemplate;

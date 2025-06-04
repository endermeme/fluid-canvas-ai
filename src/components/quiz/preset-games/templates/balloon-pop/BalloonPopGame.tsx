
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import BalloonPopHeader from './components/BalloonPopHeader';
import BalloonField from './components/BalloonField';
import QuestionModal from './components/QuestionModal';
import GameResult from './components/GameResult';
import './styles/balloon-pop.css';

interface BalloonPopGameProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ 
  data, 
  content, 
  topic, 
  onBack,
  onShare 
}) => {
  const gameData = content || data;
  const { toast } = useToast();
  
  const [currentBalloonIndex, setCurrentBalloonIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.totalTime || 300);
  const [gameState, setGameState] = useState<'playing' | 'finished' | 'question'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);

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

  const handleBalloonPop = (balloonIndex: number) => {
    if (poppedBalloons.includes(balloonIndex) || gameState !== 'playing') return;
    
    setCurrentBalloonIndex(balloonIndex);
    setGameState('question');
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

  if (!gameData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Đang tải dữ liệu game...</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <GameResult
        score={score}
        totalQuestions={gameData.balloons.length}
        poppedBalloons={poppedBalloons.length}
        timeLeft={timeLeft}
        onRestart={resetGame}
        onBack={onBack}
      />
    );
  }

  if (gameState === 'question') {
    return (
      <QuestionModal
        question={gameData.balloons[currentBalloonIndex]}
        questionIndex={currentBalloonIndex}
        selectedAnswer={selectedAnswer}
        showExplanation={showExplanation}
        onAnswerSelect={handleAnswerSelect}
        onNext={nextQuestion}
        score={score}
        timeLeft={timeLeft}
        totalQuestions={gameData.balloons.length}
      />
    );
  }

  return (
    <div className="balloon-game-container">
      <BalloonPopHeader 
        title={gameData.title}
        score={score}
        timeLeft={timeLeft}
        poppedCount={poppedBalloons.length}
        totalCount={gameData.balloons.length}
        onShare={onShare}
      />
      
      <BalloonField
        balloons={gameData.balloons}
        poppedBalloons={poppedBalloons}
        onBalloonPop={handleBalloonPop}
      />
      
      <div className="fixed bottom-6 right-6 flex gap-3 z-20">
        <button 
          onClick={resetGame}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
        >
          🔄 Chơi lại
        </button>
        {onBack && (
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
          >
            🏠 Về trang chủ
          </button>
        )}
      </div>
    </div>
  );
};

export default BalloonPopGame;

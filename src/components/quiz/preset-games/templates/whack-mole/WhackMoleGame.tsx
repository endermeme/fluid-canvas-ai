
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import WhackMoleHeader from './components/WhackMoleHeader';
import GameField from './components/GameField';
import GameResultModal from './components/GameResultModal';
import GameStartScreen from './components/GameStartScreen';
import './styles/whack-mole.css';

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

interface WhackMoleGameProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const WhackMoleGame: React.FC<WhackMoleGameProps> = ({ data, content, topic, onBack, onShare }) => {
  const gameData = content || data;
  const { toast } = useToast();
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.gameTime || 60);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'finished'>('ready');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeMoles, setActiveMoles] = useState<Mole[]>([]);
  const [hitMoles, setHitMoles] = useState<string[]>([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [lastUsedHoles, setLastUsedHoles] = useState<number[]>([]);

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

  // Thuật toán spawn chuột thông minh hơn
  const spawnMoles = useCallback(() => {
    if (gameState !== 'playing' || currentQuestionIndex >= gameData.questions.length) return;
    
    const currentQuestion = gameData.questions[currentQuestionIndex];
    const totalHoles = gameData.settings.holesCount;
    
    // Lấy các lỗ có sẵn (không có chuột)
    const availableHoles = Array.from({ length: totalHoles }, (_, i) => i)
      .filter(hole => !activeMoles.some(mole => mole.holeIndex === hole));
    
    // Tránh spawn ở những lỗ vừa được sử dụng để tăng độ khó
    const preferredHoles = availableHoles.filter(hole => !lastUsedHoles.includes(hole));
    const holesPool = preferredHoles.length >= 3 ? preferredHoles : availableHoles;
    
    if (holesPool.length < 3) return;
    
    // Chọn 3 lỗ ngẫu nhiên
    const selectedHoles = holesPool
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Tạo danh sách đáp án (1 đúng, 2 sai)
    const allAnswers = [currentQuestion.correctAnswer, ...currentQuestion.wrongAnswers];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    
    const newMoles: Mole[] = selectedHoles.map((holeIndex, index) => ({
      id: `mole-${Date.now()}-${holeIndex}-${Math.random()}`,
      holeIndex,
      answer: shuffledAnswers[index],
      isCorrect: shuffledAnswers[index] === currentQuestion.correctAnswer,
      showTime: gameData.settings.moleShowTime
    }));
    
    setActiveMoles(prev => [...prev, ...newMoles]);
    setLastUsedHoles(selectedHoles);
    
    // Auto-hide moles sau thời gian show
    newMoles.forEach(mole => {
      setTimeout(() => {
        setActiveMoles(prev => prev.filter(m => m.id !== mole.id));
      }, (gameData.settings.moleShowTime + Math.random() * 0.5) * 1000); // Thêm random để khó đoán hơn
    });
    
  }, [gameState, currentQuestionIndex, activeMoles, gameData, lastUsedHoles]);

  useEffect(() => {
    if (gameState === 'playing') {
      // Tăng tốc độ spawn dần theo thời gian để khó hơn
      const baseInterval = 2500;
      const speedupFactor = Math.max(0.7, 1 - (60 - timeLeft) / 120); // Nhanh hơn theo thời gian
      const interval = setInterval(() => {
        spawnMoles();
      }, baseInterval * speedupFactor);
      
      return () => clearInterval(interval);
    }
  }, [gameState, spawnMoles, timeLeft]);

  const handleMoleClick = (mole: Mole) => {
    if (hitMoles.includes(mole.id)) return;
    
    setHitMoles(prev => [...prev, mole.id]);
    setActiveMoles(prev => prev.filter(m => m.id !== mole.id));
    
    if (mole.isCorrect) {
      setScore(prev => prev + gameData.settings.pointsPerCorrect);
      setCorrectAnswersCount(prev => prev + 1);
      toast({
        title: "Chính xác! 🎯",
        description: `+${gameData.settings.pointsPerCorrect} điểm`,
      });
      
      // Chuyển câu hỏi tiếp theo
      if (currentQuestionIndex < gameData.questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
          setActiveMoles([]); // Clear các chuột hiện tại
        }, 1000);
      }
    } else {
      setScore(prev => Math.max(0, prev + gameData.settings.pointsPerWrong));
      toast({
        title: "Sai rồi! ❌",
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
    setCorrectAnswersCount(0);
    setLastUsedHoles([]);
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
    setCorrectAnswersCount(0);
    setLastUsedHoles([]);
  };

  if (!gameData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Đang tải dữ liệu game...</p>
      </div>
    );
  }

  return (
    <div className="whack-mole-game h-full bg-gradient-to-b from-green-50 to-yellow-50">
      {gameState === 'ready' && (
        <GameStartScreen 
          title={gameData.title}
          description="Đập chuột có đáp án đúng! Chuột sẽ không hiển thị đáp án - bạn phải nhớ và đoán!"
          onStart={startGame}
        />
      )}

      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <WhackMoleHeader 
            title={gameData.title}
            timeLeft={timeLeft}
            score={score}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={gameData.questions.length}
            onShare={onShare}
            onPause={pauseGame}
            onReset={resetGame}
            gameState={gameState}
          />
          
          <GameField
            question={gameData.questions[currentQuestionIndex]}
            activeMoles={activeMoles}
            hitMoles={hitMoles}
            holesCount={gameData.settings.holesCount}
            onMoleClick={handleMoleClick}
            gameState={gameState}
          />
        </>
      )}

      {gameState === 'finished' && (
        <GameResultModal
          score={score}
          currentQuestionIndex={correctAnswersCount}
          totalQuestions={gameData.questions.length}
          hitMoles={hitMoles.length}
          onRestart={resetGame}
          onBack={onBack}
          pointsPerCorrect={gameData.settings.pointsPerCorrect}
        />
      )}
    </div>
  );
};

export default WhackMoleGame;

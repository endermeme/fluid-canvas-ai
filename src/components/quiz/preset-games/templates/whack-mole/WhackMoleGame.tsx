
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

  const spawnMoles = useCallback(() => {
    if (gameState !== 'playing' || currentQuestionIndex >= gameData.questions.length) return;
    
    const currentQuestion = gameData.questions[currentQuestionIndex];
    const availableHoles = Array.from({ length: gameData.settings.holesCount }, (_, i) => i)
      .filter(hole => !activeMoles.some(mole => mole.holeIndex === hole));
    
    if (availableHoles.length < 3) return;
    
    // Spawn 3 moles at once
    const selectedHoles = availableHoles.sort(() => Math.random() - 0.5).slice(0, 3);
    const allAnswers = [currentQuestion.correctAnswer, ...currentQuestion.wrongAnswers];
    
    const newMoles: Mole[] = selectedHoles.map((holeIndex, index) => {
      const answer = allAnswers[index] || allAnswers[Math.floor(Math.random() * allAnswers.length)];
      return {
        id: `mole-${Date.now()}-${holeIndex}`,
        holeIndex,
        answer,
        isCorrect: answer === currentQuestion.correctAnswer,
        showTime: gameData.settings.moleShowTime
      };
    });
    
    setActiveMoles(prev => [...prev, ...newMoles]);
    
    // Auto-hide moles after show time
    newMoles.forEach(mole => {
      setTimeout(() => {
        setActiveMoles(prev => prev.filter(m => m.id !== mole.id));
      }, gameData.settings.moleShowTime * 1000);
    });
    
  }, [gameState, currentQuestionIndex, activeMoles, gameData]);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        spawnMoles();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [gameState, spawnMoles]);

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
          description={gameData.description}
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
          currentQuestionIndex={currentQuestionIndex}
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

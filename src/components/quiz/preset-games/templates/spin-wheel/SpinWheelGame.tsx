
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import SpinWheelHeader from './components/SpinWheelHeader';
import WheelComponent from './components/WheelComponent';
import QuestionAnswerModal from './components/QuestionAnswerModal';
import GameResultModal from './components/GameResultModal';
import './styles/spin-wheel.css';

interface SpinWheelGameProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const SpinWheelGame: React.FC<SpinWheelGameProps> = ({ data, content, topic, onShare, onBack }) => {
  const gameData = content || data;
  const { toast } = useToast();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.totalTime || 300);
  const [gameState, setGameState] = useState<'spinning' | 'answering' | 'finished'>('spinning');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (gameState === 'answering' && timeLeft > 0) {
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

  const handleSpinComplete = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setGameState('answering');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentSection = gameData.wheelSections[currentSectionIndex];
    const isCorrect = answerIndex === currentSection.correctAnswer;
    
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
    
    setAnsweredQuestions(prev => [...prev, currentSectionIndex]);
    
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
    
    if (answeredQuestions.length >= gameData.wheelSections.length - 1) {
      setGameState('finished');
    } else {
      setGameState('spinning');
    }
  };

  const resetGame = () => {
    setCurrentSectionIndex(0);
    setScore(0);
    setTimeLeft(gameData?.settings?.totalTime || 300);
    setGameState('spinning');
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions([]);
  };

  if (!gameData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Đang tải dữ liệu game...</p>
      </div>
    );
  }

  return (
    <div className="spin-wheel-game h-full bg-gradient-to-b from-purple-50 to-pink-50">
      <SpinWheelHeader 
        title={gameData.title}
        timeLeft={timeLeft}
        score={score}
        answeredQuestions={answeredQuestions.length}
        totalQuestions={gameData.wheelSections.length}
        onShare={onShare}
      />

      {gameState === 'spinning' && (
        <WheelComponent 
          sections={gameData.wheelSections}
          onSpinComplete={handleSpinComplete}
          spinDuration={gameData.settings.spinDuration}
        />
      )}

      {gameState === 'answering' && (
        <QuestionAnswerModal
          section={gameData.wheelSections[currentSectionIndex]}
          onAnswerSelect={handleAnswerSelect}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          onNext={nextQuestion}
          answeredCount={answeredQuestions.length}
          totalQuestions={gameData.wheelSections.length}
        />
      )}

      {gameState === 'finished' && (
        <GameResultModal
          score={score}
          answeredQuestions={answeredQuestions.length}
          totalQuestions={gameData.wheelSections.length}
          timeLeft={timeLeft}
          onRestart={resetGame}
          onBack={onBack}
        />
      )}
    </div>
  );
};

export default SpinWheelGame;

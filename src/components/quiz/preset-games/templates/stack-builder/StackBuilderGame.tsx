
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import StackBuilderHeader from './components/StackBuilderHeader';
import GameArea from './components/GameArea';
import GameControls from './components/GameControls';
import GameResultModal from './components/GameResultModal';
import HintPanel from './components/HintPanel';
import './styles/stack-builder.css';

interface Block {
  id: string;
  content: string;
  correctPosition: number;
  color: string;
}

interface Sequence {
  id: number;
  question: string;
  blocks: Block[];
  explanation: string;
}

interface StackBuilderData {
  title: string;
  description: string;
  sequences: Sequence[];
  settings: {
    timePerSequence: number;
    totalTime: number;
    pointsPerCorrect: number;
    allowHints: boolean;
    showExplanation: boolean;
  };
}

interface StackBuilderGameProps {
  data?: StackBuilderData;
  content?: StackBuilderData;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const StackBuilderGame: React.FC<StackBuilderGameProps> = ({ 
  data, 
  content,
  topic,
  onBack,
  onShare
}) => {
  const gameData = content || data;
  const { toast } = useToast();
  
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameData?.settings?.totalTime || 300);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [playerOrder, setPlayerOrder] = useState<Block[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<Block[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Initialize blocks for current sequence
  useEffect(() => {
    if (gameData && currentSequenceIndex < gameData.sequences.length) {
      const currentSequence = gameData.sequences[currentSequenceIndex];
      const shuffledBlocks = [...currentSequence.blocks].sort(() => Math.random() - 0.5);
      setAvailableBlocks(shuffledBlocks);
      setPlayerOrder([]);
      setShowExplanation(false);
      setShowHint(false);
    }
  }, [currentSequenceIndex, gameData]);

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

  const moveBlockToStack = (block: Block) => {
    setPlayerOrder(prev => [...prev, block]);
    setAvailableBlocks(prev => prev.filter(b => b.id !== block.id));
  };

  const moveBlockToAvailable = (block: Block) => {
    setAvailableBlocks(prev => [...prev, block]);
    setPlayerOrder(prev => prev.filter(b => b.id !== block.id));
  };

  const checkSequence = () => {
    const currentSequence = gameData.sequences[currentSequenceIndex];
    const isCorrect = playerOrder.every((block, index) => 
      block.correctPosition === index
    );

    if (isCorrect && playerOrder.length === currentSequence.blocks.length) {
      setScore(prev => prev + gameData.settings.pointsPerCorrect);
      toast({
        title: "Chính xác!",
        description: `+${gameData.settings.pointsPerCorrect} điểm`,
      });
      
      if (gameData.settings.showExplanation) {
        setShowExplanation(true);
      } else {
        setTimeout(() => {
          nextSequence();
        }, 1500);
      }
    } else {
      toast({
        title: "Chưa đúng!",
        description: "Hãy thử sắp xếp lại theo thứ tự khác.",
        variant: "destructive"
      });
    }
  };

  const nextSequence = () => {
    if (currentSequenceIndex >= gameData.sequences.length - 1) {
      setGameState('finished');
    } else {
      setCurrentSequenceIndex(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentSequenceIndex(0);
    setScore(0);
    setTimeLeft(gameData?.settings?.totalTime || 300);
    setGameState('playing');
    setPlayerOrder([]);
    setShowExplanation(false);
    setShowHint(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
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
        totalSequences={gameData.sequences.length}
        currentSequence={currentSequenceIndex}
        timeLeft={timeLeft}
        onRestart={resetGame}
        onBack={onBack}
      />
    );
  }

  const currentSequence = gameData.sequences[currentSequenceIndex];

  if (showExplanation) {
    return (
      <div className="h-full p-6 bg-gradient-to-b from-orange-50 to-red-50">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="explanation-card">
            <h3 className="text-xl font-bold mb-4">Giải thích</h3>
            <p className="text-lg mb-6">{currentSequence.explanation}</p>
            <button className="explanation-btn" onClick={nextSequence}>
              {currentSequenceIndex >= gameData.sequences.length - 1 ? 'Kết thúc' : 'Tiếp theo'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack-builder-game">
      <StackBuilderHeader
        title={gameData.title}
        timeLeft={timeLeft}
        score={score}
        currentSequence={currentSequenceIndex + 1}
        totalSequences={gameData.sequences.length}
      />

      <GameArea
        currentSequence={currentSequence}
        availableBlocks={availableBlocks}
        playerOrder={playerOrder}
        onMoveToStack={moveBlockToStack}
        onMoveToAvailable={moveBlockToAvailable}
      />

      <GameControls
        onCheckSequence={checkSequence}
        onToggleHint={toggleHint}
        onRestart={resetGame}
        onBack={onBack}
        canCheck={playerOrder.length === currentSequence.blocks.length}
        allowHints={gameData.settings.allowHints}
        showHintText={showHint ? 'Ẩn gợi ý' : 'Gợi ý'}
      />

      {showHint && (
        <HintPanel
          firstBlock={currentSequence.blocks.find(b => b.correctPosition === 0)?.content || ''}
        />
      )}
    </div>
  );
};

export default StackBuilderGame;


import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, RotateCcw, Star, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface StackBuilderTemplateProps {
  data: StackBuilderData;
  onBack?: () => void;
  topic?: string;
  content?: StackBuilderData;
}

const StackBuilderTemplate: React.FC<StackBuilderTemplateProps> = ({ 
  data, 
  onBack,
  topic = "",
  content
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
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (e: React.DragEvent, block: Block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnStack = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock) {
      setPlayerOrder(prev => [...prev, draggedBlock]);
      setAvailableBlocks(prev => prev.filter(block => block.id !== draggedBlock.id));
      setDraggedBlock(null);
    }
  };

  const handleDropOnAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock && playerOrder.includes(draggedBlock)) {
      setAvailableBlocks(prev => [...prev, draggedBlock]);
      setPlayerOrder(prev => prev.filter(block => block.id !== draggedBlock.id));
      setDraggedBlock(null);
    }
  };

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

  const calculateStars = () => {
    const maxScore = gameData.sequences.length * gameData.settings.pointsPerCorrect;
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  if (!gameData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Đang tải dữ liệu game...</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    const stars = calculateStars();
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-orange-50 to-red-50">
        <Card className="p-8 max-w-md w-full text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Hoàn thành!</h2>
          
          <div className="flex justify-center mb-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 ${
                  star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="space-y-2 mb-6">
            <p className="text-xl">Điểm số: <span className="font-bold text-primary">{score}</span></p>
            <p>Chuỗi hoàn thành: {currentSequenceIndex}/{gameData.sequences.length}</p>
            <p>Thời gian còn lại: {formatTime(timeLeft)}</p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Chơi lại
            </Button>
            {onBack && (
              <Button onClick={onBack}>
                Về trang chủ
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const currentSequence = gameData.sequences[currentSequenceIndex];

  if (showExplanation) {
    return (
      <div className="h-full p-6 bg-gradient-to-b from-orange-50 to-red-50">
        <Card className="p-6 max-w-2xl mx-auto mt-20">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Giải thích</h3>
            <p className="text-lg mb-6">{currentSequence.explanation}</p>
            <Button onClick={nextSequence}>
              {currentSequenceIndex >= gameData.sequences.length - 1 ? 'Kết thúc' : 'Tiếp theo'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-gradient-to-b from-orange-50 to-red-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{gameData.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Điểm: {score}</div>
          <div className="text-sm text-muted-foreground">
            {currentSequenceIndex + 1}/{gameData.sequences.length} chuỗi
          </div>
        </div>
      </div>

      {/* Progress */}
      <Progress value={(currentSequenceIndex / gameData.sequences.length) * 100} className="mb-6" />

      {/* Question */}
      <Card className="p-4 mb-6 text-center bg-blue-50">
        <h3 className="text-lg font-bold">{currentSequence.question}</h3>
        <p className="text-sm text-muted-foreground mt-1">Kéo thả các khối vào vùng xếp hạng bên dưới</p>
      </Card>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Blocks */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-center">Các khối có sẵn</h4>
            <div 
              className="min-h-40 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
              onDragOver={handleDragOver}
              onDrop={handleDropOnAvailable}
            >
              <div className="grid grid-cols-2 gap-3">
                {availableBlocks.map((block) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, block)}
                    onClick={() => moveBlockToStack(block)}
                    className="p-3 rounded-lg text-white font-bold text-center cursor-move hover:scale-105 transition-transform shadow-md"
                    style={{ backgroundColor: block.color }}
                  >
                    {block.content}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stack Area */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-center">Thứ tự của bạn</h4>
            <div 
              className="min-h-40 p-4 border-2 border-dashed border-primary rounded-lg bg-primary/5"
              onDragOver={handleDragOver}
              onDrop={handleDropOnStack}
            >
              <div className="space-y-2">
                {playerOrder.map((block, index) => (
                  <div
                    key={`${block.id}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, block)}
                    onClick={() => moveBlockToAvailable(block)}
                    className="p-3 rounded-lg text-white font-bold text-center cursor-move hover:scale-105 transition-transform shadow-md flex items-center justify-between"
                    style={{ backgroundColor: block.color }}
                  >
                    <span className="text-sm opacity-75">{index + 1}.</span>
                    <span>{block.content}</span>
                    <span></span>
                  </div>
                ))}
                {playerOrder.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Kéo các khối vào đây để sắp xếp
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={checkSequence}
            disabled={playerOrder.length !== currentSequence.blocks.length}
            size="lg"
          >
            Kiểm tra thứ tự
          </Button>
          
          {gameData.settings.allowHints && (
            <Button onClick={toggleHint} variant="outline">
              <Lightbulb className="h-4 w-4 mr-2" />
              {showHint ? 'Ẩn gợi ý' : 'Gợi ý'}
            </Button>
          )}
        </div>

        {/* Hint */}
        {showHint && (
          <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
            <p className="text-center text-sm text-yellow-800">
              Gợi ý: Khối đầu tiên phải là "<strong>{currentSequence.blocks.find(b => b.correctPosition === 0)?.content}</strong>"
            </p>
          </Card>
        )}
      </div>

      {/* Control Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-20">
        <Button onClick={resetGame} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Chơi lại
        </Button>
        {onBack && (
          <Button onClick={onBack} variant="outline" size="sm">
            Về trang chủ
          </Button>
        )}
      </div>
    </div>
  );
};

export default StackBuilderTemplate;

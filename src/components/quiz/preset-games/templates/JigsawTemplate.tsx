
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Shuffle } from 'lucide-react';

interface JigsawData {
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
    puzzleSize?: number;
  };
}

interface JigsawTemplateProps {
  data: JigsawData;
  onBack: () => void;
}

interface PuzzlePiece {
  id: number;
  text: string;
  correctPosition: number;
  currentPosition: number;
  isPlaced: boolean;
  questionIndex: number;
}

const JigsawTemplate: React.FC<JigsawTemplateProps> = ({ data, onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [completedPieces, setCompletedPieces] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const puzzleSize = data?.settings?.puzzleSize || 4; // 2x2 puzzle by default

  useEffect(() => {
    if (gameStarted && data?.questions) {
      generatePuzzle();
    }
  }, [gameStarted, currentQuestionIndex, data]);

  const generatePuzzle = () => {
    if (!data?.questions || currentQuestionIndex >= data.questions.length) return;

    const currentQuestion = data.questions[currentQuestionIndex];
    const pieces: PuzzlePiece[] = [];

    // Tạo các mảnh ghép từ câu hỏi và đáp án
    const allTexts = [currentQuestion.question, ...currentQuestion.options];
    
    for (let i = 0; i < puzzleSize; i++) {
      const text = allTexts[i % allTexts.length];
      pieces.push({
        id: i,
        text: text.length > 30 ? text.substring(0, 27) + '...' : text,
        correctPosition: i,
        currentPosition: -1, // -1 means not placed
        isPlaced: false,
        questionIndex: currentQuestionIndex
      });
    }

    // Shuffle pieces
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
    setPuzzlePieces(shuffledPieces);
    setCompletedPieces([]);
    setShowSuccess(false);
  };

  const handleDragStart = (piece: PuzzlePiece) => {
    setDraggedPiece(piece);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault();
    
    if (!draggedPiece) return;

    // Check if position is already occupied
    const isOccupied = puzzlePieces.some(p => p.currentPosition === targetPosition && p.id !== draggedPiece.id);
    if (isOccupied) return;

    // Update piece position
    setPuzzlePieces(prev => prev.map(piece => {
      if (piece.id === draggedPiece.id) {
        const isCorrectPosition = targetPosition === piece.correctPosition;
        return {
          ...piece,
          currentPosition: targetPosition,
          isPlaced: true
        };
      }
      return piece;
    }));

    // Check if piece is in correct position
    if (targetPosition === draggedPiece.correctPosition) {
      setCompletedPieces(prev => [...prev, draggedPiece.id]);
      setScore(prevScore => prevScore + 10);
    }

    setDraggedPiece(null);

    // Check if puzzle is complete
    setTimeout(() => {
      const allPiecesPlaced = puzzlePieces.every(p => p.currentPosition !== -1);
      const allCorrect = completedPieces.length + 1 >= puzzleSize; // +1 for the piece just placed

      if (allCorrect) {
        setShowSuccess(true);
        setTimeout(() => {
          if (currentQuestionIndex < data.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            setGameOver(true);
          }
        }, 2000);
      }
    }, 100);
  };

  const handlePieceClick = (piece: PuzzlePiece) => {
    // Mobile touch support - find first empty position
    const firstEmptyPosition = Array.from({length: puzzleSize}, (_, i) => i)
      .find(pos => !puzzlePieces.some(p => p.currentPosition === pos));
    
    if (firstEmptyPosition !== undefined && !piece.isPlaced) {
      handleDrop({preventDefault: () => {}} as React.DragEvent, firstEmptyPosition);
    }
  };

  const shufflePieces = () => {
    setPuzzlePieces(prev => {
      const unplacedPieces = prev.filter(p => !p.isPlaced);
      const placedPieces = prev.filter(p => p.isPlaced);
      const shuffled = [...unplacedPieces].sort(() => Math.random() - 0.5);
      return [...placedPieces, ...shuffled];
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setCompletedPieces([]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setPuzzlePieces([]);
    setCompletedPieces([]);
    setDraggedPiece(null);
    setShowSuccess(false);
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
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-200 to-purple-200">
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
          <div className="text-lg font-bold">
            Câu {currentQuestionIndex + 1}/{data.questions.length}
          </div>
          
          {gameStarted && !gameOver && (
            <Button onClick={shufflePieces} variant="outline" size="sm">
              <Shuffle className="h-4 w-4" />
            </Button>
          )}
          
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 p-6">
        {!gameStarted ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center bg-white/90">
              <h2 className="text-3xl font-bold mb-4">🧩 Jigsaw Puzzle</h2>
              <p className="mb-6 text-gray-600 text-lg">
                Kéo thả các mảnh ghép vào đúng vị trí để hoàn thành puzzle!
              </p>
              <Button onClick={startGame} size="lg" className="bg-indigo-500 hover:bg-indigo-600">
                Bắt đầu chơi
              </Button>
            </Card>
          </div>
        ) : gameOver ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center bg-white/90">
              <h2 className="text-3xl font-bold mb-4">🎊 Xuất sắc!</h2>
              <p className="text-2xl mb-2">Điểm cuối cùng: <span className="font-bold text-indigo-600">{score}</span></p>
              <p className="mb-6 text-gray-600 text-lg">
                Bạn đã hoàn thành tất cả {data.questions.length} puzzle!
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={startGame} className="bg-indigo-500 hover:bg-indigo-600">
                  Chơi lại
                </Button>
                <Button onClick={onBack} variant="outline">
                  Quay lại
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Puzzle Board */}
            <div className="flex-1 flex flex-col items-center">
              <Card className="p-6 bg-white/90 w-full max-w-2xl">
                <h3 className="text-lg font-bold mb-4 text-center">
                  Ghép puzzle cho: {data.questions[currentQuestionIndex]?.question}
                </h3>
                
                <div 
                  className="grid gap-2 mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(puzzleSize))}, 1fr)`,
                    maxWidth: '400px'
                  }}
                >
                  {Array.from({length: puzzleSize}, (_, index) => {
                    const piece = puzzlePieces.find(p => p.currentPosition === index);
                    const isCorrectPosition = piece && completedPieces.includes(piece.id);
                    
                    return (
                      <div
                        key={index}
                        className={`
                          h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center
                          transition-all duration-200
                          ${piece ? 'border-solid bg-white' : 'bg-gray-50'}
                          ${isCorrectPosition ? 'border-green-500 bg-green-50' : ''}
                        `}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {piece && (
                          <div className="text-sm font-medium text-center p-2">
                            {piece.text}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Pieces Container */}
            <div className="w-full lg:w-80">
              <Card className="p-4 bg-white/90">
                <h3 className="text-lg font-bold mb-4">Mảnh ghép</h3>
                <div className="grid grid-cols-2 gap-3">
                  {puzzlePieces
                    .filter(piece => !piece.isPlaced)
                    .map(piece => (
                      <div
                        key={piece.id}
                        className="bg-indigo-100 border-2 border-indigo-300 rounded-lg p-3 cursor-move hover:bg-indigo-200 transition-colors"
                        draggable
                        onDragStart={() => handleDragStart(piece)}
                        onClick={() => handlePieceClick(piece)}
                      >
                        <div className="text-sm font-medium text-center">
                          {piece.text}
                        </div>
                      </div>
                    ))}
                </div>
                
                {puzzlePieces.filter(p => !p.isPlaced).length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Tất cả mảnh ghép đã được đặt!
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <Card className="p-8 text-center bg-white animate-bounce">
              <h3 className="text-2xl font-bold text-green-600 mb-2">🎉 Hoàn thành!</h3>
              <p className="text-lg">Puzzle đã được ghép thành công!</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default JigsawTemplate;


import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Play } from 'lucide-react';

interface SpinWheelData {
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
  };
}

interface SpinWheelTemplateProps {
  data: SpinWheelData;
  onBack: () => void;
}

const SpinWheelTemplate: React.FC<SpinWheelTemplateProps> = ({ data, onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const wheelColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FECA57', '#FF9FF3', '#54A0FF', '#FD79A8'
  ];

  const spinWheel = () => {
    if (isSpinning || !data?.questions) return;
    
    setIsSpinning(true);
    
    const spins = 5 + Math.random() * 5; // 5-10 vòng quay
    const finalRotation = rotation + (spins * 360) + Math.random() * 360;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      
      // Chọn câu hỏi random
      const questionIndex = Math.floor(Math.random() * data.questions.length);
      setCurrentQuestionIndex(questionIndex);
      setShowQuestion(true);
    }, 3000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!data?.questions) return;

    const currentQuestion = data.questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    setShowQuestion(false);
    
    // Check if game should end
    if (currentQuestionIndex >= data.questions.length - 1) {
      setGameOver(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowQuestion(false);
    setRotation(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowQuestion(false);
    setIsSpinning(false);
    setRotation(0);
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
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-200 to-pink-200">
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
            Câu hỏi: {currentQuestionIndex + 1}/{data.questions.length}
          </div>
          
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {!gameStarted ? (
          <Card className="p-8 text-center bg-white/90">
            <h2 className="text-3xl font-bold mb-4">🎡 Spin the Wheel!</h2>
            <p className="mb-6 text-gray-600 text-lg">
              Quay bánh xe may mắn để nhận câu hỏi bất ngờ!
            </p>
            <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Bắt đầu chơi
            </Button>
          </Card>
        ) : gameOver ? (
          <Card className="p-8 text-center bg-white/90">
            <h2 className="text-3xl font-bold mb-4">🎊 Chúc mừng!</h2>
            <p className="text-2xl mb-2">Điểm cuối cùng: <span className="font-bold text-green-600">{score}</span></p>
            <p className="mb-6 text-gray-600 text-lg">
              Bạn đã hoàn thành {data.questions.length} câu hỏi!
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={startGame} className="bg-gradient-to-r from-purple-500 to-pink-500">
                Chơi lại
              </Button>
              <Button onClick={onBack} variant="outline">
                Quay lại
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {/* Spinning Wheel */}
            <div className="relative">
              <div
                ref={wheelRef}
                className="w-80 h-80 rounded-full border-8 border-white shadow-2xl relative overflow-hidden transition-transform duration-3000 ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: `conic-gradient(${wheelColors.map((color, index) => 
                    `${color} ${index * (360 / wheelColors.length)}deg ${(index + 1) * (360 / wheelColors.length)}deg`
                  ).join(', ')})`
                }}
              >
                {/* Wheel segments with numbers */}
                {wheelColors.map((color, index) => (
                  <div
                    key={index}
                    className="absolute w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                    style={{
                      transform: `rotate(${index * (360 / wheelColors.length)}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    <div
                      style={{
                        transform: `translateY(-120px) rotate(-${index * (360 / wheelColors.length)}deg)`
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600"></div>
              </div>
              
              {/* Center button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Button
                  onClick={spinWheel}
                  disabled={isSpinning || showQuestion}
                  className="w-20 h-20 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg shadow-lg"
                >
                  {isSpinning ? (
                    <div className="animate-spin">
                      <Play className="h-6 w-6" />
                    </div>
                  ) : (
                    'SPIN'
                  )}
                </Button>
              </div>
            </div>

            {!showQuestion && !isSpinning && (
              <Card className="p-6 text-center bg-white/90">
                <p className="text-lg font-medium">
                  Nhấn SPIN để quay bánh xe và nhận câu hỏi!
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Question Modal */}
        {showQuestion && data.questions[currentQuestionIndex] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4">
            <Card className="p-6 max-w-2xl w-full bg-white">
              <h3 className="text-xl font-bold mb-6">
                🎯 {data.questions[currentQuestionIndex].question}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {data.questions[currentQuestionIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant="outline"
                    className="text-left justify-start p-4 h-auto hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
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

export default SpinWheelTemplate;

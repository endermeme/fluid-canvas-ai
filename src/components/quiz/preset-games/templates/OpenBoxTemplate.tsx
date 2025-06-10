
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Package, Trophy, RefreshCw, Play, Target, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface OpenBoxProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface Box {
  id: string;
  content: string;
  type: 'multiple_choice' | 'true_false' | 'challenge';
  points: number;
  opened: boolean;
  question?: string;
  options?: string[];
  correctAnswer?: string | number;
}

const OpenBoxTemplate: React.FC<OpenBoxProps> = ({ content, topic, onBack }) => {
  const { toast } = useToast();
  
  const defaultBoxes: Box[] = content?.boxes || [
    { 
      id: '1', 
      content: 'Câu hỏi trắc nghiệm',
      question: 'Thủ đô của Việt Nam là gì?',
      options: ['Hà Nội', 'Thành phố Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ'],
      correctAnswer: 0,
      type: 'multiple_choice', 
      points: 10, 
      opened: false 
    },
    { 
      id: '2', 
      content: 'Thử thách vui',
      type: 'challenge', 
      points: 15, 
      opened: false 
    },
    { 
      id: '3', 
      content: 'Câu hỏi đúng/sai',
      question: 'Việt Nam có 63 tỉnh thành',
      correctAnswer: 'true',
      type: 'true_false', 
      points: 8, 
      opened: false 
    },
    { 
      id: '4', 
      content: 'Câu hỏi trắc nghiệm',
      question: '2 + 3 = ?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 1,
      type: 'multiple_choice', 
      points: 5, 
      opened: false 
    },
    { 
      id: '5', 
      content: 'Thử thách sáng tạo',
      type: 'challenge', 
      points: 20, 
      opened: false 
    },
    { 
      id: '6', 
      content: 'Câu hỏi đúng/sai',
      question: 'Sông Mekong là sông dài nhất Việt Nam',
      correctAnswer: 'false',
      type: 'true_false', 
      points: 8, 
      opened: false 
    },
    { 
      id: '7', 
      content: 'Câu hỏi trắc nghiệm',
      question: 'Màu của lá cây thường là gì?',
      options: ['Đỏ', 'Xanh lá', 'Vàng', 'Tím'],
      correctAnswer: 1,
      type: 'multiple_choice', 
      points: 10, 
      opened: false 
    },
    { 
      id: '8', 
      content: 'Thử thách kỹ năng',
      type: 'challenge', 
      points: 18, 
      opened: false 
    },
    { 
      id: '9', 
      content: 'Câu hỏi đúng/sai',
      question: 'Cà phê trứng là đặc sản của Hà Nội',
      correctAnswer: 'true',
      type: 'true_false', 
      points: 12, 
      opened: false 
    }
  ];
  
  const [boxes, setBoxes] = useState<Box[]>(defaultBoxes);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Box | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  
  const openBox = (boxId: string) => {
    const box = boxes.find(b => b.id === boxId);
    if (!box || box.opened) return;
    
    if (box.type === 'multiple_choice' || box.type === 'true_false') {
      setCurrentQuestion(box);
      setShowQuestionDialog(true);
      setSelectedAnswer('');
    } else if (box.type === 'challenge') {
      // Xử lý challenge - tự động cộng điểm
      processBoxOpening(box, true);
    }
  };
  
  const processBoxOpening = (box: Box, isCorrect?: boolean) => {
    setBoxes(prev => prev.map(b => 
      b.id === box.id ? { ...b, opened: true } : b
    ));
    
    let pointsEarned = box.points;
    let toastMessage = '';
    let toastVariant: 'default' | 'destructive' = 'default';
    
    if (box.type === 'multiple_choice' || box.type === 'true_false') {
      if (isCorrect) {
        toastMessage = `✅ Chính xác! +${pointsEarned} điểm`;
      } else {
        pointsEarned = -Math.floor(box.points / 2);
        toastMessage = `❌ Sai rồi! ${pointsEarned} điểm`;
        toastVariant = 'destructive';
      }
    } else if (box.type === 'challenge') {
      toastMessage = `🎯 Thử thách: +${pointsEarned} điểm!`;
    }
    
    setScore(prev => prev + pointsEarned);
    
    toast({
      title: '📦 Mở hộp thành công!',
      description: toastMessage,
      variant: toastVariant,
    });
    
    const allOpened = boxes.every(b => b.opened || b.id === box.id);
    if (allOpened) {
      setGameCompleted(true);
      setTimeout(() => {
        toast({
          title: '🏆 Hoàn thành!',
          description: `Bạn đã mở tất cả hộp! Tổng điểm: ${score + pointsEarned}`,
          variant: 'default',
        });
      }, 500);
    }
  };
  
  const handleAnswerSubmit = () => {
    if (!currentQuestion || !selectedAnswer) return;
    
    let isCorrect = false;
    
    if (currentQuestion.type === 'multiple_choice') {
      isCorrect = parseInt(selectedAnswer) === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'true_false') {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }
    
    processBoxOpening(currentQuestion, isCorrect);
    setShowQuestionDialog(false);
    setCurrentQuestion(null);
    setSelectedAnswer('');
  };
  
  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setShowQuestionDialog(false);
    setCurrentQuestion(null);
    setSelectedAnswer('');
    setBoxes(defaultBoxes.map(box => ({ ...box, opened: false })));
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const getBoxIcon = (type: string, opened: boolean) => {
    if (!opened) {
      return <Package className="h-12 w-12 text-white" />;
    }
    
    switch (type) {
      case 'multiple_choice':
        return <HelpCircle className="h-12 w-12 text-blue-100" />;
      case 'true_false':
        return <Target className="h-12 w-12 text-green-100" />;
      case 'challenge':
        return <Trophy className="h-12 w-12 text-orange-100" />;
      default:
        return <Package className="h-12 w-12 text-gray-100" />;
    }
  };
  
  const getBoxColor = (type: string, opened: boolean) => {
    if (!opened) {
      return 'bg-gradient-to-br from-indigo-400 to-indigo-600 hover:from-indigo-300 hover:to-indigo-500 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-indigo-200';
    }
    
    switch (type) {
      case 'multiple_choice':
        return 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg border-2 border-blue-200';
      case 'true_false':
        return 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg border-2 border-green-200';
      case 'challenge':
        return 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg border-2 border-orange-200';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg border-2 border-gray-200';
    }
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="text-center bg-white/90 backdrop-blur-md border-2 border-cyan-200 shadow-2xl rounded-2xl p-8">
            <div className="mb-8">
              <Package className="h-24 w-24 text-cyan-500 mx-auto mb-6 animate-bounce" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Mở Hộp Bí Ẩn
            </h2>
            <p className="text-xl text-gray-700 mb-2 font-medium">🎁 Chủ đề: {topic}</p>
            <p className="text-gray-600 mb-8 text-lg">Mở các hộp để khám phá câu hỏi và thử thách</p>
            
            <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-cyan-200">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-cyan-100">
                  <Package className="h-6 w-6 text-cyan-500" />
                  <span className="font-medium text-gray-700">{defaultBoxes.length} hộp bí ẩn</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-cyan-100">
                  <Target className="h-6 w-6 text-indigo-500" />
                  <span className="font-medium text-gray-700">Nhiều thử thách</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-400 text-white text-xl font-bold py-6 rounded-2xl border-2 border-cyan-300"
            >
              🎮 Bắt đầu khám phá
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  if (gameCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="text-center bg-white/90 backdrop-blur-md border-2 border-cyan-200 shadow-2xl rounded-2xl p-8">
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
            
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              🎉 Hoàn thành!
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <span className="text-gray-700 font-medium">Tổng điểm:</span>
                <span className={`text-3xl font-bold ${score >= 0 ? 'text-yellow-600' : 'text-red-500'}`}>{score}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                <span className="text-gray-700 font-medium">Hộp đã mở:</span>
                <span className="text-xl font-semibold text-cyan-600">{boxes.filter(b => b.opened).length}/{boxes.length}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={resetGame} 
                className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold py-3 rounded-xl border border-cyan-300"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Chơi lại
              </Button>
              {onBack && (
                <Button 
                  onClick={onBack} 
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 font-semibold py-3 rounded-xl"
                >
                  Quay lại
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md border-2 border-cyan-200 shadow-lg rounded-2xl flex-shrink-0">
          <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Mở Hộp Bí Ẩn
              </h2>
              <p className="text-gray-600 text-lg font-medium">{topic}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl border border-yellow-300">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <span className={`font-bold text-xl ${score >= 0 ? 'text-yellow-700' : 'text-red-600'}`}>{score} điểm</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl border border-cyan-300">
                <Package className="h-6 w-6 text-cyan-600" />
                <span className="font-bold text-cyan-700 text-xl">
                  {boxes.filter(b => b.opened).length}/{boxes.length}
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-6 max-w-4xl w-full">
            {boxes.map((box) => (
              <Card
                key={box.id}
                className={`p-6 cursor-pointer transition-all duration-300 rounded-2xl ${
                  getBoxColor(box.type, box.opened)
                } ${!box.opened ? 'hover:cursor-pointer' : 'cursor-default'} text-white`}
                onClick={() => openBox(box.id)}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  {getBoxIcon(box.type, box.opened)}
                  
                  <div className="text-lg font-bold">
                    Hộp {box.id}
                  </div>
                  
                  {box.opened && (
                    <div className="text-sm">
                      <div className="mb-2 font-medium">{box.content}</div>
                      <div className="font-bold text-lg">
                        {(box.type === 'multiple_choice' || box.type === 'true_false') ? 
                          `${box.points > 0 ? '+' : ''}${box.points}` : 
                          `+${box.points}`} điểm
                      </div>
                    </div>
                  )}
                  
                  {!box.opened && (
                    <div className="text-sm opacity-90 font-medium">
                      Nhấp để mở
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-center flex-shrink-0">
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={resetGame} 
              variant="outline"
              className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Chơi lại
            </Button>
            {onBack && (
              <Button 
                onClick={onBack} 
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl"
              >
                Quay lại
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-md border-2 border-blue-200">
          <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            {currentQuestion?.type === 'multiple_choice' ? <HelpCircle className="h-6 w-6" /> : <Target className="h-6 w-6" />}
            {currentQuestion?.type === 'multiple_choice' ? 'Câu hỏi trắc nghiệm' : 'Câu hỏi đúng/sai'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Chọn đáp án đúng để nhận điểm, chọn sai sẽ bị trừ điểm
          </DialogDescription>
          
          {currentQuestion && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-lg font-medium text-blue-800 mb-3">
                  {currentQuestion.question}
                </p>
                <p className="text-sm text-blue-600">
                  Điểm thưởng: +{currentQuestion.points} | Phạt: -{Math.floor(currentQuestion.points / 2)}
                </p>
              </div>
              
              <div className="space-y-4">
                {currentQuestion.type === 'multiple_choice' ? (
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700 font-medium">
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-green-200 hover:bg-green-50">
                      <RadioGroupItem value="true" id="true" />
                      <label htmlFor="true" className="flex-1 cursor-pointer text-gray-700 font-medium">
                        ✅ Đúng
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-red-200 hover:bg-red-50">
                      <RadioGroupItem value="false" id="false" />
                      <label htmlFor="false" className="flex-1 cursor-pointer text-gray-700 font-medium">
                        ❌ Sai
                      </label>
                    </div>
                  </RadioGroup>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Gửi đáp án
                </Button>
                <Button 
                  onClick={() => setShowQuestionDialog(false)}
                  variant="outline"
                  className="border-2 border-gray-300"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenBoxTemplate;

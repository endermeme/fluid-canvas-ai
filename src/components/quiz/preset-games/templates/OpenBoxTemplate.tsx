import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Gift, Trophy, RefreshCw, Check, X } from 'lucide-react';

interface OpenBoxProps {
  content: any;
  topic: string;
}

interface Box {
  id: string;
  questionType: 'text' | 'image' | 'multiple';
  question: string;
  options?: string[];
  answer: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
}

const OpenBoxTemplate: React.FC<OpenBoxProps> = ({ content, topic }) => {
  const { toast } = useToast();
  
  // Data mẫu nếu không có content
  const boxes: Box[] = content?.boxes || [
    {
      id: '1',
      questionType: 'text',
      question: 'Ngôn ngữ lập trình nào được sử dụng để phát triển ứng dụng iOS?',
      answer: 'Swift',
      points: 10,
      difficulty: 'easy'
    },
    {
      id: '2',
      questionType: 'multiple',
      question: 'Đâu là một framework JavaScript?',
      options: ['Excel', 'React', 'Word', 'Photoshop'],
      answer: 'React',
      points: 15,
      difficulty: 'easy'
    },
    {
      id: '3',
      questionType: 'text',
      question: 'HTTP là viết tắt của gì?',
      answer: 'Hypertext Transfer Protocol',
      points: 20,
      difficulty: 'medium'
    },
    {
      id: '4',
      questionType: 'multiple',
      question: 'Hệ điều hành nào không phải của Microsoft?',
      options: ['Windows XP', 'Windows 10', 'Ubuntu', 'Windows 11'],
      answer: 'Ubuntu',
      points: 15,
      difficulty: 'medium'
    },
    {
      id: '5',
      questionType: 'multiple',
      question: 'Ngôn ngữ lập trình nào được sử dụng chủ yếu trong Machine Learning?',
      options: ['HTML', 'Python', 'CSS', 'XML'],
      answer: 'Python',
      points: 25,
      difficulty: 'hard'
    },
    {
      id: '6',
      questionType: 'text',
      question: 'SQL là viết tắt của gì?',
      answer: 'Structured Query Language',
      points: 20,
      difficulty: 'hard'
    },
  ];

  const [openedBoxes, setOpenedBoxes] = useState<string[]>([]);
  const [currentBoxId, setCurrentBoxId] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  
  const currentBox = currentBoxId ? boxes.find(box => box.id === currentBoxId) : null;
  
  // Tìm box bởi id
  const getBoxById = (id: string) => {
    return boxes.find(box => box.id === id);
  };
  
  // Xử lý click vào box
  const handleBoxClick = (boxId: string) => {
    if (openedBoxes.includes(boxId)) return;
    
    setCurrentBoxId(boxId);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
  };
  
  // Kiểm tra đáp án
  const checkAnswer = () => {
    if (!currentBox) return;
    
    const correctAnswer = currentBox.answer.toLowerCase().trim();
    const userSubmission = userAnswer.toLowerCase().trim();
    const correct = userSubmission === correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setOpenedBoxes([...openedBoxes, currentBox.id]);
    
    if (correct) {
      setScore(score + currentBox.points);
      toast({
        title: 'Chính xác!',
        description: `+${currentBox.points} điểm`,
        variant: 'default',
      });
    } else {
      toast({
        title: 'Chưa đúng',
        description: `Đáp án đúng: ${currentBox.answer}`,
        variant: 'destructive',
      });
    }
    
    // Kiểm tra xem đã mở hết các hộp chưa
    if (openedBoxes.length + 1 >= boxes.length) {
      setTimeout(() => {
        setCurrentBoxId(null);
        setGameCompleted(true);
      }, 2000);
    } else {
      setTimeout(() => {
        setCurrentBoxId(null);
      }, 1500);
    }
  };
  
  // Khởi động lại trò chơi
  const resetGame = () => {
    setOpenedBoxes([]);
    setCurrentBoxId(null);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setScore(0);
    setGameCompleted(false);
  };
  
  // Xử lý option click
  const handleOptionSelect = (option: string) => {
    setUserAnswer(option);
  };
  
  // Hiển thị màn hình kết thúc game
  if (gameCompleted) {
    const maxScore = boxes.reduce((total, box) => total + box.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-8 max-w-md mx-auto text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          
          <h2 className="text-2xl font-bold mb-4">Trò chơi kết thúc!</h2>
          
          <div className="mb-6">
            <p className="text-xl mb-2">Điểm của bạn: {score}/{maxScore}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-green-600 h-4 rounded-full" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <p className="text-gray-600">
              {percentage >= 80 && 'Tuyệt vời! Bạn đã chinh phục hầu hết các thử thách.'}
              {percentage >= 50 && percentage < 80 && 'Khá tốt! Bạn đã có kiến thức vững về chủ đề này.'}
              {percentage < 50 && 'Hãy tiếp tục luyện tập để cải thiện kiến thức nhé!'}
            </p>
          </div>
          
          <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] p-6">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Mở Hộp Quà: {topic}</h2>
        <div className="flex items-center gap-2">
          <span className="font-medium text-blue-600">Điểm: {score}</span>
        </div>
      </Card>
      
      <Progress 
        value={(openedBoxes.length / boxes.length) * 100} 
        className="h-2 mb-4" 
      />
      
      {!currentBoxId ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {boxes.map((box) => (
            <Card 
              key={box.id}
              className={`p-4 text-center cursor-pointer transition-all ${
                openedBoxes.includes(box.id) 
                  ? 'opacity-50 pointer-events-none' 
                  : 'hover:shadow-lg hover:-translate-y-1'
              }`}
              onClick={() => handleBoxClick(box.id)}
            >
              {openedBoxes.includes(box.id) ? (
                <div className="flex flex-col items-center">
                  <div className={`text-sm ${getBoxById(box.id)?.difficulty === 'easy' 
                    ? 'text-green-600' 
                    : getBoxById(box.id)?.difficulty === 'medium' 
                    ? 'text-orange-600' 
                    : 'text-red-600'}`}
                  >
                    {getBoxById(box.id)?.points} điểm
                  </div>
                  <div className="text-gray-500 text-sm">Đã mở</div>
                </div>
              ) : (
                <>
                  <Gift className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                  <div className="font-medium">Hộp {box.id}</div>
                  <div className={`text-sm mt-1 ${
                    box.difficulty === 'easy' 
                      ? 'text-green-600' 
                      : box.difficulty === 'medium' 
                      ? 'text-orange-600' 
                      : 'text-red-600'
                  }`}>
                    {box.difficulty === 'easy' && 'Dễ'}
                    {box.difficulty === 'medium' && 'Trung bình'}
                    {box.difficulty === 'hard' && 'Khó'}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">+{box.points} điểm</div>
                </>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 mb-4">
          {!showResult ? (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-medium mb-3">{currentBox?.question}</h3>
                
                {currentBox?.questionType === 'multiple' ? (
                  <div className="flex flex-col gap-2">
                    {currentBox.options?.map((option, index) => (
                      <Button
                        key={index}
                        variant={userAnswer === option ? 'default' : 'outline'}
                        className={userAnswer === option ? 'bg-blue-600' : ''}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                )}
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Kiểm tra
                </Button>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                {isCorrect ? (
                  <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                )}
                <div>
                  <h4 className="font-medium">{isCorrect ? 'Chính xác!' : 'Chưa đúng'}</h4>
                  <p>
                    {isCorrect 
                      ? `+${currentBox?.points} điểm` 
                      : `Đáp án đúng là: ${currentBox?.answer}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
      
      <div className="flex justify-end">
        <Button
          onClick={resetGame}
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm lại
        </Button>
      </div>
    </div>
  );
};

export default OpenBoxTemplate;

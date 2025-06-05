import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Clock, RefreshCw, ArrowRight, Check, X } from 'lucide-react';

interface AnagramProps {
  content: any;
  topic: string;
}

interface AnagramWord {
  id: string;
  original: string;
  scrambled: string;
  hint?: string;
}

const AnagramTemplate: React.FC<AnagramProps> = ({ content, topic }) => {
  const { toast } = useToast();
  
  // Data mẫu nếu không có content
  const words: AnagramWord[] = content?.words || [
    { id: '1', original: 'computer', scrambled: 'mtceprou', hint: 'Thiết bị điện tử xử lý dữ liệu' },
    { id: '2', original: 'algorithm', scrambled: 'malithgor', hint: 'Tập hợp các bước để giải quyết vấn đề' },
    { id: '3', original: 'javascript', scrambled: 'cptiaavrsj', hint: 'Ngôn ngữ lập trình web phổ biến' },
    { id: '4', original: 'database', scrambled: 'staabeda', hint: 'Nơi lưu trữ dữ liệu có cấu trúc' },
    { id: '5', original: 'network', scrambled: 'tworkne', hint: 'Kết nối giữa các thiết bị' }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const currentWord = words[currentIndex];
  
  // Đếm ngược thời gian
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !showResult && !gameCompleted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult && !gameCompleted) {
      handleTimeUp();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, showResult, gameCompleted]);
  
  // Xử lý khi hết thời gian
  const handleTimeUp = () => {
    setShowResult(true);
    setIsCorrect(false);
    toast({
      title: 'Hết giờ!',
      description: 'Bạn đã hết thời gian cho từ này.',
      variant: 'destructive',
    });
  };
  
  // Kiểm tra đáp án
  const checkAnswer = () => {
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === currentWord.original.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
      toast({
        title: 'Chính xác!',
        description: 'Bạn đã xếp đúng từ.',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Chưa đúng',
        description: `Đáp án đúng là: ${currentWord.original}`,
        variant: 'destructive',
      });
    }
  };
  
  // Chuyển sang từ tiếp theo
  const goToNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowResult(false);
      setShowHint(false);
      setIsCorrect(null);
      setTimeLeft(30);
    } else {
      setGameCompleted(true);
    }
  };
  
  // Reset game
  const resetGame = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setShowHint(false);
    setIsCorrect(null);
    setScore(0);
    setGameCompleted(false);
    setTimeLeft(30);
  };
  
  // Render kết quả
  if (gameCompleted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-6 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Trò chơi hoàn thành!</h2>
          
          <p className="text-xl mb-4">Điểm của bạn: {score}/{words.length}</p>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="bg-green-600 h-4 rounded-full" 
              style={{ width: `${(score / words.length) * 100}%` }}
            />
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
        <h2 className="text-xl font-bold">Xếp Lại Chữ: {topic}</h2>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className={`font-medium ${timeLeft < 10 ? 'text-red-500' : 'text-blue-500'}`}>
            {timeLeft}s
          </span>
        </div>
      </Card>
      
      <div className="mb-4">
        <Progress value={((currentIndex) / words.length) * 100} className="h-2" />
        <div className="flex justify-between mt-1 text-sm text-gray-500">
          <span>Từ {currentIndex + 1}</span>
          <span>Tổng {words.length} từ</span>
        </div>
      </div>
      
      <Card className="p-6 mb-4">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-3">Sắp xếp lại các chữ cái:</h3>
            <div className="flex justify-center mb-4">
              {currentWord.scrambled.split('').map((letter, index) => (
                <div 
                  key={index}
                  className="w-10 h-10 flex items-center justify-center bg-blue-100 border-2 border-blue-300 rounded-md mx-1 text-lg font-bold text-blue-700"
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          
          {!showResult ? (
            <div className="w-full">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập từ đúng..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              />
              
              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => setShowHint(!showHint)}
                  variant="outline"
                >
                  Gợi ý
                </Button>
                
                <Button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Kiểm tra
                </Button>
              </div>
              
              {showHint && currentWord.hint && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p>{currentWord.hint}</p>
                </div>
              )}
            </div>
          ) : (
            <div className={`w-full p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                {isCorrect ? (
                  <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                )}
                <div>
                  <h4 className="font-medium">{isCorrect ? 'Đúng rồi!' : 'Chưa đúng'}</h4>
                  <p>
                    {isCorrect 
                      ? `Bạn đã sắp xếp đúng từ "${currentWord.original}".` 
                      : `Đáp án đúng là "${currentWord.original}".`}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={goToNextWord}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              >
                {currentIndex < words.length - 1 ? 'Từ tiếp theo' : 'Kết thúc'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnagramTemplate;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Clock, Pencil, Check, X, RefreshCw, ArrowRight, ArrowLeft, ThumbsUp } from 'lucide-react';

interface CompleteSentenceProps {
  content: any;
  topic: string;
}

interface Sentence {
  id: string;
  text: string;
  answer: string;
  hint?: string;
  explanation?: string;
}

const CompleteSentenceTemplate: React.FC<CompleteSentenceProps> = ({ content, topic }) => {
  // Dữ liệu mẫu nếu không có content
  const sentences: Sentence[] = content?.sentences || [
    {
      id: '1',
      text: 'Trái đất quay quanh ________ theo một quỹ đạo hình elip.',
      answer: 'mặt trời',
      hint: 'Là ngôi sao trung tâm của hệ mặt trời',
      explanation: 'Trái đất quay quanh mặt trời với chu kỳ khoảng 365,25 ngày.'
    },
    {
      id: '2',
      text: 'Nước sôi ở nhiệt độ ________ độ C ở áp suất tiêu chuẩn.',
      answer: '100',
      hint: 'Là một số tròn chục',
      explanation: 'Nước sôi ở 100°C ở áp suất 1 atm. Nhiệt độ này thay đổi theo áp suất.'
    },
    {
      id: '3',
      text: 'Ngôn ngữ lập trình ________ được phát triển bởi Guido van Rossum vào năm 1991.',
      answer: 'Python',
      hint: 'Tên của một loài rắn',
      explanation: 'Python là ngôn ngữ lập trình bậc cao được phát triển bởi Guido van Rossum.'
    },
    {
      id: '4',
      text: 'Thuật ngữ ________ trong máy tính dùng để chỉ một lỗi trong chương trình.',
      answer: 'bug',
      hint: 'Còn có nghĩa là côn trùng',
      explanation: 'Bug (lỗi) là thuật ngữ để chỉ lỗi trong chương trình máy tính.'
    },
    {
      id: '5',
      text: 'Đơn vị đo tần số là ________.',
      answer: 'hertz',
      hint: 'Viết tắt là Hz',
      explanation: 'Hertz (Hz) là đơn vị đo tần số, tương đương với một chu kỳ mỗi giây.'
    }
  ];

  const timeLimit = content?.settings?.timeLimit || 30;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  const { toast } = useToast();
  
  const currentSentence = sentences[currentIndex];
  
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
      description: 'Bạn đã hết thời gian cho câu này.',
      variant: 'destructive',
    });
  };
  
  // Kiểm tra câu trả lời
  const checkAnswer = () => {
    if (!userAnswer.trim()) {
      setSubmitAttempted(true);
      return;
    }
    
    // Chuẩn hóa câu trả lời để so sánh (không phân biệt hoa thường, khoảng trắng)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = currentSentence.answer.toLowerCase();
    
    const correct = normalizedUserAnswer === normalizedCorrectAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      toast({
        title: 'Chính xác!',
        description: 'Câu trả lời của bạn hoàn toàn đúng.',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Chưa chính xác',
        description: `Đáp án đúng là: ${currentSentence.answer}`,
        variant: 'destructive',
      });
    }
  };
  
  // Điều hướng câu tiếp theo
  const goToNextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowResult(false);
      setShowHint(false);
      setIsCorrect(null);
      setTimeLeft(timeLimit);
      setSubmitAttempted(false);
    } else {
      setGameCompleted(true);
    }
  };
  
  // Điều hướng câu trước đó
  const goToPrevSentence = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserAnswer('');
      setShowResult(false);
      setShowHint(false);
      setIsCorrect(null);
      setTimeLeft(timeLimit);
      setSubmitAttempted(false);
    }
  };
  
  // Làm lại trò chơi
  const resetGame = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setShowHint(false);
    setIsCorrect(null);
    setScore(0);
    setGameCompleted(false);
    setTimeLeft(timeLimit);
    setSubmitAttempted(false);
  };
  
  // Hiển thị gợi ý
  const toggleHint = () => {
    setShowHint(!showHint);
  };
  
  // Format văn bản có dấu gạch chân
  const formatText = (text: string) => {
    const parts = text.split('________');
    
    if (showResult) {
      return (
        <>
          {parts[0]}
          <span className={`font-bold px-1 py-0.5 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? userAnswer : currentSentence.answer}
          </span>
          {parts[1]}
        </>
      );
    }
    
    return (
      <>
        {parts[0]}
        <span className="border-b-2 border-blue-500 inline-block min-w-[80px] px-1">
          {userAnswer}
        </span>
        {parts[1]}
      </>
    );
  };
  
  // Hiển thị màn hình kết thúc trò chơi
  if (gameCompleted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Trò chơi hoàn thành!</h2>
          
          <div className="mb-6">
            <p className="text-xl mb-2">Điểm của bạn: {score}/{sentences.length}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-green-600 h-4 rounded-full" 
                style={{ width: `${(score / sentences.length) * 100}%` }}
              />
            </div>
            
            <p className="text-gray-600">
              {score === sentences.length && 'Tuyệt vời! Bạn đã trả lời đúng tất cả các câu.'}
              {score >= sentences.length/2 && score < sentences.length && 'Tốt! Bạn đã hoàn thành phần lớn các câu.'}
              {score < sentences.length/2 && 'Hãy tiếp tục luyện tập để cải thiện kỹ năng nhé!'}
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
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
          <h2 className="text-xl font-bold">Hoàn Thành Câu: {topic}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className={`font-medium ${timeLeft < 10 ? 'text-red-500' : 'text-blue-500'}`}>
            {timeLeft}s
          </span>
        </div>
      </Card>
      
      <div className="mb-4">
        <Progress value={((currentIndex) / sentences.length) * 100} className="h-2" />
        <div className="flex justify-between mt-1 text-sm text-gray-500">
          <span>Câu {currentIndex + 1}</span>
          <span>Tổng {sentences.length} câu</span>
        </div>
      </div>
      
      <Card className="p-6 mb-4">
        <div className="mb-6 text-lg">
          {formatText(currentSentence.text)}
        </div>
        
        {!showResult && (
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Điền từ thích hợp:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời..."
                  className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${submitAttempted && !userAnswer.trim() ? 'border-red-500' : 'border-gray-300'}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') checkAnswer();
                  }}
                />
                <Button
                  onClick={checkAnswer}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Kiểm tra
                </Button>
              </div>
              {submitAttempted && !userAnswer.trim() && (
                <p className="mt-1 text-sm text-red-500">Vui lòng nhập câu trả lời</p>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button
                onClick={toggleHint}
                variant="outline"
                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              >
                Gợi ý
              </Button>
            </div>
            
            {showHint && currentSentence.hint && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                <p className="text-sm">{currentSentence.hint}</p>
              </div>
            )}
          </div>
        )}
        
        {showResult && (
          <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'} mb-4`}>
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              
              <div>
                <h4 className="font-medium">
                  {isCorrect ? 'Đúng rồi!' : 'Chưa chính xác'}
                </h4>
                <p className="text-sm mt-1">
                  {isCorrect 
                    ? 'Bạn đã trả lời đúng.' 
                    : `Đáp án đúng là: ${currentSentence.answer}`}
                </p>
                {currentSentence.explanation && (
                  <p className="text-sm mt-2 text-gray-700">{currentSentence.explanation}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <div className="flex justify-between">
        <Button
          onClick={goToPrevSentence}
          disabled={currentIndex === 0}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Câu trước
        </Button>
        
        {showResult ? (
          <Button
            onClick={goToNextSentence}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentIndex < sentences.length - 1 ? (
              <>
                Câu tiếp theo
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Hoàn thành
                <ThumbsUp className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={resetGame}
            variant="ghost"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm lại
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompleteSentenceTemplate;

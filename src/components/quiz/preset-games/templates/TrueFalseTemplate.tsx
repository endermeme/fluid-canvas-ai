
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, X, ChevronRight, RefreshCw } from 'lucide-react';
import { animateBlockCreation } from '@/lib/animations';

interface TrueFalseQuestion {
  statement: string;
  isTrue: boolean;
  explanation?: string;
}

interface TrueFalseTemplateProps {
  content: TrueFalseQuestion[];
  topic: string;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ content, topic }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    // Reset states when content changes
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsQuizComplete(false);
    setTimer(15);
    setTimerActive(true);
  }, [content]);

  useEffect(() => {
    if (timerActive && selectedAnswer === null && !isQuizComplete) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            handleTimeout();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerActive, selectedAnswer, isQuizComplete]);

  useEffect(() => {
    // Reset timer when moving to next question
    if (!isQuizComplete) {
      setTimer(15);
      setTimerActive(true);
    }
  }, [currentQuestion]);

  useEffect(() => {
    // Apply animations
    document.querySelectorAll('.animate-item').forEach((element) => {
      if (element instanceof HTMLElement) {
        animateBlockCreation(element);
      }
    });
  }, [currentQuestion, selectedAnswer, isQuizComplete]);

  const handleTimeout = () => {
    setSelectedAnswer(null);
    setTimerActive(false);
  };

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setTimerActive(false);
    
    if (answer === content[currentQuestion].isTrue) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < content.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setIsQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsQuizComplete(false);
    setTimer(15);
    setTimerActive(true);
  };

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Không có câu hỏi</h3>
          <p className="text-gray-500">Không tìm thấy nội dung cho trò chơi này.</p>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / content.length) * 100);
    let message = "Thử lại để đạt điểm cao hơn!";
    
    if (percentage >= 90) {
      message = "Tuyệt vời! Bạn thật xuất sắc!";
    } else if (percentage >= 70) {
      message = "Rất giỏi! Bạn có khiếu phân biệt đúng sai!";
    } else if (percentage >= 50) {
      message = "Khá tốt! Hãy tiếp tục luyện tập!";
    }

    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-4 animate-fade-in">
        <Card className="w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Kết quả trò chơi Đúng/Sai</h2>
          
          <div className="relative mb-6 pt-4">
            <div className="text-4xl font-bold mb-2">{percentage}%</div>
            <Progress value={percentage} className="h-2" />
            <p className="mt-2 text-sm text-gray-500">
              {score} / {content.length} câu trả lời đúng
            </p>
          </div>
          
          <p className="mb-6">{message}</p>
          
          <Button onClick={restartQuiz} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  const question = content[currentQuestion];
  const progress = ((currentQuestion) / content.length) * 100;

  return (
    <div className="flex flex-col max-w-2xl mx-auto p-4 h-full">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">
            Câu hỏi {currentQuestion + 1}/{content.length}
          </span>
          <span className="text-sm font-medium">
            Điểm: {score}/{currentQuestion}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="relative mb-1">
        <Progress 
          value={(timer / 15) * 100} 
          className="h-1"
          indicatorColor={timer < 5 ? "bg-red-500" : timer < 10 ? "bg-yellow-500" : "bg-green-500"}
        />
        <span className="absolute right-0 -top-5 text-xs">{timer}s</span>
      </div>

      <Card className="flex-grow p-6 mb-4 flex flex-col">
        <h3 className="text-xl font-semibold mb-8 text-center animate-item">{question.statement}</h3>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-item">
          <Button
            className={`
              h-16 px-8 text-lg transition-all
              ${selectedAnswer === true 
                ? (question.isTrue ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') 
                : 'bg-green-100 hover:bg-green-200 text-green-700'
              }
              ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}
            `}
            onClick={() => handleAnswer(true)}
            disabled={selectedAnswer !== null}
          >
            <Check className="mr-2 h-5 w-5" />
            ĐÚNG
          </Button>
          
          <Button
            className={`
              h-16 px-8 text-lg transition-all
              ${selectedAnswer === false 
                ? (!question.isTrue ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') 
                : 'bg-red-100 hover:bg-red-200 text-red-700'
              }
              ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}
            `}
            onClick={() => handleAnswer(false)}
            disabled={selectedAnswer !== null}
          >
            <X className="mr-2 h-5 w-5" />
            SAI
          </Button>
        </div>
        
        {selectedAnswer !== null && question.explanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm animate-fade-in">
            <p className="font-semibold mb-1">Giải thích:</p>
            <p>{question.explanation}</p>
          </div>
        )}
        
        {timer === 0 && selectedAnswer === null && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm animate-fade-in text-center">
            <p className="font-semibold">Hết thời gian!</p>
            <p>Đáp án đúng là: {question.isTrue ? 'ĐÚNG' : 'SAI'}</p>
          </div>
        )}
      </Card>

      {selectedAnswer !== null || timer === 0 ? (
        <div className="flex justify-end">
          <Button onClick={handleNextQuestion} className="flex items-center">
            {currentQuestion < content.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default TrueFalseTemplate;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, X, ArrowRight } from 'lucide-react';
import { animateBlockCreation } from '@/lib/animations';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizTemplateProps {
  content: QuizQuestion[];
  topic: string;
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ content, topic }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    // Reset states when content changes
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
    setTimer(30);
    setTimerActive(true);
  }, [content]);

  useEffect(() => {
    if (timerActive && !isAnswered && !isQuizComplete) {
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
  }, [timerActive, isAnswered, isQuizComplete]);

  useEffect(() => {
    // Reset timer when moving to next question
    if (!isQuizComplete) {
      setTimer(30);
      setTimerActive(true);
    }
  }, [currentQuestion]);

  useEffect(() => {
    // Apply animations
    document.querySelectorAll('.quiz-option').forEach((element, index) => {
      setTimeout(() => {
        if (element instanceof HTMLElement) {
          animateBlockCreation(element);
        }
      }, index * 50);
    });
  }, [currentQuestion, isQuizComplete]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setTimerActive(false);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    setTimerActive(false);
    
    if (optionIndex === content[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < content.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
    setTimer(30);
    setTimerActive(true);
  };

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Không có câu hỏi</h3>
          <p className="text-gray-500">Không tìm thấy nội dung cho bài kiểm tra này.</p>
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
      message = "Rất giỏi! Bạn đã làm rất tốt!";
    } else if (percentage >= 50) {
      message = "Khá tốt! Hãy tiếp tục cố gắng!";
    }

    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-4 animate-fade-in">
        <Card className="w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Kết quả bài kiểm tra</h2>
          
          <div className="relative mb-6 pt-4">
            <div className="text-4xl font-bold mb-2">{percentage}%</div>
            <Progress value={percentage} className="h-2" />
            <p className="mt-2 text-sm text-gray-500">
              {score} / {content.length} câu trả lời đúng
            </p>
          </div>
          
          <p className="mb-6">{message}</p>
          
          <Button onClick={restartQuiz} className="w-full">
            Làm lại bài kiểm tra
          </Button>
        </Card>
      </div>
    );
  }

  const question = content[currentQuestion];
  const progress = ((currentQuestion) / content.length) * 100;

  return (
    <div className="flex flex-col max-w-3xl mx-auto p-4 h-full">
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
          value={(timer / 30) * 100} 
          className="h-1" 
          indicatorClassName={timer < 10 ? "bg-red-500" : timer < 20 ? "bg-yellow-500" : "bg-green-500"}
        />
        <span className="absolute right-0 -top-5 text-xs">{timer}s</span>
      </div>

      <Card className="flex-grow p-6 mb-4 flex flex-col">
        <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
              className={`
                quiz-option p-4 rounded-lg text-left transition-all border border-border
                ${selectedOption === index 
                  ? index === question.correctAnswer 
                    ? 'bg-green-100 border-green-500 text-green-900' 
                    : 'bg-red-100 border-red-500 text-red-900'
                  : isAnswered && index === question.correctAnswer
                    ? 'bg-green-100 border-green-500 text-green-900'
                    : 'hover:bg-accent hover:border-primary/30'
                }
                ${isAnswered ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {isAnswered ? (
                    index === question.correctAnswer ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : selectedOption === index ? (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </div>
                    )
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </div>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
        
        {isAnswered && question.explanation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm animate-fade-in">
            <p className="font-semibold mb-1">Giải thích:</p>
            <p>{question.explanation}</p>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          {isAnswered ? (
            selectedOption === question.correctAnswer ? (
              <span className="text-green-600 font-medium">✓ Đúng rồi!</span>
            ) : (
              <span className="text-red-600 font-medium">✗ Sai rồi!</span>
            )
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
        
        {isAnswered && (
          <Button onClick={handleNextQuestion} className="flex items-center">
            {currentQuestion < content.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizTemplate;

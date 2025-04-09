
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';

interface QuizTemplateProps {
  content: any;
  topic: string;
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ content, topic }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(content?.settings?.timePerQuestion || 30);
  const [timerRunning, setTimerRunning] = useState(true);
  const { toast } = useToast();

  const questions = content?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && timerRunning) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning) {
      // Auto-move to next question if time runs out
      setTimerRunning(false);
      setIsAnswered(true);
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã hết thời gian trả lời câu hỏi này.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, toast]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    setTimerRunning(false);
    
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Chính xác! +1 điểm",
        description: "Bạn đã trả lời đúng câu hỏi này.",
        variant: "default",
      });
    } else {
      toast({
        title: "Chưa chính xác!",
        description: `Đáp án đúng là: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(content?.settings?.timePerQuestion || 30);
      setTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setTimeLeft(content?.settings?.timePerQuestion || 30);
    setTimerRunning(true);
  };

  if (!content || !questions.length) {
    return <div className="p-4">Không có dữ liệu câu hỏi</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Kết quả</h2>
          <p className="text-lg mb-4">
            Chủ đề: <span className="font-semibold">{content.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Điểm số của bạn</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          
          <div className="text-2xl font-bold mb-6">
            {score} / {questions.length}
          </div>
          
          <Button onClick={handleRestart} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm lại
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Header with progress and timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-sm font-medium flex items-center gap-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {timeLeft}s
            </div>
            <div>
              Điểm: <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="p-6 mb-4">
        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
        
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                selectedOption === index 
                  ? selectedOption === question.correctAnswer
                    ? 'bg-green-100 border-green-500 border'
                    : 'bg-red-100 border-red-500 border'
                  : isAnswered && index === question.correctAnswer
                    ? 'bg-green-100 border-green-500 border'
                    : 'bg-secondary hover:bg-secondary/80 border-transparent border'
              }`}
              disabled={isAnswered}
            >
              <div className="flex items-center">
                {selectedOption === index ? (
                  selectedOption === question.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2 text-red-600 flex-shrink-0" />
                  )
                ) : isAnswered && index === question.correctAnswer ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-primary/30 mr-2 flex items-center justify-center flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Controls */}
      <div className="mt-auto">
        <Button 
          onClick={handleNextQuestion} 
          disabled={!isAnswered}
          className="w-full"
        >
          {isLastQuestion ? 'Xem kết quả' : 'Câu tiếp theo'}
        </Button>
      </div>
    </div>
  );
};

export default QuizTemplate;

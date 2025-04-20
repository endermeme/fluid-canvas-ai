
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GameControls from '../../components/GameControls';
import { CheckCircle, XCircle } from 'lucide-react';
import GameWrapper from './GameWrapper';

interface QuizTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ data, content, topic, onBack }) => {
  const gameContent = content || data;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timePerQuestion || 30);
  const [totalTimeLeft, setTotalTimeLeft] = useState(gameContent?.settings?.totalTime || 300);
  const [timerRunning, setTimerRunning] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const questions = gameContent?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      
      const questionTime = gameContent?.settings?.timePerQuestion || 30;
      const totalTime = gameContent?.settings?.totalTime || (questions.length * questionTime);
      
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
      
      console.log(`Game initialized with ${questionTime}s per question and ${totalTime}s total time`);
      console.log("Game content:", gameContent);
      console.log("Questions:", questions);
    }
  }, [gameContent, questions, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && timerRunning && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning && !isAnswered) {
      setTimerRunning(false);
      setIsAnswered(true);
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không trả lời kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, isAnswered, toast]);

  useEffect(() => {
    if (totalTimeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (totalTimeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
      
      toast({
        title: "Trò chơi kết thúc",
        description: "Đã hết thời gian. Hãy xem kết quả của bạn.",
        variant: "destructive",
      });
    }
  }, [totalTimeLeft, gameStarted, showResult, toast]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    setTimerRunning(false);
    
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      
      if (gameContent?.settings?.bonusTimePerCorrect) {
        const bonusTime = gameContent.settings.bonusTimePerCorrect;
        setTotalTimeLeft(prev => prev + bonusTime);
        
        toast({
          title: "Chính xác! +1 điểm",
          description: `Câu trả lời của bạn đúng. +${bonusTime}s thời gian thưởng.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Chính xác! +1 điểm",
          description: "Câu trả lời của bạn đúng.",
          variant: "default",
        });
      }
    } else {
      toast({
        title: "Không chính xác!",
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
      setTimeLeft(gameContent?.settings?.timePerQuestion || 30);
      setTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setTimeLeft(gameContent?.settings?.timePerQuestion || 30);
    setTotalTimeLeft(gameContent?.settings?.totalTime || 300);
    setTimerRunning(true);
    setGameStarted(true);
  };

  const handleShare = async () => {
    try {
      toast({
        title: "Chức năng chia sẻ",
        description: "Chức năng chia sẻ đang được phát triển.",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!content || !questions.length) {
    return <div className="p-4">Không có dữ liệu câu hỏi</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <GameWrapper
        onBack={onBack}
        progress={100}
        timeLeft={totalTimeLeft}
        score={score}
        currentItem={questions.length}
        totalItems={questions.length}
        title="Kết quả"
        onShare={handleShare}
      >
        <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
            <p className="text-lg mb-4">
              Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
            </p>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Điểm của bạn</span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            
            <div className="text-4xl font-bold mb-6 text-primary">
              {score} / {questions.length}
            </div>
            
            <GameControls onRestart={handleRestart} className="mt-4" />
          </div>
        </Card>
      </GameWrapper>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={score}
      currentItem={currentQuestion + 1}
      totalItems={questions.length}
      onShare={handleShare}
    >
      <Card className="flex-grow p-6 mb-4 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
        <h2 className="text-xl font-semibold mb-6 text-primary">{question.question}</h2>
        
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                selectedOption === index 
                  ? selectedOption === question.correctAnswer
                    ? 'bg-green-100 border-green-500 border shadow-md'
                    : 'bg-red-100 border-red-500 border shadow-md'
                  : isAnswered && index === question.correctAnswer
                    ? 'bg-green-100 border-green-500 border shadow-md'
                    : 'bg-secondary/50 hover:bg-secondary/80 border-transparent border hover:shadow-md'
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
                  <div className="h-5 w-5 rounded-full border border-primary/30 mr-2 flex items-center justify-center flex-shrink-0 bg-primary/5">
                    {String.fromCharCode(65 + index)}
                  </div>
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <GameControls 
        onRestart={handleRestart}
        onNext={isAnswered ? handleNextQuestion : undefined}
        disabled={!isAnswered}
        isLastItem={isLastQuestion}
      />
    </GameWrapper>
  );
};

export default QuizTemplate;

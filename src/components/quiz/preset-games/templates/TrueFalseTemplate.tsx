import React, { useState, useEffect } from 'react';
import GameWrapper from './GameWrapper';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GameHeader from '../../components/GameHeader';
import GameControls from '../../components/GameControls';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TrueFalseTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ data, content, topic, onBack }) => {
  const gameContent = content || data;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<boolean | null>>([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timePerQuestion || 15);
  const [totalTimeLeft, setTotalTimeLeft] = useState(gameContent?.settings?.totalTime || 150);
  const [timerRunning, setTimerRunning] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const questions = gameContent?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentAnswer = userAnswers[currentQuestion];

  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      
      const questionTime = gameContent?.settings?.timePerQuestion || 15;
      const totalTime = gameContent?.settings?.totalTime || (questions.length * questionTime);
      
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
      
      console.log(`Game initialized with ${questionTime}s per question and ${totalTime}s total time`);
      console.log("Game content:", gameContent);
      console.log("Questions:", questions);
    }
  }, [gameContent, questions, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && timerRunning) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không trả lời kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, toast]);

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

  const handleAnswer = (answer: boolean) => {
    if (currentAnswer !== null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
    setShowExplanation(gameContent?.settings?.showExplanation ?? true);
    setTimerRunning(false);

    const isCorrect = answer === questions[currentQuestion].isTrue;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Chính xác! +1 điểm",
        description: "Câu trả lời của bạn đúng.",
        variant: "default",
      });
    } else {
      toast({
        title: "Không chính xác!",
        description: "Câu trả lời của bạn không đúng.",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setTimeLeft(gameContent?.settings?.timePerQuestion || 15);
      setTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setShowExplanation(false);
    setShowResult(false);
    setTimeLeft(gameContent?.settings?.timePerQuestion || 15);
    setTotalTimeLeft(gameContent?.settings?.totalTime || 150);
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

  if (!gameContent || !questions.length) {
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
            
            <GameControls onRestart={handleRestart} />
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
    >
      <Card className="flex-grow p-6 mb-4">
        <h2 className="text-xl font-semibold mb-6">{question.statement}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button 
            className={`p-6 flex items-center justify-center rounded-lg transition-colors ${
              currentAnswer === true 
                ? currentAnswer === question.isTrue
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary/80 hover:bg-primary text-white'
            }`}
            onClick={() => handleAnswer(true)}
            disabled={currentAnswer !== null}
          >
            <CheckCircle className="h-7 w-7 mr-2" />
            <span className="text-lg font-medium">Đúng</span>
          </button>
          
          <button 
            className={`p-6 flex items-center justify-center rounded-lg transition-colors ${
              currentAnswer === false 
                ? currentAnswer === question.isTrue
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary/80 hover:bg-primary text-white'
            }`}
            onClick={() => handleAnswer(false)}
            disabled={currentAnswer !== null}
          >
            <XCircle className="h-7 w-7 mr-2" />
            <span className="text-lg font-medium">Sai</span>
          </button>
        </div>
        
        {showExplanation && (
          <div className={`p-4 rounded-lg mt-4 ${question.isTrue ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start">
              <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${question.isTrue ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium mb-1">Giải thích:</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <GameControls 
        onRestart={handleRestart}
        onNext={handleNextQuestion}
        disabled={currentAnswer === null}
        isLastItem={isLastQuestion}
      />
    </GameWrapper>
  );
};

export default TrueFalseTemplate;

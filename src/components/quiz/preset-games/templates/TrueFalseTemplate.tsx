import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import GameWrapper from './GameWrapper';

interface TrueFalseTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  gameId?: string;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({
  data,
  content,
  topic,
  onBack,
  gameId,
}) => {
  const gameContent = content || data;

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timeLimit || 300);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      let questions = [];
      if (content?.questions?.length) {
        questions = content.questions;
      } else if (data?.questions?.length) {
        questions = data.questions;
      }

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        setError("Không có dữ liệu cho trò chơi.");
      } else {
        setQuestions(questions);
        setError(null);
      }
    } catch (err) {
      setError("Dữ liệu trò chơi không hợp lệ!");
    }
    setLoading(false);
  }, [data, content]);

  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      setTimeLeft(gameContent?.settings?.timeLimit || 300);
    }
  }, [gameContent, questions, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
      
      toast({
        title: "Thời gian đã hết",
        description: "Hãy xem kết quả của bạn.",
        variant: "default",
      });
    }
  }, [timeLeft, gameStarted, showResult, toast]);

  const handleAnswer = (answer: boolean) => {
    setUserAnswers([...userAnswers, answer]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
      
      toast({
        title: "Hoàn thành",
        description: "Bạn đã trả lời hết các câu hỏi.",
        variant: "default",
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setTimeLeft(gameContent?.settings?.timeLimit || 300);
    setGameStarted(true);
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].correctAnswer === userAnswers[i]) {
        score++;
      }
    }
    return score;
  };

  if (loading) {
    return (
      <GameWrapper
        title="Đúng / Sai"
        gameId={gameId}
        onBack={onBack}
      >
        <div className="text-center py-8 text-lg text-gray-500">Đang tải trò chơi...</div>
      </GameWrapper>
    )
  }

  if (error) {
    return (
      <GameWrapper
        title="Đúng / Sai"
        gameId={gameId}
        onBack={onBack}
      >
        <div className="text-center py-8 text-red-500">
          {error}
          <div className="text-sm text-gray-400 mt-1">Bạn vui lòng chọn topic hoặc thử lại!</div>
        </div>
      </GameWrapper>
    )
  }

  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <GameWrapper
        onBack={onBack}
        progress={100}
        timeLeft={timeLeft}
        score={score}
        currentItem={questions.length}
        totalItems={questions.length}
        title="Kết quả"
        gameId={gameId}
      >
        <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
            <p className="text-lg mb-4">
              Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
            </p>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Điểm số</span>
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
            
            <div className="space-x-4">
              <Button onClick={handleRestart} className="mt-4">
                Chơi lại
              </Button>
              <Button variant="outline" onClick={onBack} className="mt-4">
                Quay lại
              </Button>
            </div>
          </div>
        </Card>
      </GameWrapper>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={calculateScore()}
      currentItem={currentQuestionIndex + 1}
      totalItems={questions.length}
      title={gameContent.title || "Đúng / Sai"}
      gameId={gameId}
    >
      <div className="flex flex-col h-full justify-between">
        <Card className="flex-grow flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-bold mb-4">{currentQuestion.question}</div>
          </div>
        </Card>
        
        <div className="flex justify-around items-center mt-4 px-2">
          <Button 
            onClick={() => handleAnswer(true)}
            className="w-24"
          >
            <Check className="h-4 w-4 mr-2" />
            Đúng
          </Button>
          
          <Button 
            onClick={() => handleAnswer(false)}
            className="w-24"
          >
            <X className="h-4 w-4 mr-2" />
            Sai
          </Button>
        </div>
      </div>
    </GameWrapper>
  );
};
export default TrueFalseTemplate;

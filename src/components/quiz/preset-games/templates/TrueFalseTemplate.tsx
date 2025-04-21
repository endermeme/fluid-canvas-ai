
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameWrapper from './GameWrapper';

interface TrueFalseTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  gameId?: string;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ data, content, topic, onBack, gameId }) => {
  const gameContent = content || data;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timePerQuestion || 20);
  const [totalTimeLeft, setTotalTimeLeft] = useState(gameContent?.settings?.totalTime || 300);
  const [timerRunning, setTimerRunning] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  // Xử lý các dạng dữ liệu câu hỏi khác nhau
  const [processedQuestions, setProcessedQuestions] = useState<any[]>([]);
  
  // Xử lý dữ liệu câu hỏi
  useEffect(() => {
    if (gameContent) {
      console.log("True/False game content:", gameContent);
      processQuestionData();
    }
  }, [gameContent]);

  const processQuestionData = () => {
    const rawQuestions = gameContent?.questions || gameContent?.statements || [];
    if (!rawQuestions || rawQuestions.length === 0) {
      console.error("No question data available", gameContent);
      return;
    }

    let formatted = [];
    
    // Kiểm tra cấu trúc dữ liệu và định dạng phù hợp
    if (rawQuestions[0].statement !== undefined && 'isTrue' in rawQuestions[0]) {
      // Format 1: { statement: "...", isTrue: true/false, explanation: "..." }
      formatted = rawQuestions;
    } else if (rawQuestions[0].text !== undefined && 'correct' in rawQuestions[0]) {
      // Format 2: { text: "...", correct: true/false, explanation: "..." }
      formatted = rawQuestions.map((q: any) => ({
        statement: q.text,
        isTrue: q.correct,
        explanation: q.explanation || q.feedback
      }));
    } else if (Array.isArray(rawQuestions)) {
      // Format 3: Các định dạng khác, thử đoán các trường
      formatted = rawQuestions.map((q: any) => {
        const statementField = Object.keys(q).find(k => 
          ['statement', 'text', 'question', 'content'].includes(k.toLowerCase())
        ) || Object.keys(q)[0];
        
        const isTrueField = Object.keys(q).find(k => 
          ['istrue', 'correct', 'answer', 'value'].includes(k.toLowerCase())
        );
        
        const explanationField = Object.keys(q).find(k => 
          ['explanation', 'feedback', 'description', 'detail'].includes(k.toLowerCase())
        );
        
        return {
          statement: q[statementField],
          isTrue: isTrueField ? q[isTrueField] : Math.random() > 0.5, // Mặc định ngẫu nhiên nếu không có
          explanation: explanationField ? q[explanationField] : ''
        };
      });
    }
    
    setProcessedQuestions(formatted);
    console.log("Processed questions:", formatted);
  };

  // Xác định số lượng câu hỏi
  const isLastQuestion = currentQuestion === processedQuestions.length - 1;

  useEffect(() => {
    if (!gameStarted && processedQuestions.length > 0) {
      setGameStarted(true);
      
      const questionTime = gameContent?.settings?.timePerQuestion || 20;
      const totalTime = gameContent?.settings?.totalTime || (processedQuestions.length * questionTime);
      
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
    }
  }, [gameContent, processedQuestions, gameStarted]);

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

  const handleOptionSelect = (option: boolean) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    setTimerRunning(false);
    
    const question = processedQuestions[currentQuestion];
    if (option === question.isTrue) {
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
        description: `Đáp án đúng là: ${question.isTrue ? 'Đúng' : 'Sai'}`,
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
      setTimeLeft(gameContent?.settings?.timePerQuestion || 20);
      setTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setTimeLeft(gameContent?.settings?.timePerQuestion || 20);
    setTotalTimeLeft(gameContent?.settings?.totalTime || 300);
    setTimerRunning(true);
    setGameStarted(true);
  };

  if (!gameContent) {
    console.error("No game content provided");
    return <div className="p-4">Không có dữ liệu cho trò chơi</div>;
  }

  if (!processedQuestions || processedQuestions.length === 0) {
    console.error("No processed questions available", gameContent);
    return <div className="p-4">Đang tải dữ liệu câu hỏi...</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / processedQuestions.length) * 100);
    
    return (
      <GameWrapper
        onBack={onBack}
        progress={100}
        timeLeft={totalTimeLeft}
        score={score}
        currentItem={processedQuestions.length}
        totalItems={processedQuestions.length}
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
              {score} / {processedQuestions.length}
            </div>
            
            <Button onClick={handleRestart} className="mt-4">
              <Repeat className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </div>
        </Card>
      </GameWrapper>
    );
  }

  const question = processedQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / processedQuestions.length) * 100;

  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={score}
      currentItem={currentQuestion + 1}
      totalItems={processedQuestions.length}
      title={gameContent.title || "Đúng/Sai"}
      gameId={gameId}
    >
      <Card className="flex-grow p-6 mb-4 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
        <h2 className="text-xl font-semibold mb-6 text-primary">{question.statement}</h2>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => handleOptionSelect(true)}
            disabled={isAnswered}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200 ${
              isAnswered ? 
                selectedOption === true ?
                  selectedOption === question.isTrue ?
                    'bg-green-100 border-green-500 border shadow-md' :
                    'bg-red-100 border-red-500 border shadow-md' :
                  question.isTrue === true ?
                    'bg-green-100 border-green-500 border shadow-md' :
                    'bg-secondary/50' :
                'bg-secondary/50 hover:bg-secondary/80 border-transparent border hover:shadow-md'
            } w-full sm:w-48 text-center py-8`}
          >
            {isAnswered && selectedOption === true ? (
              selectedOption === question.isTrue ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )
            ) : isAnswered && question.isTrue === true ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <ThumbsUp className="h-6 w-6" />
            )}
            <span className="font-medium text-lg">Đúng</span>
          </button>
          
          <button
            onClick={() => handleOptionSelect(false)}
            disabled={isAnswered}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200 ${
              isAnswered ? 
                selectedOption === false ?
                  selectedOption === question.isTrue ?
                    'bg-green-100 border-green-500 border shadow-md' :
                    'bg-red-100 border-red-500 border shadow-md' :
                  question.isTrue === false ?
                    'bg-green-100 border-green-500 border shadow-md' :
                    'bg-secondary/50' :
                'bg-secondary/50 hover:bg-secondary/80 border-transparent border hover:shadow-md'
            } w-full sm:w-48 text-center py-8`}
          >
            {isAnswered && selectedOption === false ? (
              selectedOption === question.isTrue ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )
            ) : isAnswered && question.isTrue === false ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <ThumbsDown className="h-6 w-6" />
            )}
            <span className="font-medium text-lg">Sai</span>
          </button>
        </div>
        
        {isAnswered && question.explanation && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <p className="font-medium mb-1">Giải thích:</p>
            <p>{question.explanation}</p>
          </div>
        )}
      </Card>
      
      {isAnswered && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleNextQuestion}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            {isLastQuestion ? 'Xem kết quả' : 'Câu hỏi tiếp theo'}
          </Button>
        </div>
      )}
    </GameWrapper>
  );
};

export default TrueFalseTemplate;

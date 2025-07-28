import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, ChevronRight, Clock, Share2 } from 'lucide-react';


interface TrueFalseTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  settings?: any;
  onShare?: () => Promise<string>;
  onGameComplete?: (score: number, totalQuestions: number, completionTime?: number) => void;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ data, content, topic, settings, onShare, onGameComplete }) => {
  const gameContent = content || data;
  const questions = gameContent?.questions || [];
  
  const gameSettings = {
    timePerQuestion: settings?.timePerQuestion || 12,
    totalTime: settings?.totalTime || 180,
    showExplanation: settings?.showExplanation !== false
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>(new Array(questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameSettings.timePerQuestion);
  const [totalTimeLeft, setTotalTimeLeft] = useState(gameSettings.totalTime);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Generate HTML content for sharing
  const generateHtmlContent = (): string => {
    if (!gameContent?.questions) return '';
    
    const questionsJson = JSON.stringify(gameContent.questions);
    
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameContent.title || topic}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; }
        .question { font-size: 18px; margin: 20px 0; }
        .buttons { display: flex; gap: 15px; justify-content: center; margin: 20px 0; }
        .btn { padding: 15px 30px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
        .btn-true { background: #4CAF50; color: white; }
        .btn-false { background: #f44336; color: white; }
        .correct { background: #2196F3 !important; }
        .incorrect { background: #FF9800 !important; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${gameContent.title || topic}</h1>
        <div id="game-content"></div>
    </div>
    <script>
        const questions = ${questionsJson};
        let currentQ = 0;
        let score = 0;
        
        function showQuestion() {
            const q = questions[currentQ];
            document.getElementById('game-content').innerHTML = \`
                <div class="question">\${q.statement}</div>
                <div class="buttons">
                    <button class="btn btn-true" onclick="answer(true)">ĐÚNG</button>
                    <button class="btn btn-false" onclick="answer(false)">SAI</button>
                </div>
            \`;
        }
        
        function answer(userAnswer) {
            const correct = userAnswer === questions[currentQ].isTrue;
            if (correct) score++;
            
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => btn.disabled = true);
            
            setTimeout(() => {
                currentQ++;
                if (currentQ < questions.length) {
                    showQuestion();
                } else {
                    showResult();
                }
            }, 1000);
        }
        
        function showResult() {
            document.getElementById('game-content').innerHTML = \`
                <h2>Kết quả: \${score}/\${questions.length}</h2>
                <button class="btn btn-true" onclick="location.reload()">Chơi lại</button>
            \`;
        }
        
        showQuestion();
    </script>
</body>
</html>`;
  };

  const miniGame = {
    title: gameContent?.title || topic,
    content: generateHtmlContent()
  };

  

  // Initialize game
  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
  }, [gameContent, questions, gameStarted]);

  // Timer for current question
  useEffect(() => {
    if (timeLeft > 0 && gameStarted && !showResult && userAnswers[currentQuestion] === null) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && userAnswers[currentQuestion] === null) {
      // Time's up, auto skip
      handleNextQuestion();
    }
  }, [timeLeft, gameStarted, showResult, currentQuestion, userAnswers]);

  // Total game timer
  useEffect(() => {
    if (totalTimeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (totalTimeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
    }
  }, [totalTimeLeft, gameStarted, showResult]);

  const handleAnswer = (answer: boolean) => {
    if (userAnswers[currentQuestion] !== null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);

    const isCorrect = answer === questions[currentQuestion].isTrue;
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Chính xác!",
        description: "Câu trả lời của bạn đúng. +1 điểm",
      });
    } else {
      toast({
        title: "Không chính xác!",
        description: "Câu trả lời của bạn sai.",
        variant: "destructive",
      });
    }

    if (gameSettings.showExplanation) {
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      // Game completed
      const finalScore = userAnswers.filter((answer, index) => answer === questions[index]?.isTrue).length;
      const completionTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      
      console.log('🔥 [DEBUG] TrueFalse game completed, calling onGameComplete with:', { finalScore, total: questions.length, completionTime });
      
      if (onGameComplete) {
        onGameComplete(finalScore, questions.length, completionTime);
      } else {
        console.log('🔥 [DEBUG] TrueFalse onGameComplete not provided!');
      }
      
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setTimeLeft(gameSettings.timePerQuestion);
    }
  };

  if (!gameContent || !questions.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-primary">Không có dữ liệu câu hỏi</p>
          <p className="text-sm text-primary/70 mt-2">Vui lòng thử lại hoặc chọn game khác</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const finalScore = userAnswers.filter((answer, index) => answer === questions[index]?.isTrue).length;
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary">Kết Quả</h2>
          <p className="text-lg mb-4 text-primary">
            Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
          </p>
          <div className="mb-6">
            <div className="text-4xl font-bold mb-2 text-primary">{percentage}%</div>
            <div className="text-lg text-primary">{finalScore} / {questions.length} câu đúng</div>
            <Progress value={percentage} className="h-3 mt-4" />
          </div>
          <div className="text-sm text-primary/70">
            Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
          </div>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = userAnswers[currentQuestion];
  const isAnswered = currentAnswer !== null;

  return (
    <div className="unified-game-container">
      {/* Header */}
      <div className="game-header">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium px-3 py-1 bg-muted rounded-full text-primary">
            Câu {currentQuestion + 1}/{questions.length}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center px-3 py-1 bg-muted rounded-full text-primary">
              <Clock className="h-4 w-4 mr-1" />
              <span>{timeLeft}s</span>
            </div>
            <div className="flex items-center px-3 py-1 bg-primary/10 rounded-full text-primary">
              <Clock className="h-4 w-4 mr-1" />
              <span>{Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="px-3 py-1 bg-primary/10 rounded-full text-primary">
              Điểm: <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6 mb-4 mx-4">
        <h2 className="text-xl font-semibold mb-6 text-center text-primary">
          {question?.statement}
        </h2>
        
        {/* Answer Buttons */}
        <div className="grid grid-cols-1 gap-4 mb-6 max-w-md mx-auto">
          <Button 
            onClick={() => handleAnswer(true)}
            disabled={isAnswered}
            variant={currentAnswer === true ? (currentAnswer === question?.isTrue ? "default" : "destructive") : "default"}
            size="lg"
            className="p-6 min-h-[80px] text-lg font-medium"
          >
            <CheckCircle className="h-8 w-8 mr-3" />
            ĐÚNG
          </Button>
          
          <Button 
            onClick={() => handleAnswer(false)}
            disabled={isAnswered}
            variant={currentAnswer === false ? (currentAnswer === question?.isTrue ? "default" : "destructive") : "secondary"}
            size="lg"
            className="p-6 min-h-[80px] text-lg font-medium"
          >
            <XCircle className="h-8 w-8 mr-3" />
            SAI
          </Button>
        </div>
        
        {/* Explanation */}
        {showExplanation && question?.explanation && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="font-medium mb-2">Giải thích:</p>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}
      </Card>

      {/* Next Button */}
      <div className="px-4 pb-2">
        <Button 
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className="w-full"
          size="lg"
        >
          {currentQuestion === questions.length - 1 ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TrueFalseTemplate;
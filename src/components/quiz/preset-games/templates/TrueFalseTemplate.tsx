import React, { useState, useEffect } from 'react';
import PresetGameHeader from '../PresetGameHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, AlertCircle, Clock, ChevronRight, Share2 } from 'lucide-react';
import { useGameShareManager } from '../../hooks/useGameShareManager';

interface TrueFalseTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onShare?: () => Promise<string>;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ data, content, topic, onShare }) => {
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

  // Tạo miniGame object cho sharing
  const miniGame = {
    title: gameContent?.title || topic,
    content: generateHtmlContent()
  };

  const { isSharing, handleShare } = useGameShareManager(miniGame, toast, onShare);

  const questions = gameContent?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentAnswer = userAnswers[currentQuestion];

  // Tạo HTML content cho việc chia sẻ
  function generateHtmlContent(): string {
    if (!gameContent?.questions) return '';
    
    const questionsJson = JSON.stringify(gameContent.questions);
    const settingsJson = JSON.stringify(gameContent.settings || {});
    
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameContent.title || topic}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        .game-container {
            max-width: 600px;
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .header { text-align: center; margin-bottom: 20px; }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        .question-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .answer-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .answer-btn {
            padding: 15px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .btn-true {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }
        .btn-false {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .btn-correct { background: #28a745 !important; }
        .btn-incorrect { background: #dc3545 !important; }
        .explanation {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            border-left: 4px solid #007bff;
        }
        .result-screen {
            text-align: center;
            padding: 40px 20px;
        }
        .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        .hidden { display: none !important; }
        .timer { 
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 5px 10px;
            border-radius: 15px;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="header">
            <h1>${gameContent.title || topic}</h1>
            <div id="game-info">
                <span>Câu hỏi <span id="current-q">1</span>/<span id="total-q"></span></span>
                <span class="timer">⏱️ <span id="timer">15</span>s</span>
                <span class="timer">📊 Điểm: <span id="score">0</span></span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="progress"></div>
            </div>
        </div>

        <div id="game-screen">
            <div class="question-card">
                <h2 id="question-text"></h2>
                <div class="answer-buttons">
                    <button class="answer-btn btn-true" onclick="answerQuestion(true)">
                        ✓ ĐÚNG
                    </button>
                    <button class="answer-btn btn-false" onclick="answerQuestion(false)">
                        ✗ SAI
                    </button>
                </div>
                <div id="explanation" class="explanation hidden">
                    <strong>Giải thích:</strong>
                    <p id="explanation-text"></p>
                </div>
            </div>
            <button id="next-btn" class="answer-btn btn-true hidden" onclick="nextQuestion()">
                Câu tiếp theo →
            </button>
        </div>

        <div id="result-screen" class="result-screen hidden">
            <h2>Kết quả</h2>
            <div class="score-circle">
                <span id="final-score">0%</span>
            </div>
            <p>Bạn đã trả lời đúng <span id="correct-answers">0</span>/<span id="total-questions">0</span> câu hỏi</p>
            <button class="answer-btn btn-true" onclick="restartGame()" style="margin-top: 20px;">
                🔄 Chơi lại
            </button>
        </div>
    </div>

    <script>
        const questions = ${questionsJson};
        const settings = ${settingsJson};
        
        let currentQuestion = 0;
        let score = 0;
        let userAnswers = [];
        let timeLeft = settings.timePerQuestion || 15;
        let timer;

        function initGame() {
            document.getElementById('total-q').textContent = questions.length;
            document.getElementById('total-questions').textContent = questions.length;
            showQuestion(0);
            startTimer();
        }

        function showQuestion(index) {
            const question = questions[index];
            document.getElementById('current-q').textContent = index + 1;
            document.getElementById('question-text').textContent = question.statement;
            document.getElementById('explanation').classList.add('hidden');
            document.getElementById('next-btn').classList.add('hidden');
            
            // Reset button states
            document.querySelectorAll('.answer-btn').forEach(btn => {
                btn.classList.remove('btn-correct', 'btn-incorrect');
                btn.disabled = false;
            });

            updateProgress();
        }

        function answerQuestion(answer) {
            const question = questions[currentQuestion];
            const isCorrect = answer === question.isTrue;
            
            userAnswers[currentQuestion] = answer;
            
            // Update button states
            document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
            
            if (isCorrect) {
                score++;
                document.getElementById('score').textContent = score;
                event.target.classList.add('btn-correct');
            } else {
                event.target.classList.add('btn-incorrect');
            }

            // Show explanation if available
            if (question.explanation) {
                document.getElementById('explanation-text').textContent = question.explanation;
                document.getElementById('explanation').classList.remove('hidden');
            }

            document.getElementById('next-btn').classList.remove('hidden');
            clearInterval(timer);
        }

        function nextQuestion() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                timeLeft = settings.timePerQuestion || 15;
                showQuestion(currentQuestion);
                startTimer();
            } else {
                showResults();
            }
        }

        function showResults() {
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');
            
            const percentage = Math.round((score / questions.length) * 100);
            document.getElementById('final-score').textContent = percentage + '%';
            document.getElementById('correct-answers').textContent = score;
        }

        function restartGame() {
            currentQuestion = 0;
            score = 0;
            userAnswers = [];
            timeLeft = settings.timePerQuestion || 15;
            
            document.getElementById('score').textContent = '0';
            document.getElementById('game-screen').classList.remove('hidden');
            document.getElementById('result-screen').classList.add('hidden');
            
            showQuestion(0);
            startTimer();
        }

        function startTimer() {
            document.getElementById('timer').textContent = timeLeft;
            timer = setInterval(() => {
                timeLeft--;
                document.getElementById('timer').textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    // Auto skip to next question
                    document.getElementById('next-btn').classList.remove('hidden');
                    document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
                }
            }, 1000);
        }

        function updateProgress() {
            const progress = ((currentQuestion + 1) / questions.length) * 100;
            document.getElementById('progress').style.width = progress + '%';
        }

        // Initialize game when page loads
        window.addEventListener('load', initGame);
    </script>
</body>
</html>`;
  }

  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      const questionTime = gameContent?.settings?.timePerQuestion || 15;
      const totalTime = gameContent?.settings?.totalTime || (questions.length * questionTime);
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
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

  if (!gameContent || !questions.length) {
    return (
      <div className="p-4">
        <PresetGameHeader />
        <div className="text-center mt-8">
          <p className="text-lg text-primary">Không có dữ liệu câu hỏi</p>
          <p className="text-sm text-primary/70 mt-2">Vui lòng thử lại hoặc chọn game khác</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-primary/5 to-background">
        <PresetGameHeader onShare={handleShare} />
        <Card className="max-w-md w-full p-6 text-center mt-6 bg-gradient-to-br from-primary/5 to-background/50">
          <h2 className="text-2xl font-bold mb-4 text-primary">Kết Quả</h2>
          <p className="text-lg mb-4 text-primary">
            Chủ đề: <span className="font-semibold text-primary">{gameContent.title || topic}</span>
          </p>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-primary">Điểm của bạn</span>
              <span className="font-bold text-primary">{Math.round((userAnswers.filter((answer, index) => answer === questions[index].isTrue).length / questions.length) * 100)}%</span>
            </div>
            <Progress value={Math.round((userAnswers.filter((answer, index) => answer === questions[index].isTrue).length / questions.length) * 100)} className="h-3" />
          </div>
          <div className="text-2xl font-bold mb-6 text-primary">
            {userAnswers.filter((answer, index) => answer === questions[index].isTrue).length} / {questions.length}
          </div>
          <div className="text-sm mb-4 text-primary/70">
            Thời gian còn lại: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRestart} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi Lại
            </Button>
            <Button onClick={handleShare} disabled={isSharing} variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              {isSharing ? 'Đang chia sẻ...' : 'Chia sẻ'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const minutesLeft = Math.floor(totalTimeLeft / 60);
  const secondsLeft = totalTimeLeft % 60;
  const formattedTotalTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col p-0 h-full relative bg-gradient-to-br from-primary/5 to-background">
      <PresetGameHeader onShare={handleShare} />
      <div className="mb-4 mt-6 px-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-primary">
            Câu hỏi {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-sm font-medium flex items-center gap-2">
            <div className="flex items-center px-3 py-1 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 mr-1 text-primary" />
              <span className="text-primary">{timeLeft}s</span>
            </div>
            <div className="flex items-center px-3 py-1 bg-primary/10 rounded-full text-primary">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formattedTotalTime}</span>
            </div>
            <div className="px-3 py-1 bg-primary/10 rounded-full text-primary">
              Điểm: <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className="p-6 mb-4 mx-4 bg-gradient-to-br from-primary/5 to-background/50 backdrop-blur-sm border-primary/20">
        <h2 className="text-xl font-semibold mb-6 text-center text-primary">{question.statement}</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6 max-w-md mx-auto">
          <Button 
            className={`p-6 flex items-center justify-center text-lg font-medium min-h-[80px] ${
              currentAnswer === true 
                ? currentAnswer === question.isTrue
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
            onClick={() => handleAnswer(true)}
            disabled={currentAnswer !== null}
            size="lg"
          >
            <CheckCircle className="h-8 w-8 mr-3" />
            <span>ĐÚNG</span>
          </Button>
          
          <Button 
            className={`p-6 flex items-center justify-center text-lg font-medium min-h-[80px] ${
              currentAnswer === false 
                ? currentAnswer === question.isTrue
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-2 border-muted'
            }`}
            onClick={() => handleAnswer(false)}
            disabled={currentAnswer !== null}
            size="lg"
          >
            <XCircle className="h-8 w-8 mr-3" />
            <span>SAI</span>
          </Button>
        </div>
        
        {showExplanation && (
          <div className={`p-4 rounded-lg mt-4 ${question.isTrue ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start">
              <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${question.isTrue ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium mb-1 text-primary">Giải thích:</p>
                <p className="text-sm text-primary/80">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <div className="mt-auto flex gap-2 px-4 pb-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={handleRestart} 
          className="flex-1 bg-background/70 border-primary/20"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Làm lại
        </Button>
        <Button 
          onClick={handleNextQuestion} 
          disabled={currentAnswer === null}
          className="flex-1"
          size="sm"
        >
          {isLastQuestion ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default TrueFalseTemplate;

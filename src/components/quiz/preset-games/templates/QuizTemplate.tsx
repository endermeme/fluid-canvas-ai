
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
  const [totalTimeLeft, setTotalTimeLeft] = useState(content?.settings?.totalTime || 300);
  const [timerRunning, setTimerRunning] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const questions = content?.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;

  // Initialize the game
  useEffect(() => {
    if (!gameStarted && questions.length > 0) {
      setGameStarted(true);
      
      // Initialize timeLeft with proper settings
      const questionTime = content?.settings?.timePerQuestion || 30;
      const totalTime = content?.settings?.totalTime || (questions.length * questionTime);
      
      setTimeLeft(questionTime);
      setTotalTimeLeft(totalTime);
      
      console.log(`Game initialized with ${questionTime}s per question and ${totalTime}s total time`);
    }
  }, [content, questions, gameStarted]);

  // Question timer countdown
  useEffect(() => {
    if (timeLeft > 0 && timerRunning && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning && !isAnswered) {
      // Auto-move to next question if time runs out
      setTimerRunning(false);
      setIsAnswered(true);
      
      toast({
        title: "Time's up!",
        description: "You've run out of time for this question.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, isAnswered, toast]);

  // Total game timer countdown
  useEffect(() => {
    if (totalTimeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (totalTimeLeft === 0 && gameStarted && !showResult) {
      // Time's up - show results
      setShowResult(true);
      
      toast({
        title: "Game Over",
        description: "Total time has expired. Let's see your results.",
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
      
      // Add bonus time if specified in settings
      if (content?.settings?.bonusTimePerCorrect) {
        const bonusTime = content.settings.bonusTimePerCorrect;
        setTotalTimeLeft(prev => prev + bonusTime);
        
        toast({
          title: "Correct! +1 point",
          description: `Your answer is correct. +${bonusTime}s bonus time added.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Correct! +1 point",
          description: "Your answer is correct.",
          variant: "default",
        });
      }
    } else {
      toast({
        title: "Incorrect!",
        description: `The correct answer is: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`,
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
    setTotalTimeLeft(content?.settings?.totalTime || 300);
    setTimerRunning(true);
    setGameStarted(true);
  };

  if (!content || !questions.length) {
    return <div className="p-4">No question data available</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-background to-background/80">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <h2 className="text-3xl font-bold mb-4 text-primary">Results</h2>
          <p className="text-lg mb-4">
            Topic: <span className="font-semibold">{content.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Your score</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3 bg-secondary" />
          </div>
          
          <div className="text-4xl font-bold mb-6 text-primary">
            {score} / {questions.length}
          </div>
          
          <div className="text-sm mb-4 text-muted-foreground">
            Time remaining: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
          </div>
          
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  // Format total time remaining as mm:ss
  const minutesLeft = Math.floor(totalTimeLeft / 60);
  const secondsLeft = totalTimeLeft % 60;
  const formattedTotalTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      {/* Header with progress and timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-sm font-medium flex items-center gap-4">
            <div className="flex items-center px-3 py-1 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 mr-1 text-primary" />
              {timeLeft}s
            </div>
            <div className="flex items-center px-3 py-1 bg-primary/10 rounded-full text-primary/80">
              <Clock className="h-4 w-4 mr-1" />
              {formattedTotalTime}
            </div>
            <div className="px-3 py-1 bg-primary/10 rounded-full">
              Score: <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>

      {/* Question */}
      <Card className="p-6 mb-4 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
        <h2 className="text-xl font-semibold mb-6 text-primary">{question.question}</h2>
        
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                selectedOption === index 
                  ? selectedOption === question.correctAnswer
                    ? 'bg-green-100/50 border-green-500 border shadow-md'
                    : 'bg-red-100/50 border-red-500 border shadow-md'
                  : isAnswered && index === question.correctAnswer
                    ? 'bg-green-100/50 border-green-500 border shadow-md'
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

      {/* Controls */}
      <div className="mt-auto">
        <Button 
          onClick={handleNextQuestion} 
          disabled={!isAnswered}
          className={`w-full ${isAnswered ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary' : 'bg-primary/50'}`}
        >
          {isLastQuestion ? 'View Results' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default QuizTemplate;

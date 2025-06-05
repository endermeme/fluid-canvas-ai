import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Clock, RefreshCw, Trophy, ArrowRight, AlertCircle } from 'lucide-react';

interface PatternRecognitionProps {
  content: any;
  topic: string;
}

const PatternRecognitionTemplate: React.FC<PatternRecognitionProps> = ({ content, topic }) => {
  const [currentSequence, setCurrentSequence] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(content?.settings?.timeLimit || 30);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const { toast } = useToast();

  const sequences = content?.sequences || [
    {
      id: '1',
      pattern: [2, 4, 6, 8, 10],
      answer: '12',
      explanation: 'Số chẵn tăng dần (cộng 2)'
    },
    {
      id: '2',
      pattern: [1, 3, 6, 10, 15],
      answer: '21',
      explanation: 'Dãy số tam giác: 1, 1+2, 1+2+3, 1+2+3+4, 1+2+3+4+5, tiếp theo là 1+2+3+4+5+6=21'
    },
    {
      id: '3',
      pattern: [1, 4, 9, 16, 25],
      answer: '36',
      explanation: 'Bình phương các số tự nhiên: 1², 2², 3², 4², 5², tiếp theo là 6²=36'
    },
    {
      id: '4',
      pattern: [3, 1, 4, 1, 5],
      answer: '9',
      explanation: 'Dãy số π: 3.1415926... tiếp theo là 9'
    },
    {
      id: '5',
      pattern: [1, 1, 2, 3, 5],
      answer: '8',
      explanation: 'Dãy Fibonacci: mỗi số là tổng của hai số liền trước nó'
    }
  ];

  const totalSequences = sequences.length;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !isCorrect && !gameCompleted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCorrect && !gameCompleted) {
      handleTimeUp();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isCorrect, gameCompleted]);

  const handleTimeUp = () => {
    toast({
      title: 'Hết giờ!',
      description: 'Bạn đã hết thời gian cho câu hỏi này.',
      variant: 'destructive',
    });
    
    if (currentSequence < totalSequences - 1) {
      setTimeout(() => {
        setCurrentSequence(currentSequence + 1);
        setUserAnswer('');
        setIsCorrect(null);
        setShowExplanation(false);
        setTimeLeft(content?.settings?.timeLimit || 30);
      }, 2000);
    } else {
      setGameCompleted(true);
    }
  };

  const handleSubmit = () => {
    const currentPattern = sequences[currentSequence];
    const isAnswerCorrect = userAnswer.trim() === currentPattern.answer.toString();
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
      toast({
        title: 'Đúng rồi!',
        description: 'Bạn đã nhận diện đúng quy luật.',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Chưa đúng',
        description: `Đáp án đúng là: ${currentPattern.answer}`,
        variant: 'destructive',
      });
    }
    
    setShowExplanation(true);
    
    if (currentSequence < totalSequences - 1) {
      setTimeout(() => {
        setCurrentSequence(currentSequence + 1);
        setUserAnswer('');
        setIsCorrect(null);
        setShowExplanation(false);
        setTimeLeft(content?.settings?.timeLimit || 30);
      }, 3000);
    } else {
      setGameCompleted(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userAnswer.trim() !== '') {
      handleSubmit();
    }
  };
  
  const resetGame = () => {
    setCurrentSequence(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setGameCompleted(false);
    setTimeLeft(content?.settings?.timeLimit || 30);
    setShowExplanation(false);
  };
  
  const renderSequence = (sequence: any) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {sequence.pattern.map((item: string | number, index: number) => (
          <div 
            key={index} 
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-blue-500 rounded-md shadow-md text-lg font-bold text-blue-700"
          >
            {item}
          </div>
        ))}
        <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-blue-500 rounded-md bg-blue-50 text-lg font-bold">
          ?
        </div>
      </div>
    );
  };

  if (gameCompleted) {
    return (
      <div className="min-h-[500px] p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md p-6 bg-blue-50">
          <div className="flex flex-col items-center text-center">
            <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Trò chơi hoàn thành!</h2>
            <p className="text-xl mb-6">Điểm của bạn: {score}/{totalSequences}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div 
                className="bg-green-600 h-4 rounded-full" 
                style={{ width: `${(score / totalSequences) * 100}%` }}
              />
            </div>
            
            <p className="mb-6">
              {score === totalSequences 
                ? 'Tuyệt vời! Bạn đã nhận diện đúng tất cả các mẫu.' 
                : 'Hãy tiếp tục luyện tập để cải thiện kỹ năng nhận diện mẫu của bạn.'}
            </p>
            
            <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] p-4">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />
          <h2 className="text-xl font-bold">Nhận Dạng Mẫu: {topic}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className={`font-medium ${timeLeft < 10 ? 'text-red-500' : 'text-blue-500'}`}>
            {timeLeft}s
          </span>
        </div>
      </Card>
      
      <div className="mb-4">
        <Progress value={((currentSequence) / totalSequences) * 100} className="h-2" />
        <div className="flex justify-between mt-1 text-sm text-gray-500">
          <span>Câu {currentSequence + 1}</span>
          <span>Tổng {totalSequences} câu</span>
        </div>
      </div>
      
      <Card className="p-6 mb-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-6">Xác định phần tử tiếp theo trong dãy:</h3>
          
          {sequences[currentSequence] && renderSequence(sequences[currentSequence])}
          
          <div className="mt-8">
            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => !isCorrect && setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập phần tử tiếp theo"
                disabled={isCorrect !== null || gameCompleted}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg w-full max-w-[200px]"
              />
              
              <Button 
                onClick={handleSubmit}
                disabled={userAnswer.trim() === '' || isCorrect !== null || gameCompleted}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Kiểm tra
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {showExplanation && (
        <Card className={`p-4 mb-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-start gap-2">
            <AlertCircle className={`h-5 w-5 mt-0.5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <h4 className="font-medium">Giải thích:</h4>
              <p>{sequences[currentSequence].explanation}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PatternRecognitionTemplate;

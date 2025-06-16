
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, RotateCcw, Eye, EyeOff, Timer, Trophy, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { orderingSampleData } from '../data/orderingSampleData';

interface OrderingTemplateProps {
  data?: any;
  onComplete?: (score: number) => void;
}

interface DraggedWord {
  word: string;
  originalIndex: number;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({ 
  data = orderingSampleData, 
  onComplete 
}) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [draggedWord, setDraggedWord] = useState<DraggedWord | null>(null);
  const [timeLeft, setTimeLeft] = useState(data.settings?.timeLimit || 180);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const currentSentence = useMemo(() => 
    data.sentences[currentSentenceIndex], 
    [data.sentences, currentSentenceIndex]
  );

  const progress = useMemo(() => 
    ((currentSentenceIndex + (arrangedWords.length === currentSentence?.words.length ? 1 : 0)) / data.sentences.length) * 100,
    [currentSentenceIndex, arrangedWords.length, currentSentence?.words.length, data.sentences.length]
  );

  // Timer effect
  React.useEffect(() => {
    if (!gameStarted || gameCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameCompleted(true);
          onComplete?.(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, timeLeft, score, onComplete]);

  // Initialize current sentence
  React.useEffect(() => {
    if (currentSentence) {
      const shuffled = [...currentSentence.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setArrangedWords([]);
      setShowHint(false);
    }
  }, [currentSentence]);

  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  const handleWordDragStart = useCallback((word: string, originalIndex: number) => {
    setDraggedWord({ word, originalIndex });
  }, []);

  const handleWordDrop = useCallback((targetIndex: number, isArrangedArea: boolean) => {
    if (!draggedWord) return;

    if (isArrangedArea) {
      // Drop into arranged area
      const newArranged = [...arrangedWords];
      newArranged.splice(targetIndex, 0, draggedWord.word);
      setArrangedWords(newArranged);
      
      const newAvailable = availableWords.filter((_, index) => index !== draggedWord.originalIndex);
      setAvailableWords(newAvailable);
    } else {
      // Drop back to available area
      const newAvailable = [...availableWords];
      newAvailable.splice(targetIndex, 0, draggedWord.word);
      setAvailableWords(newAvailable);
      
      const newArranged = arrangedWords.filter((_, index) => index !== draggedWord.originalIndex);
      setArrangedWords(newArranged);
    }
    
    setDraggedWord(null);
  }, [draggedWord, arrangedWords, availableWords]);

  const checkAnswer = useCallback(() => {
    if (!currentSentence || arrangedWords.length !== currentSentence.words.length) {
      toast({
        title: "Chưa hoàn thành",
        description: "Vui lòng sắp xếp tất cả các từ.",
        variant: "destructive"
      });
      return;
    }

    setAttempts(prev => prev + 1);
    
    const isCorrect = arrangedWords.every((word, index) => 
      word === currentSentence.words[currentSentence.correctOrder[index]]
    );

    if (isCorrect) {
      const points = Math.max(10 - attempts, 1);
      setScore(prev => prev + points);
      
      toast({
        title: "Chính xác!",
        description: `Bạn được ${points} điểm`,
      });

      // Move to next sentence or complete game
      if (currentSentenceIndex < data.sentences.length - 1) {
        setTimeout(() => {
          setCurrentSentenceIndex(prev => prev + 1);
          setAttempts(0);
        }, 1500);
      } else {
        setGameCompleted(true);
        onComplete?.(score + points);
      }
    } else {
      toast({
        title: "Chưa đúng",
        description: "Hãy thử sắp xếp lại.",
        variant: "destructive"
      });
    }
  }, [arrangedWords, currentSentence, attempts, score, currentSentenceIndex, data.sentences.length, onComplete, toast]);

  const resetSentence = useCallback(() => {
    if (currentSentence) {
      const shuffled = [...currentSentence.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setArrangedWords([]);
      setShowHint(false);
    }
  }, [currentSentence]);

  const toggleHint = useCallback(() => {
    setShowHint(prev => !prev);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="w-full max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold text-gray-800">{data.title}</CardTitle>
            <p className="text-gray-600 text-lg">{data.description}</p>
            <div className="flex justify-center gap-6 text-sm text-gray-500">
              <span>📝 {data.sentences.length} câu</span>
              <span>⏱️ {formatTime(timeLeft)}</span>
              <span>💡 Có gợi ý</span>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={startGame} size="lg" className="px-8 py-4 text-lg">
              Bắt đầu chơi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Card className="w-full max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <CardTitle className="text-3xl font-bold text-gray-800">Hoàn thành!</CardTitle>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-green-600">{score} điểm</div>
              <div className="flex justify-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Trophy className="h-5 w-5 mr-2" />
                  {Math.round((score / (data.sentences.length * 10)) * 100)}%
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Timer className="h-5 w-5 mr-2" />
                  {formatTime(data.settings?.timeLimit - timeLeft)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()} size="lg" className="px-8 py-4 text-lg">
              Chơi lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              Câu {currentSentenceIndex + 1}/{data.sentences.length}
            </Badge>
            <Badge variant="outline" className="text-lg px-3 py-1">
              <Star className="h-4 w-4 mr-1" />
              {score} điểm
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={timeLeft < 30 ? "destructive" : "outline"} className="text-lg px-3 py-1">
              <Timer className="h-4 w-4 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-600 mt-2 text-center">
            Tiến độ: {Math.round(progress)}%
          </p>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Words */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800">Từ cần sắp xếp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 min-h-[200px]">
                {availableWords.map((word, index) => (
                  <div
                    key={`available-${index}`}
                    draggable
                    onDragStart={() => handleWordDragStart(word, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleWordDrop(index, false)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-lg text-center cursor-move transition-all duration-200 hover:shadow-md text-lg font-medium"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Arranged Sentence */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-gray-800">Câu đã sắp xếp</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleHint}
                    className="text-sm"
                  >
                    {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetSentence}
                    className="text-sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="min-h-[120px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap gap-3 items-start"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleWordDrop(arrangedWords.length, true)}
              >
                {arrangedWords.length === 0 ? (
                  <div className="text-gray-400 text-center w-full mt-8 text-lg">
                    Kéo thả các từ vào đây để tạo câu
                  </div>
                ) : (
                  arrangedWords.map((word, index) => (
                    <div
                      key={`arranged-${index}`}
                      draggable
                      onDragStart={() => handleWordDragStart(word, index)}
                      className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-3 rounded-lg cursor-move transition-all duration-200 hover:shadow-md text-lg font-medium"
                    >
                      {word}
                    </div>
                  ))
                )}
              </div>

              {showHint && currentSentence && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-lg">
                    💡 <strong>Gợi ý:</strong> {currentSentence.words.join(' ')}
                  </p>
                </div>
              )}

              <Button
                onClick={checkAnswer}
                disabled={arrangedWords.length !== currentSentence?.words.length}
                className="w-full py-3 text-lg font-medium"
                size="lg"
              >
                <Check className="h-5 w-5 mr-2" />
                Kiểm tra câu trả lời
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderingTemplate;

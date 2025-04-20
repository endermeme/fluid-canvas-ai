import React, { useState, useEffect } from 'react';
import GameWrapper from './GameWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ArrowUp, ArrowDown, Check, Clock, Shuffle, Lightbulb, ArrowLeft } from 'lucide-react';

interface OrderingTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({ content, topic, onBack }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(content?.settings?.timeLimit || 180);
  const [timerRunning, setTimerRunning] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [hasShownHint, setHasShownHint] = useState(false);
  const { toast } = useToast();

  const sentences = content?.sentences || [];
  const isLastSentence = currentSentence === sentences.length - 1;

  useEffect(() => {
    if (sentences[currentSentence]) {
      const currentWords = [...sentences[currentSentence].words];
      const shuffled = [...currentWords].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setOrderedWords([]);
      setIsChecking(false);
      setHasShownHint(false);
    }
  }, [currentSentence, sentences]);

  useEffect(() => {
    if (timeLeft > 0 && timerRunning) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setShowResult(true);
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã hết thời gian làm bài.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, toast]);

  const handleWordSelect = (word: string, index: number) => {
    if (isChecking) return;
    
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);
    
    setOrderedWords([...orderedWords, word]);
  };

  const handleWordRemove = (word: string, index: number) => {
    if (isChecking) return;
    
    const newOrdered = [...orderedWords];
    newOrdered.splice(index, 1);
    setOrderedWords(newOrdered);
    
    setShuffledWords([...shuffledWords, word]);
  };

  const handleShuffleWords = () => {
    if (isChecking || shuffledWords.length === 0) return;
    
    setShuffledWords([...shuffledWords].sort(() => Math.random() - 0.5));
  };

  const handleCheck = () => {
    if (orderedWords.length !== sentences[currentSentence].words.length) {
      toast({
        title: "Chưa đủ từ",
        description: "Hãy sắp xếp tất cả các từ trước khi kiểm tra.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChecking(true);
    
    const correctOrder = sentences[currentSentence].correctOrder;
    const originalWords = sentences[currentSentence].words;
    
    let isCorrect = true;
    for (let i = 0; i < correctOrder.length; i++) {
      if (orderedWords[i] !== originalWords[correctOrder[i]]) {
        isCorrect = false;
        break;
      }
    }
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Chính xác!",
        description: "Bạn đã sắp xếp đúng thứ tự các từ.",
        variant: "default",
      });
    } else {
      toast({
        title: "Chưa chính xác!",
        description: "Thứ tự các từ chưa đúng.",
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      if (isLastSentence) {
        setShowResult(true);
      } else {
        setCurrentSentence(currentSentence + 1);
      }
    }, 2000);
  };

  const handleHint = () => {
    if (isChecking || hasShownHint) return;
    
    const correctOrder = sentences[currentSentence].correctOrder;
    const originalWords = sentences[currentSentence].words;
    
    const firstCorrectWordIndex = correctOrder[0];
    const firstCorrectWord = originalWords[firstCorrectWordIndex];
    
    if (orderedWords[0] === firstCorrectWord) {
      for (let i = 1; i < correctOrder.length; i++) {
        const correctWordIndex = correctOrder[i];
        const correctWord = originalWords[correctWordIndex];
        
        if (orderedWords[i] !== correctWord) {
          const shuffledIndex = shuffledWords.indexOf(correctWord);
          if (shuffledIndex !== -1) {
            const newShuffled = [...shuffledWords];
            newShuffled.splice(shuffledIndex, 1);
            
            const newOrdered = [...orderedWords];
            if (i < newOrdered.length) {
              newShuffled.push(newOrdered[i]);
            }
            newOrdered[i] = correctWord;
            
            setShuffledWords(newShuffled);
            setOrderedWords(newOrdered);
            break;
          }
        }
      }
    } else {
      const shuffledIndex = shuffledWords.indexOf(firstCorrectWord);
      if (shuffledIndex !== -1) {
        const newShuffled = [...shuffledWords];
        newShuffled.splice(shuffledIndex, 1);
        
        const newOrdered = [...orderedWords];
        if (newOrdered.length > 0) {
          newShuffled.push(newOrdered[0]);
        }
        newOrdered[0] = firstCorrectWord;
        
        setShuffledWords(newShuffled);
        setOrderedWords(newOrdered);
      }
    }
    
    setHasShownHint(true);
    setTimeLeft(Math.max(10, timeLeft - 30));
    
    toast({
      title: "Đã dùng gợi ý",
      description: "Thời gian bị trừ 30 giây.",
      variant: "default",
    });
  };

  const handleRestart = () => {
    setCurrentSentence(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(content?.settings?.timeLimit || 180);
    setTimerRunning(true);
    setIsChecking(false);
    
    if (sentences[0]) {
      const currentWords = [...sentences[0].words];
      const shuffled = [...currentWords].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setOrderedWords([]);
    }
  };

  if (!content || !sentences.length) {
    return <div className="p-4">Không có dữ liệu câu</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / sentences.length) * 100);
    
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
            {score} / {sentences.length}
          </div>
          
          <Button onClick={handleRestart} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm lại
          </Button>
        </Card>
      </div>
    );
  }

  const progress = ((currentSentence + 1) / sentences.length) * 100;

  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={score}
      currentItem={currentSentence + 1}
      totalItems={sentences.length}
    >
      <div className="flex flex-col p-4 h-full">
        <div className="mb-4 relative">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="absolute top-0 left-0 z-10 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </Button>
          )}
          
          <div className="flex justify-between items-center mb-2 mt-12">
            <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              Câu {currentSentence + 1}/{sentences.length}
            </div>
            <div className="text-sm font-medium flex items-center px-3 py-1 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 mr-1" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex-grow">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium mb-1">Sắp xếp lại từng từ để tạo thành câu hoàn chỉnh</h3>
            <p className="text-muted-foreground text-sm">Chọn từ theo đúng thứ tự</p>
          </div>
          
          <Card className="p-4 mb-4 min-h-[100px] flex flex-wrap gap-2 items-start content-start border border-primary/30 bg-background/80">
            {orderedWords.map((word, index) => (
              <button
                key={`ordered-${index}`}
                onClick={() => handleWordRemove(word, index)}
                disabled={isChecking}
                className={`py-2 px-3 rounded-lg ${
                  isChecking 
                    ? sentences[currentSentence].correctOrder[index] === sentences[currentSentence].words.indexOf(word)
                      ? 'bg-green-100 border border-green-500'
                      : 'bg-red-100 border border-red-500'
                    : 'bg-primary/20 hover:bg-primary/30'
                }`}
              >
                {word}
              </button>
            ))}
            {orderedWords.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground p-4">
                <p>Chọn từ bên dưới để bắt đầu sắp xếp</p>
              </div>
            )}
          </Card>
          
          <div className="p-4 bg-secondary/20 rounded-lg mb-4 flex flex-wrap gap-2 border border-primary/10">
            {shuffledWords.map((word, index) => (
              <button
                key={`shuffled-${index}`}
                onClick={() => handleWordSelect(word, index)}
                disabled={isChecking}
                className="py-2 px-3 bg-secondary hover:bg-secondary/80 rounded-lg"
              >
                {word}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={handleShuffleWords}
              disabled={isChecking || shuffledWords.length === 0}
              size="sm"
            >
              <Shuffle className="h-4 w-4 mr-1" />
              Xáo trộn
            </Button>
            
            {content?.settings?.showHints && (
              <Button
                variant="outline"
                onClick={handleHint}
                disabled={isChecking || hasShownHint}
                className={hasShownHint ? 'opacity-50' : ''}
                size="sm"
              >
                <Lightbulb className="h-4 w-4 mr-1" />
                Gợi ý
              </Button>
            )}
            
            <Button
              onClick={handleCheck}
              disabled={orderedWords.length !== sentences[currentSentence].words.length || isChecking}
              className={orderedWords.length !== sentences[currentSentence].words.length ? 'opacity-50' : ''}
              size="sm"
            >
              <Check className="h-4 w-4 mr-1" />
              Kiểm tra
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="mt-3 w-full bg-background/70 border-primary/20"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Làm lại
        </Button>
      </div>
    </GameWrapper>
  );
};

export default OrderingTemplate;

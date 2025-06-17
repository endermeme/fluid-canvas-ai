import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ArrowUp, ArrowDown, Check, Clock, Shuffle, Lightbulb } from 'lucide-react';

interface OrderingTemplateProps {
  content: any;
  topic: string;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({ content, topic }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(content?.settings?.timeLimit || 180);
  const [timerRunning, setTimerRunning] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [hasShownHint, setHasShownHint] = useState(false);
  const { toast } = useToast();

  const sentences = content?.sentences || [];

  useEffect(() => {
    if (sentences[currentSentence]) {
      const currentWords = [...sentences[currentSentence].words];
      const shuffled = [...currentWords].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setOrderedWords([]);
      setHasShownHint(false);
    }
  }, [currentSentence, sentences]);

  useEffect(() => {
    if (timeLeft > 0 && timerRunning && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning && !showResult) {
      setShowResult(true);
      setTimerRunning(false);
      
      toast({
        title: "Hết thời gian!",
        description: "Thời gian đã hết. Hãy xem kết quả của bạn.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, showResult, toast]);

  const handleWordSelect = (word: string, index: number) => {
    if (isChecking) return;
    
    setOrderedWords([...orderedWords, word]);
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);
  };

  const handleWordRemove = (word: string, index: number) => {
    if (isChecking) return;
    
    const newOrdered = [...orderedWords];
    newOrdered.splice(index, 1);
    setOrderedWords(newOrdered);
    setShuffledWords([...shuffledWords, word]);
  };

  const handleShuffleWords = () => {
    if (isChecking) return;
    const newShuffled = [...shuffledWords].sort(() => Math.random() - 0.5);
    setShuffledWords(newShuffled);
  };

  const handleCheck = () => {
    if (orderedWords.length !== sentences[currentSentence].words.length) return;
    
    setIsChecking(true);
    
    const isCorrect = orderedWords.every((word, index) => 
      sentences[currentSentence].correctOrder[index] === sentences[currentSentence].words.indexOf(word)
    );
    
    if (isCorrect) {
      setScore(score + 1);
      
      const bonusTime = content?.settings?.bonusTimePerCorrect || 0;
      if (bonusTime > 0) {
        setTimeLeft(timeLeft + bonusTime);
      }
      
      toast({
        title: "Chính xác! +1 điểm",
        description: bonusTime > 0 ? `Câu trả lời đúng! +${bonusTime}s thời gian thưởng.` : "Câu trả lời đúng!",
        variant: "default",
      });
    } else {
      toast({
        title: "Không chính xác!",
        description: "Thứ tự từ chưa đúng. Hãy thử lại.",
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      setIsChecking(false);
      
      if (isCorrect) {
        if (currentSentence < sentences.length - 1) {
          setCurrentSentence(currentSentence + 1);
        } else {
          setShowResult(true);
          setTimerRunning(false);
        }
      }
    }, 2000);
  };

  const handleHint = () => {
    if (hasShownHint || isChecking) return;
    
    if (sentences[currentSentence]?.correctOrder && sentences[currentSentence]?.words) {
      const firstCorrectIndex = sentences[currentSentence].correctOrder[0];
      const firstCorrectWord = sentences[currentSentence].words[firstCorrectIndex];
      
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
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">Không có dữ liệu câu</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / sentences.length) * 100);
    
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
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
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-background/80">
      {/* Header với progress */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-primary/10">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
            Câu {currentSentence + 1}/{sentences.length}
          </div>
          <div className="text-xs sm:text-sm font-medium flex items-center px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <Progress value={progress} className="h-1.5 sm:h-2 bg-secondary" />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-1">Sắp xếp lại từng từ để tạo thành câu hoàn chỉnh</h3>
            <p className="text-muted-foreground text-sm">Chọn từ theo đúng thứ tự</p>
          </div>
          
          <Card className="p-4 min-h-[100px] flex flex-wrap gap-2 items-start content-start border border-primary/30 bg-background/80">
            {orderedWords.map((word, index) => (
              <button
                key={`ordered-${index}`}
                onClick={() => handleWordRemove(word, index)}
                disabled={isChecking}
                className={`py-2 px-3 rounded-lg transition-colors ${
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
          
          <div className="p-4 bg-secondary/20 rounded-lg flex flex-wrap gap-2 border border-primary/10">
            {shuffledWords.map((word, index) => (
              <button
                key={`shuffled-${index}`}
                onClick={() => handleWordSelect(word, index)}
                disabled={isChecking}
                className="py-2 px-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer với controls */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-primary/10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleShuffleWords}
              disabled={isChecking || shuffledWords.length === 0}
              className="text-xs sm:text-sm"
            >
              <Shuffle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Xáo trộn
            </Button>
            
            {content?.settings?.showHints && (
              <Button
                variant="outline"
                onClick={handleHint}
                disabled={isChecking || hasShownHint}
                className={`text-xs sm:text-sm ${hasShownHint ? 'opacity-50' : ''}`}
              >
                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Gợi ý
              </Button>
            )}
            
            <Button
              onClick={handleCheck}
              disabled={orderedWords.length !== sentences[currentSentence].words.length || isChecking}
              className={`text-xs sm:text-sm ${orderedWords.length !== sentences[currentSentence].words.length ? 'opacity-50' : ''}`}
            >
              <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Kiểm tra
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRestart}
              className="text-xs sm:text-sm"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Làm lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderingTemplate;

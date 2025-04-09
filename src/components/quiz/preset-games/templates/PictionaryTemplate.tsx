
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ChevronRight, HelpCircle, Clock, Image } from 'lucide-react';
import { generatePlaceholderImage, handleImageError } from '../../generator/imageInstructions';

interface PictionaryTemplateProps {
  content: any;
  topic: string;
}

const PictionaryTemplate: React.FC<PictionaryTemplateProps> = ({ content, topic }) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(content?.settings?.timePerQuestion || 20);
  const [timerRunning, setTimerRunning] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const items = content?.items || [];
  const isLastItem = currentItem === items.length - 1;

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && timerRunning) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning) {
      handleNextItem();
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không trả lời kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, toast]);

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    setTimerRunning(false);
    
    if (option === items[currentItem].answer) {
      setScore(score + 1);
      toast({
        title: "Chính xác!",
        description: "Bạn đã đoán đúng hình ảnh.",
        variant: "default",
      });
    } else {
      toast({
        title: "Chưa chính xác!",
        description: `Đáp án đúng là: ${items[currentItem].answer}`,
        variant: "destructive",
      });
    }
  };

  const handleNextItem = () => {
    if (isLastItem) {
      setShowResult(true);
    } else {
      setCurrentItem(currentItem + 1);
      setSelectedOption(null);
      setShowHint(false);
      setTimeLeft(content?.settings?.timePerQuestion || 20);
      setTimerRunning(true);
      setImageLoaded(false);
      setImageError(false);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    // Penalty for using hint: reduce time
    setTimeLeft(Math.max(5, timeLeft - 5));
    toast({
      title: "Đã hiện gợi ý",
      description: "Thời gian đã bị giảm 5 giây.",
      variant: "default",
    });
  };

  const handleRestart = () => {
    setCurrentItem(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setShowHint(false);
    setTimeLeft(content?.settings?.timePerQuestion || 20);
    setTimerRunning(true);
    setImageLoaded(false);
    setImageError(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Custom error handler using the imported function
    setImageError(true);
    setImageLoaded(true);
    const img = e.currentTarget;
    const itemAnswer = items[currentItem]?.answer || topic;
    img.src = generatePlaceholderImage(600, 400, `${itemAnswer}`);
    img.alt = `Không thể tải hình ảnh: ${itemAnswer}`;
  };

  if (!content || !items.length) {
    return <div className="p-4">Không có dữ liệu hình ảnh</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / items.length) * 100);
    
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
            {score} / {items.length}
          </div>
          
          <Button onClick={handleRestart} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm lại
          </Button>
        </Card>
      </div>
    );
  }

  const item = items[currentItem];
  const progress = ((currentItem + 1) / items.length) * 100;
  const options = item.options || [];

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Header with progress and timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            Hình ảnh {currentItem + 1}/{items.length}
          </div>
          <div className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {timeLeft}s
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Image display */}
      <div className="flex-grow flex flex-col items-center justify-center mb-4">
        <div className="relative w-full max-w-md aspect-video mb-4 bg-secondary/30 rounded-lg overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Image className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Không thể tải hình ảnh</p>
            </div>
          ) : (
            <img 
              src={item.imageUrl} 
              alt={`Hình ảnh: ${item.answer}`}
              className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>
        
        {showHint && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg text-center max-w-md">
            <p className="font-medium">Gợi ý:</p>
            <p>{item.hint}</p>
          </div>
        )}
        
        {/* Options */}
        <div className="w-full max-w-md space-y-2">
          {options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full p-3 text-left rounded-lg transition-colors ${
                selectedOption === option 
                  ? selectedOption === item.answer
                    ? 'bg-green-100 border-green-500 border'
                    : 'bg-red-100 border-red-500 border'
                  : selectedOption !== null && option === item.answer
                    ? 'bg-green-100 border-green-500 border'
                    : 'bg-secondary hover:bg-secondary/80 border-transparent border'
              }`}
              disabled={selectedOption !== null}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-auto grid grid-cols-2 gap-2">
        {content?.settings?.showHints && !showHint && selectedOption === null && (
          <Button 
            variant="outline"
            onClick={handleShowHint}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Hiện gợi ý
          </Button>
        )}
        
        <Button 
          onClick={handleNextItem}
          className={showHint && selectedOption === null ? "col-span-1" : (selectedOption === null ? "col-span-2" : "col-span-2")}
          disabled={timerRunning && selectedOption === null && !isLastItem}
        >
          {isLastItem ? 'Xem kết quả' : 'Tiếp theo'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PictionaryTemplate;

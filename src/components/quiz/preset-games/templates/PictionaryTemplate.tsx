import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import GameHeader from '../../components/GameHeader';
import GameControls from '../../components/GameControls';
import { HelpCircle } from 'lucide-react';
import { generatePixabayImage, handleImageError, generatePlaceholderImage } from '../../generator/imageInstructions';
import PictionaryImage from './pictionary/PictionaryImage';
import PictionaryOptions from './pictionary/PictionaryOptions';
import PictionaryHint from './pictionary/PictionaryHint';
import PictionaryResult from './pictionary/PictionaryResult';

interface PictionaryTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
}

const PictionaryTemplate: React.FC<PictionaryTemplateProps> = ({ data, content, topic, onBack }) => {
  const gameContent = content || data;
  
  const [currentItem, setCurrentItem] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timePerQuestion || 20);
  const [timerRunning, setTimerRunning] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [processedItems, setProcessedItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  const rawItems = gameContent?.items || [];

  useEffect(() => {
    console.log("PictionaryTemplate - Game content:", gameContent);
    console.log("PictionaryTemplate - Raw items:", rawItems);
    
    const processItems = async () => {
      setIsProcessing(true);
      const processed = [...rawItems];
      
      for (let i = 0; i < processed.length; i++) {
        const item = processed[i];
        
        if (item.imageSearchTerm && !item.imageUrl) {
          try {
            item.imageUrl = await generatePixabayImage(item.imageSearchTerm);
          } catch (error) {
            console.error("Error fetching image:", error);
            item.imageUrl = generatePlaceholderImage(400, 300, item.answer || topic);
          }
        } else if (item.imageUrl && !item.imageUrl.includes('pixabay.com')) {
          try {
            const searchTerm = item.answer || topic;
            item.imageUrl = await generatePixabayImage(searchTerm);
          } catch (error) {
            console.error("Error replacing non-Pixabay image:", error);
            item.imageUrl = generatePlaceholderImage(400, 300, item.answer || topic);
          }
        } else if (!item.imageUrl) {
          item.imageUrl = generatePlaceholderImage(400, 300, item.answer || topic);
        }
      }
      
      setProcessedItems(processed);
      setIsProcessing(false);
    };
    
    processItems();
  }, [gameContent]);

  const items = processedItems;
  const isLastItem = currentItem === items.length - 1;

  useEffect(() => {
    if (timeLeft > 0 && timerRunning && !isProcessing) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning && !isProcessing) {
      handleNextItem();
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã không trả lời kịp thời.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, isProcessing, toast]);

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null || isProcessing) return;
    
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
      setTimeLeft(gameContent?.settings?.timePerQuestion || 20);
      setTimerRunning(true);
      setImageLoaded(false);
      setImageError(false);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
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
    setTimeLeft(gameContent?.settings?.timePerQuestion || 20);
    setTimerRunning(true);
    setImageLoaded(false);
    setImageError(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageErrorEvent = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    setImageLoaded(true);
    const img = e.currentTarget;
    const itemAnswer = items[currentItem]?.answer || topic;
    img.src = generatePlaceholderImage(600, 400, itemAnswer);
    img.alt = `Không thể tải hình ảnh: ${itemAnswer}`;
  };

  const handleShare = async () => {
    try {
      toast({
        title: "Chức năng chia sẻ",
        description: "Chức năng chia sẻ đang được phát triển.",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!gameContent || !items.length || isProcessing) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Đang tải hình ảnh từ Pixabay...</p>
          <p className="text-sm text-muted-foreground mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <PictionaryResult 
        score={score}
        totalItems={items.length}
        title={gameContent.title}
        topic={topic}
        onBack={onBack}
        onShare={handleShare}
        onRestart={handleRestart}
      />
    );
  }

  const item = items[currentItem];
  const progress = ((currentItem + 1) / items.length) * 100;

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      <GameHeader 
        onBack={onBack}
        progress={progress}
        timeLeft={timeLeft}
        score={score}
        currentItem={currentItem + 1}
        totalItems={items.length}
        onShare={handleShare}
      />

      <Card className="flex-grow p-6 mb-4 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
        <PictionaryImage 
          imageUrl={item.imageUrl}
          answer={item.answer}
          imageLoaded={imageLoaded}
          imageError={imageError}
          onLoad={handleImageLoad}
          onError={handleImageErrorEvent}
        />
        
        <PictionaryHint 
          hint={item.hint}
          show={showHint}
        />
        
        <PictionaryOptions 
          options={item.options}
          selectedOption={selectedOption}
          correctAnswer={item.answer}
          onSelect={handleOptionSelect}
        />
      </Card>

      <div className="flex gap-2">
        {gameContent?.settings?.showHints && !showHint && selectedOption === null && (
          <Button 
            variant="outline"
            onClick={handleShowHint}
            className="flex-1"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Gợi ý
          </Button>
        )}
        
        <GameControls 
          onRestart={handleRestart}
          onNext={handleNextItem}
          disabled={timerRunning && selectedOption === null && !isLastItem}
          isLastItem={isLastItem}
        />
      </div>
    </div>
  );
};

export default PictionaryTemplate;

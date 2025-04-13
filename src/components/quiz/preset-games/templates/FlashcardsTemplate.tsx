import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RefreshCw, Check, X, Clock, Shuffle, Share2, RotateCw, ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { saveGameForSharing } from '@/services/storage';

interface FlashcardsTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ content, topic, onBack }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsState, setCardsState] = useState<Array<'unreviewed' | 'known' | 'unknown'>>([]);
  const [autoFlip, setAutoFlip] = useState(content?.settings?.autoFlip || false);
  const [flipTimer, setFlipTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();

  const cards = content?.cards || [];
  const progress = ((currentCard + 1) / cards.length) * 100;
  const flipTime = content?.settings?.flipTime || 5;

  useEffect(() => {
    if (cards.length > 0) {
      setCardsState(new Array(cards.length).fill('unreviewed'));
    }
  }, [cards.length]);

  useEffect(() => {
    if (autoFlip && !isFlipped) {
      setTimeRemaining(flipTime);
      const countdownTimer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const timer = setTimeout(() => {
        setIsFlipped(true);
        clearInterval(countdownTimer);
      }, flipTime * 1000);
      
      setFlipTimer(timer);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }

    return () => {
      if (flipTimer) clearTimeout(flipTimer);
    };
  }, [currentCard, isFlipped, autoFlip, flipTime]);

  const handleFlip = () => {
    if (flipTimer) {
      clearTimeout(flipTimer);
    }
    setIsFlipped(!isFlipped);
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const handleNextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handleMarkCard = (status: 'known' | 'unknown') => {
    const newCardsState = [...cardsState];
    newCardsState[currentCard] = status;
    setCardsState(newCardsState);
    
    if (status === 'known') {
      toast({
        title: "Đã thuộc!",
        description: "Đã đánh dấu thẻ này là đã thuộc.",
        variant: "default",
      });
    } else {
      toast({
        title: "Chưa thuộc!",
        description: "Đã đánh dấu thẻ này là chưa thuộc.",
        variant: "destructive",
      });
    }
    
    if (currentCard < cards.length - 1) {
      handleNextCard();
    }
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setCardsState(new Array(cards.length).fill('unreviewed'));
    toast({
      title: "Làm lại từ đầu",
      description: "Đã đặt lại tất cả thẻ ghi nhớ.",
      variant: "default",
    });
  };

  const toggleAutoFlip = () => {
    setAutoFlip(!autoFlip);
    toast({
      title: autoFlip ? "Đã tắt tự động lật" : "Đã bật tự động lật",
      description: autoFlip ? "Thẻ sẽ không tự động lật." : `Thẻ sẽ tự động lật sau ${flipTime} giây.`,
      variant: "default",
    });
  };

  const handleShare = async () => {
    try {
      const gameContent = `
        <html>
        <head>
          <title>${content.title || "Thẻ ghi nhớ"}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f5f7ff; }
            .container { max-width: 800px; margin: 0 auto; }
            .game-title { text-align: center; margin-bottom: 20px; }
            .card-container { perspective: 1000px; margin-bottom: 20px; min-height: 300px; }
            .card { position: relative; width: 100%; height: 100%; min-height: 300px; transition: transform 0.6s; transform-style: preserve-3d; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .card.flipped { transform: rotateY(180deg); }
            .card-front, .card-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; border-radius: 10px; padding: 20px; box-sizing: border-box; }
            .card-front { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 24px; font-weight: bold; }
            .card-back { background: white; color: #333; transform: rotateY(180deg); font-size: 18px; text-align: center; }
            .controls { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; }
            .button { padding: 10px 15px; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .button:disabled { opacity: 0.5; cursor: not-allowed; }
            .progress { height: 4px; background: #e2e8f0; margin-bottom: 15px; border-radius: 2px; overflow: hidden; }
            .progress-bar { height: 100%; background: #6366f1; transition: width 0.3s; }
            .indicator { text-align: center; margin-bottom: 10px; font-size: 14px; color: #6b7280; }
            .card-count { text-align: center; margin-bottom: 10px; font-size: 14px; color: #6b7280; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="game-title">${content.title || "Thẻ ghi nhớ"}</h2>
            
            <div class="progress">
              <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
            </div>
            
            <div class="card-count">
              Thẻ <span id="current-card">1</span> / <span id="total-cards">${cards.length}</span>
            </div>
            
            <div class="card-container">
              <div class="card" id="flashcard">
                <div class="card-front" id="card-front"></div>
                <div class="card-back" id="card-back"></div>
              </div>
            </div>
            
            <div class="controls">
              <button class="button" id="prev-btn" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Trước
              </button>
              
              <button class="button" id="flip-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z"/><path d="m17 12-6 6"/><path d="m11 18-6-6"/><path d="m7 12 10-5"/><path d="m17 7-3.5 1.5"/><path d="M7 12 5 7"/></svg>
                Lật
              </button>
              
              <button class="button" id="next-btn">
                Tiếp
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
            
            <div class="footer">
              <div>Thẻ ghi nhớ - Chia sẻ bởi QuizWhiz</div>
            </div>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const cards = ${JSON.stringify(cards)};
              let currentIndex = 0;
              
              const flashcard = document.getElementById('flashcard');
              const cardFront = document.getElementById('card-front');
              const cardBack = document.getElementById('card-back');
              const prevBtn = document.getElementById('prev-btn');
              const nextBtn = document.getElementById('next-btn');
              const flipBtn = document.getElementById('flip-btn');
              const progressBar = document.getElementById('progress-bar');
              const currentCardElem = document.getElementById('current-card');
              const totalCardsElem = document.getElementById('total-cards');
              
              // Set initial card content
              updateCard();
              updateProgress();
              
              // Event listeners
              flipBtn.addEventListener('click', function() {
                flashcard.classList.toggle('flipped');
              });
              
              prevBtn.addEventListener('click', function() {
                if (currentIndex > 0) {
                  currentIndex--;
                  flashcard.classList.remove('flipped');
                  updateCard();
                  updateProgress();
                }
              });
              
              nextBtn.addEventListener('click', function() {
                if (currentIndex < cards.length - 1) {
                  currentIndex++;
                  flashcard.classList.remove('flipped');
                  updateCard();
                  updateProgress();
                }
              });
              
              function updateCard() {
                cardFront.textContent = cards[currentIndex].front;
                cardBack.textContent = cards[currentIndex].back;
                currentCardElem.textContent = (currentIndex + 1).toString();
                
                // Update button states
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === cards.length - 1;
              }
              
              function updateProgress() {
                const progressPercent = ((currentIndex + 1) / cards.length) * 100;
                progressBar.style.width = \`\${progressPercent}%\`;
              }
            });
          </script>
        </body>
        </html>
      `;
      
      const shareUrl = await saveGameForSharing(
        content.title || `Thẻ ghi nhớ - ${topic}`,
        `Thẻ ghi nhớ với chủ đề "${topic}". Bật/tắt các thẻ để học.`,
        gameContent
      );
      
      if (shareUrl) {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Đã chia sẻ!",
          description: "Liên kết đã được sao chép vào clipboard.",
          variant: "default",
        });
      } else {
        throw new Error("Không thể tạo liên kết chia sẻ");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ thẻ ghi nhớ:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể chia sẻ thẻ ghi nhớ. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  if (!content || !cards.length) {
    return <div className="p-4">Không có dữ liệu thẻ ghi nhớ</div>;
  }

  const stats = {
    known: cardsState.filter(state => state === 'known').length,
    unknown: cardsState.filter(state => state === 'unknown').length,
    unreviewed: cardsState.filter(state => state === 'unreviewed').length
  };

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80 relative">
      {onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      )}

      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
            Thẻ {currentCard + 1}/{cards.length}
          </div>
          <div className="text-sm font-medium flex space-x-3">
            <span className="px-3 py-1 bg-green-100/30 text-green-600 rounded-full">Đã thuộc: {stats.known}</span>
            <span className="px-3 py-1 bg-red-100/30 text-red-600 rounded-full">Chưa thuộc: {stats.unknown}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>

      <div className="flex-grow flex items-center justify-center mb-4 perspective-1000">
        <div 
          className="w-full max-w-md aspect-[3/2] cursor-pointer relative group"
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <Card 
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-2 border-primary/20 shadow-lg group-hover:shadow-xl transition-all duration-300"
            style={{
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Nhấn để lật thẻ
                {autoFlip && !isFlipped && (
                  <div className="mt-1 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1 text-primary/60" />
                    <span>Tự động lật sau {timeRemaining}s</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-primary/90">{cards[currentCard].front}</div>
            </div>
          </Card>
          
          <Card 
            className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/30 shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mặt sau</div>
              <div className="text-2xl text-primary/90">{cards[currentCard].back}</div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-background/40 p-3 rounded-lg backdrop-blur-sm border border-primary/10 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={handlePrevCard}
            disabled={currentCard === 0}
            className="bg-background/70 border-primary/20"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Trước
          </Button>
          
          <Button
            variant="outline"
            onClick={handleFlip}
            className="col-span-2 bg-background/70 border-primary/20"
            size="sm"
          >
            {isFlipped ? "Xem mặt trước" : "Lật thẻ"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextCard}
            disabled={currentCard === cards.length - 1}
            className="bg-background/70 border-primary/20"
            size="sm"
          >
            Tiếp
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex gap-2 justify-between">
          <Button
            variant={autoFlip ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${autoFlip ? 'bg-primary/90' : 'bg-background/70 border-primary/20'}`}
            onClick={toggleAutoFlip}
          >
            <Clock className="h-4 w-4 mr-1" />
            {autoFlip ? "Tắt lật tự động" : "Bật lật tự động"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="bg-background/70 border-primary/20 flex-1"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Chia sẻ
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="bg-background/70 border-primary/20"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Làm lại
          </Button>
          
          <ToggleGroup type="single" variant="outline" className="grid grid-cols-2">
            <ToggleGroupItem
              value="unknown"
              onClick={() => handleMarkCard('unknown')}
              className="border border-red-300 text-red-600 data-[state=on]:bg-red-100 data-[state=on]:text-red-700"
            >
              <X className="mr-2 h-4 w-4" />
              Chưa thuộc
            </ToggleGroupItem>
            
            <ToggleGroupItem
              value="known"
              onClick={() => handleMarkCard('known')}
              className="border border-green-300 text-green-600 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Đã thuộc
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsTemplate;

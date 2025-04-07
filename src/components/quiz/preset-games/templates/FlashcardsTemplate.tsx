
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, RotateCw, RefreshCw } from 'lucide-react';
import { animateBlockCreation } from '@/lib/animations';

interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

interface FlashcardsTemplateProps {
  content: Flashcard[];
  topic: string;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ content, topic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState<number[]>([]);
  const [autoPlayActive, setAutoPlayActive] = useState(false);
  const [cardsMarkedKnown, setCardsMarkedKnown] = useState<number[]>([]);

  useEffect(() => {
    // Reset when content changes
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setCardsReviewed([]);
    setAutoPlayActive(false);
    setCardsMarkedKnown([]);
  }, [content]);

  useEffect(() => {
    // Track cards that have been viewed
    if (!cardsReviewed.includes(currentIndex)) {
      setCardsReviewed(prev => [...prev, currentIndex]);
    }
  }, [currentIndex, cardsReviewed]);

  // Auto-play functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoPlayActive) {
      timer = setTimeout(() => {
        if (!isFlipped) {
          setIsFlipped(true);
        } else {
          goToNextCard();
        }
      }, 3000);
    }
    
    return () => clearTimeout(timer);
  }, [autoPlayActive, currentIndex, isFlipped]);

  // Apply animations
  useEffect(() => {
    const flashcard = document.querySelector('.flashcard');
    if (flashcard instanceof HTMLElement) {
      animateBlockCreation(flashcard);
    }
  }, [currentIndex, isFlipped]);

  const goToNextCard = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowHint(false);
    } else {
      // Reached the end, could show completion or loop back
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const goToPrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const toggleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const toggleAutoPlay = () => {
    setAutoPlayActive(!autoPlayActive);
  };

  const toggleCardKnown = () => {
    if (cardsMarkedKnown.includes(currentIndex)) {
      setCardsMarkedKnown(prev => prev.filter(idx => idx !== currentIndex));
    } else {
      setCardsMarkedKnown(prev => [...prev, currentIndex]);
    }
  };

  const resetAll = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setCardsReviewed([]);
    setCardsMarkedKnown([]);
    setAutoPlayActive(false);
  };

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Không có nội dung</h3>
          <p className="text-gray-500">Không tìm thấy thẻ học tập cho trò chơi này.</p>
        </div>
      </div>
    );
  }

  const currentCard = content[currentIndex];
  const progress = ((currentIndex + 1) / content.length) * 100;
  const cardKnown = cardsMarkedKnown.includes(currentIndex);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetAll}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Bắt đầu lại
          </Button>
          
          <Button 
            variant={autoPlayActive ? "default" : "outline"} 
            size="sm" 
            onClick={toggleAutoPlay}
          >
            {autoPlayActive ? 'Dừng tự động' : 'Tự động lật'}
          </Button>
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Thẻ:</span> {currentIndex + 1}/{content.length}
          <span className="ml-3 font-medium">Đã xem:</span> {cardsReviewed.length}/{content.length}
          <span className="ml-3 font-medium">Đã thuộc:</span> {cardsMarkedKnown.length}/{content.length}
        </div>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="flashcard w-full max-w-xl perspective-1000 mb-6 relative">
          <div className={`
            relative w-full rounded-xl shadow-lg transition-transform duration-500 transform-style-3d h-80
            ${isFlipped ? 'rotate-y-180' : ''}
            ${cardKnown ? 'border-2 border-green-500' : 'border border-border'}
          `}>
            {/* Front */}
            <div 
              className="absolute w-full h-full p-8 backface-hidden flex flex-col items-center justify-center bg-card rounded-xl"
              onClick={toggleCardFlip}
            >
              <h3 className="text-xl font-bold mb-4 text-center">{currentCard.front}</h3>
              
              {currentCard.hint && (
                <div className="mt-4 w-full">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHint();
                    }}
                    className="text-sm text-muted-foreground"
                  >
                    {showHint ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
                  </Button>
                  
                  {showHint && (
                    <div className="mt-2 p-3 bg-muted/30 rounded-md text-sm animate-fade-in">
                      {currentCard.hint}
                    </div>
                  )}
                </div>
              )}
              
              <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
                Nhấn vào thẻ để xem đáp án
              </div>
            </div>
            
            {/* Back */}
            <div 
              className="absolute w-full h-full p-8 backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-card rounded-xl"
              onClick={toggleCardFlip}
            >
              <div className="text-xl text-center">{currentCard.back}</div>
              
              <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
                Nhấn để xem mặt trước
              </div>
            </div>
          </div>
          
          {/* "Known" badge */}
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-full p-2 ${cardKnown ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleCardKnown();
              }}
            >
              {cardKnown ? '✓' : '?'}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button 
            onClick={goToPrevCard} 
            disabled={currentIndex === 0} 
            variant="outline"
            size="lg"
            className="w-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            onClick={toggleCardFlip} 
            variant="outline"
            size="lg"
            className="w-20"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={goToNextCard} 
            variant="outline"
            size="lg"
            className="w-20"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Add necessary styles for 3D card effect (if not already added)
const style = document.createElement('style');
style.textContent = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;
document.head.appendChild(style);

export default FlashcardsTemplate;

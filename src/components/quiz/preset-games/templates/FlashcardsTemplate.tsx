
import React from 'react';
import FlashcardsHeader from './flashcards/FlashcardsHeader';
import FlashcardsCard from './flashcards/FlashcardsCard';
import FlashcardsFooter from './flashcards/FlashcardsFooter';
import { useFlashcards } from './flashcards/useFlashcards';

interface FlashcardsTemplateProps {
  content: any;
  topic: string;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({
  content,
  topic
}) => {
  const cards = content?.cards || [];
  
  const {
    currentCard,
    isFlipped,
    autoFlip,
    timeRemaining,
    stats,
    handleFlip,
    handlePrevCard,
    handleNextCard,
    handleMarkCard,
    handleRestart,
    toggleAutoFlip
  } = useFlashcards({ cards, settings: content?.settings });

  if (!content || !cards.length) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Không có dữ liệu thẻ ghi nhớ</p>
          <p className="text-sm text-muted-foreground mt-2">Vui lòng thử lại hoặc chọn game khác</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-background max-w-4xl mx-auto">
      <FlashcardsHeader
        currentCard={currentCard}
        totalCards={cards.length}
        stats={stats}
      />

      <div className="flex-1 min-h-0 flex items-center justify-center pb-20 sm:pb-16">
        <FlashcardsCard
          card={cards[currentCard]}
          isFlipped={isFlipped}
          autoFlip={autoFlip}
          timeRemaining={timeRemaining}
          onFlip={handleFlip}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <FlashcardsFooter
          currentCard={currentCard}
          totalCards={cards.length}
          isFlipped={isFlipped}
          autoFlip={autoFlip}
          onPrevCard={handlePrevCard}
          onNextCard={handleNextCard}
          onFlip={handleFlip}
          onToggleAutoFlip={toggleAutoFlip}
          onRestart={handleRestart}
          onMarkCard={handleMarkCard}
        />
      </div>
    </div>
  );
};

export default FlashcardsTemplate;


import React from 'react';
import FlashcardsHeader from './flashcards/FlashcardsHeader';
import FlashcardsCard from './flashcards/FlashcardsCard';
import FlashcardsFooter from './flashcards/FlashcardsFooter';
import { useFlashcards } from './flashcards/useFlashcards';
import { useIsMobile } from '@/hooks/use-mobile';

interface FlashcardsTemplateProps {
  content: any;
  topic: string;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({
  content,
  topic
}) => {
  const cards = content?.cards || [];
  const isMobile = useIsMobile();
  
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
    return <div className="p-4">Không có dữ liệu thẻ ghi nhớ</div>;
  }

  return (
    <div 
      className="flex flex-col overflow-hidden"
      style={{ 
        height: isMobile ? '100dvh' : '100vh',
        maxHeight: isMobile ? '100dvh' : '100vh'
      }}
    >
      <FlashcardsHeader
        currentCard={currentCard}
        totalCards={cards.length}
        stats={stats}
      />

      <FlashcardsCard
        card={cards[currentCard]}
        isFlipped={isFlipped}
        autoFlip={autoFlip}
        timeRemaining={timeRemaining}
        onFlip={handleFlip}
      />

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
  );
};

export default FlashcardsTemplate;

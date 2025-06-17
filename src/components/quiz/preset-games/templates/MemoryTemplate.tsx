
import React from 'react';
import MemoryHeader from './memory/MemoryHeader';
import MemoryGameArea from './memory/MemoryGameArea';
import MemoryFooter from './memory/MemoryFooter';
import MemoryGameEnd from './memory/MemoryGameEnd';
import { useMemoryGame } from './memory/useMemoryGame';
import { useIsMobile } from '@/hooks/use-mobile';

interface MemoryTemplateProps {
  content: any;
  topic: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ content, topic }) => {
  const memoryCards = content?.cards || [];
  const timeLimit = content?.settings?.timeLimit || 120;
  const allowHints = content?.settings?.allowHints;
  const isMobile = useIsMobile();

  const {
    cards,
    matchedPairs,
    totalPairs,
    moves,
    timeLeft,
    gameOver,
    gameWon,
    canFlip,
    handleCardClick,
    handleHint,
    handleRestart
  } = useMemoryGame({ memoryCards, timeLimit });

  if (!content || !memoryCards.length) {
    return <div className="p-4">Không có dữ liệu trò chơi ghi nhớ</div>;
  }

  return (
    <div 
      className="flex flex-col overflow-hidden"
      style={{ 
        height: isMobile ? '100dvh' : '100vh',
        maxHeight: isMobile ? '100dvh' : '100vh'
      }}
    >
      <MemoryHeader
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        moves={moves}
        timeLeft={timeLeft}
      />

      <MemoryGameEnd
        gameWon={gameWon}
        gameOver={gameOver}
        moves={moves}
        timeLeft={timeLeft}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        onRestart={handleRestart}
      />

      {!gameWon && !gameOver && (
        <>
          <MemoryGameArea
            cards={cards}
            canFlip={canFlip}
            onCardClick={handleCardClick}
          />
          
          <MemoryFooter
            allowHints={allowHints}
            onHint={handleHint}
            onRestart={handleRestart}
          />
        </>
      )}
    </div>
  );
};

export default MemoryTemplate;

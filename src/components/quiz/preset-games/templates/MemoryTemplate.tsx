
import React from 'react';
import MemoryHeader from './memory/MemoryHeader';
import MemoryGameArea from './memory/MemoryGameArea';
import MemoryFooter from './memory/MemoryFooter';
import MemoryGameEnd from './memory/MemoryGameEnd';
import { useMemoryGame } from './memory/useMemoryGame';

interface MemoryTemplateProps {
  content: any;
  topic: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ content, topic }) => {
  const memoryCards = content?.cards || [];
  const timeLimit = content?.settings?.timeLimit || 120;
  const allowHints = content?.settings?.allowHints;

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
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Không có dữ liệu trò chơi ghi nhớ</p>
          <p className="text-sm text-muted-foreground mt-2">Vui lòng thử lại hoặc chọn game khác</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <MemoryHeader
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        moves={moves}
        timeLeft={timeLeft}
      />

      <div className="flex-1 min-h-0 flex items-center justify-center">
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
          <MemoryGameArea
            cards={cards}
            canFlip={canFlip}
            onCardClick={handleCardClick}
          />
        )}
      </div>

      {!gameWon && !gameOver && (
        <MemoryFooter
          allowHints={allowHints}
          onHint={handleHint}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default MemoryTemplate;

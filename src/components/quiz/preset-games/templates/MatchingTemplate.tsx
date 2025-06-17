
import React from 'react';
import { useMatchingGame } from './matching/useMatchingGame';
import MatchingHeader from './matching/MatchingHeader';
import MatchingGameArea from './matching/MatchingGameArea';
import MatchingFooter from './matching/MatchingFooter';
import MatchingGameEnd from './matching/MatchingGameEnd';
import { useIsMobile } from '@/hooks/use-mobile';

interface MatchingTemplateProps {
  content: any;
  topic: string;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic }) => {
  const pairs = content?.pairs || [];
  const difficulty = content?.settings?.difficulty || "medium";
  const timeLimit = content?.settings?.timeLimit || 60;
  const isMobile = useIsMobile();

  const {
    leftItems,
    rightItems,
    selectedLeft,
    selectedRight,
    matchedPairs,
    timeLeft,
    gameOver,
    gameWon,
    score,
    totalPairs,
    handleLeftItemClick,
    handleRightItemClick,
    handleRestart
  } = useMatchingGame({ pairs, timeLimit, difficulty });

  if (!content || !pairs.length) {
    return <div className="p-4">Không có dữ liệu trò chơi nối từ</div>;
  }

  return (
    <div 
      className="flex flex-col overflow-hidden"
      style={{ 
        height: isMobile ? '100dvh' : '100vh',
        maxHeight: isMobile ? '100dvh' : '100vh'
      }}
    >
      <MatchingHeader
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        score={score}
        timeLeft={timeLeft}
      />

      <MatchingGameEnd
        gameWon={gameWon}
        gameOver={gameOver}
        totalPairs={totalPairs}
        matchedPairs={matchedPairs}
        score={score}
        timeLeft={timeLeft}
        onRestart={handleRestart}
      />

      {!gameWon && !gameOver && (
        <>
          <MatchingGameArea
            leftItems={leftItems}
            rightItems={rightItems}
            selectedLeft={selectedLeft}
            selectedRight={selectedRight}
            onLeftItemClick={handleLeftItemClick}
            onRightItemClick={handleRightItemClick}
            difficulty={difficulty}
            gameOver={gameOver}
            gameWon={gameWon}
          />

          <MatchingFooter onRestart={handleRestart} />
        </>
      )}
    </div>
  );
};

export default MatchingTemplate;

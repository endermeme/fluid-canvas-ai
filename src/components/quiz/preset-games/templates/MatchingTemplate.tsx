
import React from 'react';
import { useMatchingGame } from './matching/useMatchingGame';
import MatchingHeader from './matching/MatchingHeader';
import MatchingGameArea from './matching/MatchingGameArea';
import MatchingFooter from './matching/MatchingFooter';
import MatchingGameEnd from './matching/MatchingGameEnd';

interface MatchingTemplateProps {
  content: any;
  topic: string;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic }) => {
  const pairs = content?.pairs || [];
  const difficulty = content?.settings?.difficulty || "medium";
  const timeLimit = content?.settings?.timeLimit || 60;

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
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Không có dữ liệu trò chơi nối từ</p>
          <p className="text-sm text-muted-foreground mt-2">Vui lòng thử lại hoặc chọn game khác</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col max-w-4xl mx-auto">
      <MatchingHeader
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        score={score}
        timeLeft={timeLeft}
      />

      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
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
        )}
      </div>

      {!gameWon && !gameOver && (
        <MatchingFooter onRestart={handleRestart} />
      )}
    </div>
  );
};

export default MatchingTemplate;

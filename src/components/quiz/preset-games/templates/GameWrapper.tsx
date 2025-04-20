
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameHeader from '../../components/GameHeader';

interface GameWrapperProps {
  children: React.ReactNode;
  progress: number;
  timeLeft?: number;
  score?: number;
  currentItem: number;
  totalItems: number;
  title?: string;
  onShare?: () => Promise<void>;
  onBack?: () => void;
  onRefresh?: () => void;
}

/**
 * GameWrapper là component chung để bọc tất cả các game templates,
 * giúp tách biệt logic header với nội dung game
 */
const GameWrapper: React.FC<GameWrapperProps> = ({
  children,
  progress,
  timeLeft,
  score,
  currentItem,
  totalItems,
  title,
  onShare,
  onBack,
  onRefresh
}) => {
  const navigate = useNavigate();

  // Xử lý quay lại mặc định nếu không có callback onBack riêng
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/preset-games');
    }
  };

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      <GameHeader 
        onBack={handleBack}
        progress={progress}
        timeLeft={timeLeft}
        score={score}
        currentItem={currentItem}
        totalItems={totalItems}
        title={title}
        onShare={onShare}
        onRefresh={onRefresh}
      />
      
      <div className="flex-grow flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default GameWrapper;

import React from 'react';
import CustomGameView from './ui/CustomGameView';

interface CustomGameReceiverProps {
  game: {
    title?: string;
    content: string;
    gameType?: string;
    data?: any;
  };
}

const CustomGameReceiver: React.FC<CustomGameReceiverProps> = ({ game }) => {
  const miniGame = {
    title: game?.title || 'Game tương tác',
    content: game?.content || '',
    gameType: game?.gameType,
    data: game?.data
  };

  return (
    <div className="min-h-screen">
      <CustomGameView
        miniGame={miniGame}
        hideHeader={false}
      />
    </div>
  );
};

export default CustomGameReceiver;
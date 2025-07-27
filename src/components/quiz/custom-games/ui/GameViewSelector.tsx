import React from 'react';
import CustomGameView from './CustomGameView';
import PresetGameView from './PresetGameView';

interface GameViewSelectorProps {
  miniGame: {
    title?: string;
    content: string;
    gameType?: string;
    data?: any;
  };
  onReload?: () => void;
  className?: string;
  onBack?: () => void;
  hideHeader?: boolean;
  onShare?: () => Promise<string>;
  onNewGame?: () => void;
  extraButton?: React.ReactNode;
  isTeacher?: boolean;
  gameExpired?: boolean;
  gameId?: string;
  playerName?: string | null;
}

const GameViewSelector: React.FC<GameViewSelectorProps> = (props) => {
  const { miniGame } = props;

  // Check if this is a preset game (has structured data)
  const isPresetGame = miniGame.data && miniGame.gameType && 
                      (miniGame.data.questions || miniGame.data.cards || miniGame.data.items || miniGame.data.pairs);

  if (isPresetGame) {
    return <PresetGameView {...props} />;
  }

  // Otherwise, use CustomGameView for iframe-based games
  return <CustomGameView {...props} />;
};

export default GameViewSelector;

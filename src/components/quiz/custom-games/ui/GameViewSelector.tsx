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
}

const GameViewSelector: React.FC<GameViewSelectorProps> = (props) => {
  const { miniGame } = props;

  // Check if this is a preset game
  const isPresetGame = miniGame.content && (() => {
    try {
      const parsed = JSON.parse(miniGame.content);
      return parsed.type === "preset-game";
    } catch {
      return false;
    }
  })();

  // If it's a preset game, parse the data and use PresetGameView
  if (isPresetGame && miniGame.gameType && miniGame.data) {
    return <PresetGameView {...props} />;
  }

  // Otherwise, use CustomGameView for iframe-based games
  return <CustomGameView {...props} />;
};

export default GameViewSelector;

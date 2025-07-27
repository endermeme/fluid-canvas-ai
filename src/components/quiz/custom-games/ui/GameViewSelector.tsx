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

  // Check if this is a preset game stored in custom_games table
  const isPresetGame = (() => {
    // First check if content is JSON
    if (miniGame.content && miniGame.content.startsWith('{')) {
      try {
        const parsed = JSON.parse(miniGame.content);
        return parsed.type === "preset-game";
      } catch {
        return false;
      }
    }
    return false;
  })();

  // If it's a preset game, extract data from content and use PresetGameView
  if (isPresetGame) {
    let gameData = null;
    let gameType = null;
    
    try {
      const parsed = JSON.parse(miniGame.content);
      gameData = parsed.data;
      gameType = parsed.gameType || miniGame.gameType;
    } catch (e) {
      console.error('Error parsing preset game JSON:', e);
      return <CustomGameView {...props} />;
    }

    // Create updated miniGame object with extracted data
    const updatedMiniGame = {
      ...miniGame,
      data: gameData,
      gameType: gameType
    };

    return <PresetGameView {...props} miniGame={updatedMiniGame} />;
  }

  // Otherwise, use CustomGameView for iframe-based games
  return <CustomGameView {...props} />;
};

export default GameViewSelector;

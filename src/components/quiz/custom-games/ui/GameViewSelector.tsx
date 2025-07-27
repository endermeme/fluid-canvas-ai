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

  console.log('🎮 [GameViewSelector] miniGame:', miniGame);
  console.log('🎮 [GameViewSelector] has data:', !!miniGame.data);
  console.log('🎮 [GameViewSelector] gameType:', miniGame.gameType);
  if (miniGame.data) {
    console.log('🎮 [GameViewSelector] data structure:', {
      hasQuestions: !!miniGame.data.questions,
      hasCards: !!miniGame.data.cards,
      hasItems: !!miniGame.data.items,
      hasPairs: !!miniGame.data.pairs,
      dataKeys: Object.keys(miniGame.data)
    });
  }

  // Enhanced detection logic for preset games
  const isPresetGame = (
    // Check if has data property and gameType
    miniGame.data && miniGame.gameType && 
    // Check for various preset game data structures
    (miniGame.data.questions || miniGame.data.cards || miniGame.data.items || miniGame.data.pairs)
  ) || (
    // Fallback: check if gameType indicates a preset game
    miniGame.gameType && ['quiz', 'flashcards', 'matching', 'memory', 'ordering', 'truefalse', 'wordsearch'].includes(miniGame.gameType)
  );

  console.log('🎮 [GameViewSelector] isPresetGame:', isPresetGame);

  if (isPresetGame) {
    console.log('🎮 [GameViewSelector] Using PresetGameView');
    return <PresetGameView {...props} />;
  }

  // Otherwise, use CustomGameView for iframe-based games
  console.log('🎮 [GameViewSelector] Using CustomGameView');
  return <CustomGameView {...props} />;
};

export default GameViewSelector;

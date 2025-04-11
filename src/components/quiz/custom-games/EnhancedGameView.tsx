
import React from 'react';
import { MiniGame } from '../generator/AIGameGenerator';
import GameView from '../GameView';
import CustomGameContainer from './CustomGameContainer';

interface EnhancedGameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
  onNewGame?: () => void;
  extraButton?: React.ReactNode;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onBack, 
  onNewGame,
  extraButton 
}) => {
  // Improved detection for HTML/JS content
  const isHtmlJsContent = 
    miniGame.content.includes('<html>') || 
    miniGame.content.includes('<script>') || 
    miniGame.content.includes('<body>') ||
    miniGame.content.includes('document.') ||
    miniGame.content.includes('window.') ||
    miniGame.content.includes('<canvas>') ||
    miniGame.content.includes('function(') ||
    miniGame.content.includes('addEventListener');

  if (isHtmlJsContent) {
    return (
      <CustomGameContainer 
        title={miniGame.title || "Trò Chơi Tương Tác"}
        content={miniGame.content}
        onBack={onBack}
        onNewGame={onNewGame}
      />
    );
  }

  // For non-HTML/JS content, use the standard GameView
  return (
    <GameView 
      miniGame={miniGame} 
      onBack={onBack}
      extraButton={extraButton}
    />
  );
};

export default EnhancedGameView;

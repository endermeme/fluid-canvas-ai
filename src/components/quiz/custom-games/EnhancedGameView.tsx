
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
  // Check if the content is HTML/JS
  const isHtmlJsContent = miniGame.content.includes('<html>') || 
                          miniGame.content.includes('<script>') || 
                          miniGame.content.includes('<body>');

  if (isHtmlJsContent) {
    return (
      <CustomGameContainer 
        title={miniGame.title || "Trò Chơi Tùy Chỉnh"}
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

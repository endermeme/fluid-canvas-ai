
import React from 'react';
import gameTemplates from '../templates';

interface GameContentRendererProps {
  gameType: string;
  gameContent: any;
  onBack: () => void;
  initialTopic: string;
}

const GameContentRenderer: React.FC<GameContentRendererProps> = ({ 
  gameType, 
  gameContent, 
  onBack, 
  initialTopic 
}) => {
  const GameTemplate = gameTemplates[gameType];

  if (!GameTemplate) {
    return <div>Game type not supported</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <GameTemplate 
        data={gameContent} 
        onBack={onBack}
        topic={initialTopic || ""}
        content={gameContent}
      />
    </div>
  );
};

export default GameContentRenderer;

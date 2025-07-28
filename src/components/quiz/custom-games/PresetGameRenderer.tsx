import React from 'react';
import gameTemplates from '../preset-games/templates';

interface PresetGameRendererProps {
  gameType: string;
  data: any;
  onBack?: () => void;
}

const PresetGameRenderer: React.FC<PresetGameRendererProps> = ({ 
  gameType, 
  data, 
  onBack
}) => {
  const GameTemplate = gameTemplates[gameType];

  if (!GameTemplate) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Game không hỗ trợ</h3>
          <p className="text-muted-foreground">Loại game "{gameType}" không được hỗ trợ.</p>
        </div>
      </div>
    );
  }

  return (
    <GameTemplate 
      data={data} 
      content={data}
      topic={data?.title || ''}
      settings={data?.settings || {}}
      onBack={onBack}
    />
  );
};

export default PresetGameRenderer;
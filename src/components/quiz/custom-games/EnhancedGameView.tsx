
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EnhancedGameViewProps {
  miniGame: {
    title: string;
    content: string;
  };
  onBack: () => void;
  extraButton?: React.ReactNode;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({
  miniGame,
  onBack,
  extraButton
}) => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h2 className="text-lg font-medium">{miniGame.title}</h2>
        </div>
        {extraButton}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <iframe
          srcDoc={miniGame.content}
          title={miniGame.title}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-forms allow-same-origin"
        />
      </div>
    </div>
  );
};

export default EnhancedGameView;

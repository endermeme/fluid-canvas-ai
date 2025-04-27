
import React from 'react';
import { Button } from '@/components/ui/button';

interface MiniGame {
  title: string;
  content: string;
}

interface EnhancedGameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
  hideHeader?: boolean;
  extraButton?: React.ReactNode;
  gameExpired?: boolean;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({
  miniGame,
  onBack,
  hideHeader = false,
  extraButton,
  gameExpired = false
}) => {
  if (gameExpired) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Game đã hết hạn</h2>
          <p className="text-muted-foreground mb-4">
            Game này đã hết hạn hoặc không còn khả dụng.
          </p>
          {onBack && (
            <Button onClick={onBack}>Quay lại</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {!hideHeader && (
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <h2 className="font-medium">{miniGame.title || 'Game tương tác'}</h2>
          <div className="flex gap-2">
            {extraButton}
            {onBack && (
              <Button size="sm" variant="outline" onClick={onBack}>
                Quay lại
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-auto p-4">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="max-w-md w-full p-6 bg-card border rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-center">{miniGame.title}</h3>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                {miniGame.content ? (
                  <div dangerouslySetInnerHTML={{ __html: miniGame.content }} />
                ) : (
                  'Không có nội dung game.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGameView;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface GameLoadingProps {
  topic?: string;
  message?: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ 
  topic, 
  message = "Đang tạo trò chơi..." 
}) => {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">{message}</h3>
              {topic && (
                <p className="text-sm text-muted-foreground">
                  Chủ đề: <span className="font-medium">{topic}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Quá trình này có thể mất 2-3 phút...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameLoading;

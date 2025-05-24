
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GameContainerProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  title?: string;
}

const GameContainer: React.FC<GameContainerProps> = ({
  children,
  className,
  showHeader = true,
  title
}) => {
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {showHeader && title && (
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full">
          {children}
        </Card>
      </div>
    </div>
  );
};

export default GameContainer;

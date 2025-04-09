
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  title, 
  subtitle,
  onBackClick
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      {onBackClick && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="mr-2 hover:bg-primary/10 text-primary/80"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      
      <div>
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>
    </div>
  );
};

export default GameHeader;

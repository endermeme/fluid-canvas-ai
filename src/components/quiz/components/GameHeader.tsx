
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Share2, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export interface GameHeaderProps {
  title?: string;
  progress: number;
  timeLeft?: number;
  score?: number;
  currentItem: number;
  totalItems: number;
  onBack?: () => void;
  onShare?: () => Promise<void>;
  extraButton?: React.ReactNode;
  onRefresh?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  progress,
  timeLeft,
  score,
  currentItem,
  totalItems,
  onBack,
  onShare,
  extraButton,
  onRefresh,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="h-8 w-8"
              title="Quay lại"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <h2 className="text-xl font-bold">{title || `Câu ${currentItem}/${totalItems}`}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {score !== undefined && (
            <div className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-1 rounded">
              Điểm: {score}
            </div>
          )}
          
          {timeLeft !== undefined && timeLeft > 0 && (
            <div className="text-sm font-medium bg-secondary/20 px-2.5 py-1 rounded">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/preset-games')}
            className="h-8 w-8"
            title="Chọn game"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          {onShare && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onShare}
              className="h-8 w-8"
              title="Chia sẻ"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/game-history')}
            className="h-8 w-8"
            title="Lịch sử"
          >
            <History className="h-4 w-4" />
          </Button>

          {extraButton}
          
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onRefresh}
              className="h-8 w-8"
              title="Làm mới"
            >
              <History className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className="h-1.5" 
      />
    </div>
  );
};

export default GameHeader;

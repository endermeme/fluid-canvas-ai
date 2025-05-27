
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, History, Home } from 'lucide-react';

interface PresetGameHeaderProps {
  onShare?: () => void;
  showShare?: boolean;
  isGameCreated?: boolean;
  onBack?: () => void;
  title?: string;
}

const PresetGameHeader: React.FC<PresetGameHeaderProps> = ({
  onShare,
  showShare = false,
  isGameCreated = false,
  onBack,
  title = "Trò Chơi Có Sẵn"
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleHistory = () => {
    navigate('/game-history');
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleHome}
          className="hover:bg-primary/10"
        >
          <Home className="h-4 w-4 mr-2" />
          Trang chủ
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleHistory}
          className="hover:bg-primary/10"
        >
          <History className="h-4 w-4 mr-2" />
          Lịch sử
        </Button>

        {showShare && isGameCreated && onShare && (
          <Button 
            onClick={onShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
        )}
      </div>
    </div>
  );
};

export default PresetGameHeader;

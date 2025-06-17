
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, History, Plus, Share2 } from "lucide-react";

interface PresetGameHeaderProps {
  onShare?: () => void;
  showShare?: boolean;
  isGameCreated?: boolean;
  onBack?: () => void;
  showBackButton?: boolean; // Thêm prop để kiểm soát hiển thị nút quay lại
}

const PresetGameHeader: React.FC<PresetGameHeaderProps> = ({ 
  onShare, 
  showShare = true,
  isGameCreated = false,
  onBack,
  showBackButton = true // Mặc định hiển thị nút quay lại
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="flex justify-between items-center p-1 bg-background/80 backdrop-blur-md border-b sticky top-0 z-20">
      {showBackButton ? (
        <Card 
          className="p-1 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:from-primary/15 hover:to-primary/10 transition-all duration-200 cursor-pointer hover:shadow-md"
          onClick={handleBack}
        >
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">Quay lại</span>
          </div>
        </Card>
      ) : (
        <div></div> // Placeholder để giữ layout justify-between
      )}

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 h-7 w-7"
          onClick={() => navigate("/preset-games")}
        >
          <Plus className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 h-7 w-7"
          onClick={() => navigate("/game-history")}
        >
          <History className="h-3 w-3" />
        </Button>
        
        {showShare && onShare && isGameCreated && (
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1 h-7 px-2 text-xs"
            onClick={onShare}
          >
            <Share2 className="h-2 w-2" />
            Chia sẻ
          </Button>
        )}
      </div>
    </header>
  );
};

export default PresetGameHeader;

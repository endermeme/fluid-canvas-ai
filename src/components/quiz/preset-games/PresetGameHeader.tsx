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
    <header className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3">
      {showBackButton ? (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      ) : (
        <div></div> // Placeholder để giữ layout justify-between
      )}

      <div className="flex gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-primary/10"
          onClick={() => navigate("/preset-games")}
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-primary/10"
          onClick={() => navigate("/game-history")}
        >
          <History className="h-4 w-4" />
        </Button>
        
        {showShare && onShare && isGameCreated && (
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            <span>Chia sẻ</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default PresetGameHeader;

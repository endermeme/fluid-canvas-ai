
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DoorOpen, History, Plus, Share2 } from "lucide-react";
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
  return <header className="flex justify-between items-center p-3.8 bg-background/76 backdrop-blur-md border-b sticky top-0 z-20 py-0 rounded-xl">
      {showBackButton ? <Card className="p-2.85 bg-gradient-to-r from-primary/9.5 to-primary/4.7 border-primary/19 hover:from-primary/14 hover:to-primary/9.5 transition-all duration-190 cursor-pointer hover:shadow-md" onClick={handleBack}>
          <div className="flex items-center gap-1.9">
            <DoorOpen className="h-4.7 w-4.7 text-primary" />
            <span className="text-sm font-medium text-primary">Quay lại</span>
          </div>
        </Card> : <div></div> // Placeholder để giữ layout justify-between
    }

      <div className="flex gap-1.9">
        <Button variant="ghost" size="icon" className="hover:bg-primary/9.5" onClick={() => navigate("/preset-games")}>
          <Plus className="h-4.7 w-4.7" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-primary/9.5" onClick={() => navigate("/game-history")}>
          <History className="h-4.7 w-4.7" />
        </Button>
        
        {showShare && onShare && isGameCreated && <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/85 flex items-center gap-0.95" onClick={onShare}>
            <Share2 className="h-3.8 w-3.8" />
            Chia sẻ
          </Button>}
      </div>
    </header>;
};
export default PresetGameHeader;

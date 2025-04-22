
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Plus, Share2 } from "lucide-react";

interface PresetGameHeaderProps {
  onShare?: () => void;
  showShare?: boolean;
  isGameCreated?: boolean; // New prop to control share button visibility
}

const PresetGameHeader: React.FC<PresetGameHeaderProps> = ({ 
  onShare, 
  showShare = true,
  isGameCreated = false
}) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-3 bg-background/80 backdrop-blur-md border-b sticky top-0 z-20">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/10"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          onClick={() => navigate("/preset-games")}
        >
          <Plus className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          onClick={() => navigate("/game-history")}
        >
          <History className="h-5 w-5" />
        </Button>
        
        {showShare && onShare && isGameCreated && (
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
        )}
      </div>
    </header>
  );
};

export default PresetGameHeader;

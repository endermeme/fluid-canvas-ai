
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Plus, Share2, RefreshCw, Maximize, PlusCircle } from "lucide-react";

interface CustomGameHeaderProps {
  onShare?: () => void;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onNewGame?: () => void;
  showShare?: boolean;
  isGameCreated?: boolean;
  showGameControls?: boolean;
}

const CustomGameHeader: React.FC<CustomGameHeaderProps> = ({ 
  onShare, 
  onRefresh,
  onFullscreen,
  onNewGame,
  showShare = true,
  isGameCreated = false,
  showGameControls = false
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
        {/* Các nút điều hướng */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          onClick={() => navigate("/quiz")}
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
        
        {/* Các nút điều khiển game */}
        {showGameControls && onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10"
            onClick={onRefresh}
            title="Tải lại game"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        )}
        
        {showGameControls && onFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10"
            onClick={onFullscreen}
            title="Toàn màn hình"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        )}
        
        {showGameControls && onNewGame && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={onNewGame}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Game mới
          </Button>
        )}
        
        {/* Nút chia sẻ */}
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

export default CustomGameHeader;

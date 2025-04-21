
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, History, Plus } from "lucide-react";

interface PresetGameHeaderProps {
  onShare?: () => void;
  showShare?: boolean;
  showHistory?: boolean;
  showCreate?: boolean;
}

const PresetGameHeader: React.FC<PresetGameHeaderProps> = ({
  onShare,
  showShare = true,
  showHistory = true,
  showCreate = true,
}) => {
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-between items-center px-3 py-1 border-b sticky top-0 bg-white/80 dark:bg-secondary/80 z-20 backdrop-blur-md">
      {/* Left: Quay về Home */}
      <div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          aria-label="Quay về trang chủ"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Right: Các actions */}
      <div className="flex gap-1">
        {showCreate && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Tạo mới"
            className="hover:bg-primary/10"
            onClick={() => navigate("/preset-games")}
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}

        {showHistory && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Lịch sử"
            className="hover:bg-primary/10"
            onClick={() => navigate("/game-history")}
          >
            <History className="h-5 w-5" />
          </Button>
        )}

        {showShare && onShare && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Chia sẻ"
            className="hover:bg-primary/10"
            onClick={onShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
};
export default PresetGameHeader;

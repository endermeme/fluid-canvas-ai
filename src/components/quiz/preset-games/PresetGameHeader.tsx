
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Plus, Share2, Gamepad2, Home } from "lucide-react";

interface PresetGameHeaderProps {
  onShare?: () => void;
  showShare?: boolean;
  isGameCreated?: boolean;
  onBack?: () => void;
}

const PresetGameHeader: React.FC<PresetGameHeaderProps> = ({ 
  onShare, 
  showShare = true,
  isGameCreated = false,
  onBack
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
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg border-b border-white/20">
      <div className="flex justify-between items-center p-4">
        {/* Left Section - Back & Game Cards Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => navigate("/")}
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Thẻ Game
          </Button>
        </div>

        {/* Center Section - Title */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Game Preset
          </h1>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => navigate("/preset-games")}
            title="Tạo game mới"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => navigate("/game-history")}
            title="Lịch sử game"
          >
            <History className="h-4 w-4" />
          </Button>
          
          {showShare && onShare && isGameCreated && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 border border-white/40 backdrop-blur-sm transition-all duration-200 hover:scale-105 font-medium"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default PresetGameHeader;

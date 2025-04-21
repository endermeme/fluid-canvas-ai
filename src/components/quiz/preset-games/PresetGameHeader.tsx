
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Plus, Share2 } from "lucide-react";

const PresetGameHeader = () => {
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
      </div>
    </header>
  );
};

export default PresetGameHeader;

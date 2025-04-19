
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameType, GameSettingsData } from '../types/game';
import { gameTypes } from './gameTypes';
import { 
  GraduationCap, 
  Puzzle, 
  Trophy,
  MessageSquare
} from 'lucide-react';

interface GameSelectorProps {
  onSelectGame: (gameType: string) => void;
  onQuickStart?: (gameType: string, prompt: string, settings: GameSettingsData) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame, onQuickStart }) => {
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'graduation-cap': return <GraduationCap size={28} />;
      case 'puzzle': return <Puzzle size={28} />;
      case 'trophy': return <Trophy size={28} />;
      case 'message-square': return <MessageSquare size={28} />;
      default: return <Puzzle size={28} />;
    }
  };

  const handleQuickStart = (gameType: GameType) => {
    if (onQuickStart) {
      onQuickStart(
        gameType.id,
        gameType.description,
        gameType.defaultSettings
      );
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Trò Chơi Giáo Dục</h1>
          <p className="text-muted-foreground">Chọn loại trò chơi bạn muốn tạo</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameTypes.map((gameType) => (
            <Card 
              key={gameType.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/10 hover:border-primary/30"
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => onSelectGame(gameType.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    {getIconComponent(gameType.icon)}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/5 border-primary/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickStart(gameType);
                    }}
                  >
                    Bắt đầu ngay
                  </Button>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{gameType.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{gameType.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelector;

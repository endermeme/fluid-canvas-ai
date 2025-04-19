
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameSelector from '@/preset-games/GameSelector';
import PresetGameManager from '@/preset-games/PresetGameManager';
import { GameSettingsData } from '@/types/game';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { BarChart3, History } from 'lucide-react';

const PresetGamesPage: React.FC = () => {
  const [selectedGameType, setSelectedGameType] = React.useState<string | null>(null);
  const [gameTopic, setGameTopic] = React.useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract topic from URL if provided
  const searchParams = new URLSearchParams(location.search);
  const topicFromUrl = searchParams.get('topic');
  
  // Use URL topic if present and no game topic is set yet
  React.useEffect(() => {
    if (topicFromUrl && !gameTopic) {
      setGameTopic(topicFromUrl);
    }
  }, [topicFromUrl, gameTopic]);

  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
  };
  
  const handleBackToSelector = () => {
    setSelectedGameType(null);
    setGameTopic('');
    navigate('/preset-games', { replace: true });
  };
  
  const handleQuickStart = (gameType: string, prompt: string, settings: GameSettingsData) => {
    // Update settings to include the prompt
    const updatedSettings = {
      ...settings,
      prompt: prompt
    };
    
    setSelectedGameType(gameType);
    setGameTopic(prompt);
    
    toast({
      title: "Trò chơi đang được tạo",
      description: `Đang tạo trò chơi ${gameType} với nội dung "${prompt}"`,
    });
  };

  const viewGameHistory = () => {
    navigate('/game-history');
  };

  return (
    <div className="h-full flex flex-col overflow-auto relative">
      {!selectedGameType && (
        <div className="absolute top-4 right-4 z-10">
          <Button 
            onClick={viewGameHistory}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm shadow-sm"
          >
            <History size={16} />
            <span>Lịch sử game</span>
          </Button>
        </div>
      )}
      
      {selectedGameType ? (
        <PresetGameManager 
          gameType={selectedGameType} 
          onBack={handleBackToSelector}
          initialTopic={gameTopic}
        />
      ) : (
        <GameSelector 
          onSelectGame={handleSelectGame} 
          onQuickStart={handleQuickStart}
        />
      )}
    </div>
  );
};

export default PresetGamesPage;

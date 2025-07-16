
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameSelector from './GameSelector';
import PresetGameManager from './PresetGameManager';
import { GameSettingsData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { History, Atom, FlaskConical, Microscope, TestTube, Telescope, Radiation, Calculator, Beaker, Dna } from 'lucide-react';
const PresetGamesPage: React.FC = () => {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [gameTopic, setGameTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
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
    // Set loading to false after component mounts
    setIsLoading(false);
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

  // Show loading screen initially to prevent flash
  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden relative">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-medium">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto relative bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">

      {!selectedGameType && (
        <div className="absolute top-2 right-2 z-10">
          <Button 
            onClick={viewGameHistory}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm border-blue-200/45 dark:border-blue-700/45 text-xs px-2 py-1"
          >
            <History size={10} />
            <span>Lịch sử game</span>
          </Button>
        </div>
      )}
      
      <div className="relative z-10 min-h-full">
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
    </div>
  );
};

export default PresetGamesPage;

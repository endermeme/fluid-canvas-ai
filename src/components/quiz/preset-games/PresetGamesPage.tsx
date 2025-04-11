
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameSelector from './GameSelector';
import PresetGameManager from './PresetGameManager';
import { GameSettingsData } from '../types';
import { useToast } from '@/hooks/use-toast';

const PresetGamesPage: React.FC = () => {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [gameTopic, setGameTopic] = useState<string>('');
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
    setSelectedGameType(gameType);
    setGameTopic(prompt);
    
    toast({
      title: "Trò chơi đang được tạo",
      description: `Đang tạo trò chơi ${gameType} với chủ đề "${prompt}"`,
    });
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
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

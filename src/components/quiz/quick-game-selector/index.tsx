
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from '../AIGameGenerator';
import GameLoading from '../GameLoading';
import GameError from '../GameError';
import GameView from '../GameView';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import GameSettings from '../GameSettings';
import { GameSettingsData, GameType } from '../types';
import OpenAIKeyModal from '../OpenAIKeyModal';
import { gameTypes } from '../gameTypes';

// Import our new components
import GameHeader from './GameHeader';
import CustomGameForm from './CustomGameForm';
import GameGrid from './GameGrid';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuickGameSelectorProps {
  onGameRequest: (topic: string) => void;
  onToggleChat: () => void;
}

const QuickGameSelector: React.FC<QuickGameSelectorProps> = ({ onGameRequest, onToggleChat }) => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);

  const handleTitleClick = () => {
    setTitleClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setTimeout(() => {
          setShowOpenAIKeyModal(true);
          return 0;
        }, 100);
      }
      return newCount;
    });
  };

  const handleSaveOpenAIKey = (key: string) => {
    gameGenerator.setOpenAIKey(key);
  };

  const handleTopicSelect = (gameType: GameType) => {
    setSelectedTopic(gameType.description);
    setCurrentGameType(gameType);
    setShowSettings(true);
  };

  const handleCustomGameCreate = () => {
    onToggleChat();
  };
  
  const handleStartGame = async (settings: GameSettingsData) => {
    setShowSettings(false);
    if (!selectedTopic) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const game = await gameGenerator.generateMiniGame(selectedTopic, settings);
      
      if (game) {
        setSelectedGame(game);
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Đã tạo minigame về "${currentGameType?.name || selectedTopic}"`,
        });
      } else {
        throw new Error('Không thể tạo minigame');
      }
    } catch (error) {
      console.error('Lỗi Tạo Minigame:', error);
      setErrorMessage('Không thể tạo minigame. Vui lòng thử lại hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame. Vui lòng thử lại với chủ đề khác.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSettings = () => {
    setShowSettings(false);
    setSelectedTopic("");
    setCurrentGameType(null);
  };

  if (isLoading) {
    return <GameLoading />;
  }

  if (errorMessage) {
    return <GameError 
      errorMessage={errorMessage} 
      onRetry={() => setErrorMessage(null)} 
      topic="minigame" 
    />;
  }

  if (selectedGame) {
    return (
      <div className="h-full relative">
        <GameView miniGame={selectedGame} />
        <div className="absolute top-4 right-4">
          <h3 
            className="text-sm font-medium text-primary/60 cursor-pointer select-none" 
            onClick={handleTitleClick}
            title="Trợ Lý Tạo Web"
          >
            Trợ Lý Tạo Web
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-4 md:p-6 overflow-auto">
      <GameHeader onTitleClick={handleTitleClick} />
      
      <CustomGameForm 
        onCustomGameCreate={handleCustomGameCreate}
        onGameRequest={onGameRequest}
      />
      
      <GameGrid gameTypes={gameTypes} onTopicSelect={handleTopicSelect} />
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-white/20">
          <DialogTitle>Điều chỉnh game {currentGameType?.name || ""}</DialogTitle>
          <GameSettings 
            topic={selectedTopic}
            onStart={handleStartGame}
            initialSettings={currentGameType?.defaultSettings}
            onCancel={handleCancelSettings}
            inModal={true}
            gameType={currentGameType}
          />
        </DialogContent>
      </Dialog>

      <OpenAIKeyModal 
        isOpen={showOpenAIKeyModal}
        onClose={() => setShowOpenAIKeyModal(false)}
        onSave={handleSaveOpenAIKey}
        currentKey={localStorage.getItem('openai_api_key')}
      />
    </div>
  );
};

export default QuickGameSelector;

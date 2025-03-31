
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GameSettingsData } from '@/pages/Quiz';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameWelcome from './GameWelcome';
import GameView from './GameView';
import GameSettings from './GameSettings';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
  gameSettings?: GameSettingsData;
}

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string, settings?: GameSettingsData) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete,
  gameSettings
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string, settings?: GameSettingsData) => {
      if (topic.trim()) {
        generateMiniGame(topic, settings);
      }
    }
  }));

  const generateMiniGame = async (topic: string, settings?: GameSettingsData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMiniGame(null);

    try {      
      const game = await gameGenerator.generateMiniGame(topic, settings);
      
      if (game) {
        setMiniGame(game);
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Đã tạo minigame về "${topic}"`,
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

  // Handle topic selection from GameWelcome quick buttons
  const handleTopicSelect = (selectedTopic: string) => {
    // Directly generate for chat-based requests (no settings shown)
    generateMiniGame(selectedTopic);
  };

  // Handle showing settings before generating
  const handleShowSettings = (selectedTopic: string) => {
    setSelectedTopic(selectedTopic);
    setShowSettings(true);
  };

  // Handle starting game after settings are selected
  const handleStartWithSettings = (settings: GameSettingsData) => {
    if (selectedTopic) {
      setShowSettings(false);
      generateMiniGame(selectedTopic, settings);
    }
  };

  if (isLoading) {
    return <GameLoading />;
  }

  if (errorMessage) {
    return <GameError 
      errorMessage={errorMessage} 
      onRetry={() => generateMiniGame(topic || "minigame vui")} 
      topic={topic} 
    />;
  }

  if (showSettings && selectedTopic) {
    return (
      <GameSettings 
        onStart={handleStartWithSettings} 
        topic={selectedTopic} 
        onCancel={() => setShowSettings(false)}
      />
    );
  }

  if (!miniGame) {
    return (
      <GameWelcome 
        onTopicSelect={handleTopicSelect} 
        showSettings={false} 
        onStartWithSettings={handleShowSettings}
      />
    );
  }

  return <GameView miniGame={miniGame} />;
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;


import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from './generator/AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import OpenAIKeyModal from './OpenAIKeyModal';
import { GameSettingsData } from './types';
import { getGameTypeByTopic } from './gameTypes';
import { getUseOpenAIAsPrimary } from './generator/apiUtils';

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string, settings?: GameSettingsData) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete,
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>(topic);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  const useOpenAIAsPrimary = getUseOpenAIAsPrimary();
  
  const defaultSettings: GameSettingsData = {
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
  };

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string, settings?: GameSettingsData) => {
      if (topic.trim()) {
        setCurrentTopic(topic);
        generateMiniGame(topic, settings || getSettingsFromTopic(topic));
      }
    }
  }));

  const getSettingsFromTopic = (topic: string): GameSettingsData => {
    const gameType = getGameTypeByTopic(topic);
    if (gameType) {
      return {...gameType.defaultSettings};
    }
    
    let settings = {...defaultSettings};
    
    const lowerTopic = topic.toLowerCase();
    
    if (lowerTopic.includes('trí nhớ') || lowerTopic.includes('ghi nhớ')) {
      settings.questionCount = 8;
      settings.timePerQuestion = 3;
    } else if (lowerTopic.includes('xếp hình') || lowerTopic.includes('ghép hình')) {
      settings.questionCount = 5;
      settings.timePerQuestion = 60;
    } else if (lowerTopic.includes('phản xạ') || lowerTopic.includes('nhanh')) {
      settings.questionCount = 15;
      settings.timePerQuestion = 5;
    } else if (lowerTopic.includes('vẽ') || lowerTopic.includes('drawing')) {
      settings.category = 'arts';
      settings.questionCount = 4;
      settings.timePerQuestion = 60;
    } else if (lowerTopic.includes('câu đố') || lowerTopic.includes('đố')) {
      settings.questionCount = 8;
      settings.timePerQuestion = 40;
    } else if (lowerTopic.includes('ghép cặp') || lowerTopic.includes('từ nam châm')) {
      settings.questionCount = 8;
      settings.timePerQuestion = 45;
    }
    
    if (lowerTopic.includes('lịch sử')) {
      settings.category = 'history';
    } else if (lowerTopic.includes('khoa học')) {
      settings.category = 'science';
    } else if (lowerTopic.includes('địa lý')) {
      settings.category = 'geography';
    } else if (lowerTopic.includes('nghệ thuật') || lowerTopic.includes('âm nhạc')) {
      settings.category = 'arts';
    } else if (lowerTopic.includes('thể thao')) {
      settings.category = 'sports';
    } else if (lowerTopic.includes('toán')) {
      settings.category = 'math';
    }
    
    console.log("Settings for topic:", topic, settings);
    return settings;
  };

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

  const handleSaveOpenAIKey = (key: string, useAsPrimary: boolean = false) => {
    console.log("Saving OpenAI key...");
    const success = gameGenerator.setOpenAIKey(key, useAsPrimary);
    if (success) {
      console.log("OpenAI key saved successfully");
      toast({
        title: "API Key Đã Lưu",
        description: useAsPrimary 
          ? "API key OpenAI đã được lưu. OpenAI sẽ được sử dụng làm API chính với GPT-4o-mini" 
          : "API key OpenAI đã được lưu. Các minigame tiếp theo sẽ được cải thiện chất lượng.",
      });
    } else {
      console.log("Failed to save OpenAI key");
      toast({
        title: "Lỗi Lưu API Key",
        description: "API key không hợp lệ hoặc trống.",
        variant: "destructive"
      });
    }
  };

  const generateMiniGame = async (topic: string, settings: GameSettingsData = defaultSettings) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMiniGame(null);
    setCurrentTopic(topic);

    console.log("Starting minigame generation for topic:", topic);
    console.log("Starting game with settings:", settings);

    try {      
      const game = await gameGenerator.generateMiniGame(topic, settings);
      
      if (game) {
        console.log("Minigame generated successfully:", game.title);
        setMiniGame(game);
        
        const toastDescription = gameGenerator.isOpenAIPrimary() 
          ? `Đã tạo trực tiếp minigame về "${topic}" với GPT-4o-mini`
          : gameGenerator.hasOpenAIKey() 
            ? `Đã tạo và cải thiện minigame về "${topic}" với GPT-4o` 
            : `Đã tạo minigame về "${topic}"`;
            
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: toastDescription,
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

  if (isLoading) {
    return <GameLoading topic={currentTopic} />;
  }

  if (errorMessage) {
    return <GameError 
      errorMessage={errorMessage} 
      onRetry={() => generateMiniGame(topic || "minigame vui", defaultSettings)} 
      topic={topic} 
    />;
  }

  if (!miniGame) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6 py-10">
        <p className="text-lg">Vui lòng nhập chủ đề vào thanh chat để tạo minigame</p>
        <h3 
          className="text-xl font-bold cursor-pointer select-none" 
          onClick={handleTitleClick}
          title="Trợ Lý Tạo Web"
        >
          Trợ Lý Tạo Web
        </h3>
        <OpenAIKeyModal 
          isOpen={showOpenAIKeyModal}
          onClose={() => setShowOpenAIKeyModal(false)}
          onSave={handleSaveOpenAIKey}
          currentKey={localStorage.getItem('openai_api_key')}
          useOpenAIAsPrimary={useOpenAIAsPrimary}
        />
      </div>
    );
  }

  return (
    <>
      <GameView miniGame={miniGame} />
      <div className="absolute top-4 right-4">
        <h3 
          className="text-sm font-medium text-primary/60 cursor-pointer select-none" 
          onClick={handleTitleClick}
          title="Trợ Lý Tạo Web"
        >
          Trợ Lý Tạo Web
        </h3>
      </div>
      <OpenAIKeyModal 
        isOpen={showOpenAIKeyModal}
        onClose={() => setShowOpenAIKeyModal(false)}
        onSave={handleSaveOpenAIKey}
        currentKey={localStorage.getItem('openai_api_key')}
        useOpenAIAsPrimary={useOpenAIAsPrimary}
      />
    </>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;

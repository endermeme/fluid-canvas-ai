import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from './generator/AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import { GameSettingsData } from './types';
import { getGameTypeByTopic } from './gameTypes';
import { getPresetById } from './presets/gamePresetData';
import { buildPresetPrompt } from './presets/presetPromptBuilder';

// API key cứng
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

interface QuizSettings extends GameSettingsData {
  presetId?: string;
  customContent?: string;
}

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string, settings?: QuizSettings) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete,
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>(topic);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  const [canvasMode, setCanvasMode] = useState<boolean>(
    localStorage.getItem('canvas_mode') === 'true'
  );
  
  const defaultSettings: GameSettingsData = {
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
  };
  
  // Set canvas mode based on localStorage
  useEffect(() => {
    const storedCanvasMode = localStorage.getItem('canvas_mode') === 'true';
    gameGenerator.setCanvasMode(storedCanvasMode);
    setCanvasMode(storedCanvasMode);
  }, [gameGenerator]);

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string, settings?: QuizSettings) => {
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

  const generateMiniGame = async (topic: string, settings: QuizSettings = defaultSettings) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMiniGame(null);
    setCurrentTopic(topic);

    console.log("Starting minigame generation for topic:", topic);
    console.log("Starting game with settings:", settings);

    try {
      // Check if we're using a preset
      if (settings.presetId && settings.customContent) {
        const preset = getPresetById(settings.presetId);
        if (preset) {
          // Build preset-specific prompt
          const presetPrompt = buildPresetPrompt(preset, settings.customContent);
          console.log("Using preset prompt for game generation");
          
          // Generate game with preset prompt
          const game = await gameGenerator.generateMiniGameWithPrompt(presetPrompt);
          
          if (game) {
            console.log("Preset minigame generated successfully:", game.title);
            setMiniGame(game);
            toast({
              title: "Minigame Đã Sẵn Sàng",
              description: `Đã tạo minigame "${preset.name}" về "${settings.customContent}"`,
            });
          } else {
            throw new Error('Không thể tạo minigame từ mẫu');
          }
        } else {
          throw new Error('Không tìm thấy mẫu trò chơi');
        }
      } else {
        // Regular game generation without preset
        const game = await gameGenerator.generateMiniGame(topic, settings);
        
        if (game) {
          console.log("Minigame generated successfully:", game.title);
          setMiniGame(game);
          toast({
            title: "Minigame Đã Sẵn Sàng",
            description: `Đã tạo minigame về "${topic}" với Gemini`,
          });
        } else {
          throw new Error('Không thể tạo minigame');
        }
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
        <h3 className="text-xl font-bold cursor-pointer select-none">
          Trợ Lý Tạo Web
        </h3>
      </div>
    );
  }

  return (
    <>
      <GameView miniGame={miniGame} />
      <div className="absolute top-4 right-4">
        <h3 className="text-sm font-medium text-primary/60 cursor-pointer select-none">
          Trợ Lý Tạo Web
        </h3>
      </div>
    </>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;

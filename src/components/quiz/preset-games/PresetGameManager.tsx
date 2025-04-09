
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GameSettingsData } from '../types';

// Import new components and utilities
import GameLoading from './components/GameLoading';
import GameError from './components/GameError';
import GameTemplateRenderer from './components/GameTemplateRenderer';
import { generateGameContent, getGameTypeName } from './utils/gameContentGenerator';
import { loadSampleData } from './utils/sampleDataLoader';

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ 
  gameType, 
  onBack, 
  initialTopic = "Học tiếng Việt" 
}) => {
  const [loading, setLoading] = useState(true);
  const [gameContent, setGameContent] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleLoadSampleData = (type: string) => {
    const sampleData = loadSampleData(type);
    setGameContent(sampleData);
    setLoading(false);
  };

  const handleGenerateAIContent = async (topic: string, type: string) => {
    setLoading(true);
    setError(null);
    
    // Create game settings based on type and difficulty
    const settings: GameSettingsData = {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: type === 'matching' || type === 'memory' ? 60 : 
                       type === 'wordsearch' ? 300 : 30,
      category: 'general',
      layout: type === 'matching' ? 'horizontal' : undefined
    };
    
    // Adjust settings based on game type
    if (type === 'flashcards') {
      settings.questionCount = 8;
      settings.timePerQuestion = 5;
    } else if (type === 'matching' || type === 'memory') {
      settings.questionCount = 8;
    } else if (type === 'ordering') {
      settings.questionCount = 5;
      settings.timePerQuestion = 45;
    } else if (type === 'wordsearch') {
      settings.questionCount = 8;
      settings.timePerQuestion = 300;
    }
    
    console.log(`Generating ${type} game with topic "${topic}" and settings:`, settings);
    
    const success = await generateGameContent(
      topic,
      type,
      settings,
      (generatedContent) => {
        setGameContent(generatedContent);
        toast({
          title: "Đã tạo trò chơi",
          description: `Trò chơi ${getGameTypeName(type)} đã được tạo với AI.`,
        });
        setLoading(false);
      },
      (errorMessage) => {
        setError(errorMessage);
        toast({
          title: "Lỗi AI",
          description: "Không thể tạo nội dung. Đang chuyển sang dùng dữ liệu mẫu.",
          variant: "destructive"
        });
      },
      handleLoadSampleData
    );
  };

  const handleRetry = () => {
    if (initialTopic && initialTopic.trim() !== "") {
      handleGenerateAIContent(initialTopic, gameType);
    } else {
      handleLoadSampleData(gameType);
    }
  };

  useEffect(() => {
    // Sử dụng initialTopic từ props nếu có
    const aiPrompt = initialTopic;
    
    if (aiPrompt && aiPrompt.trim() !== "") {
      // Sử dụng AI để tạo nội dung nếu có prompt
      console.log(`Tạo game ${gameType} với prompt: "${aiPrompt}"`);
      handleGenerateAIContent(aiPrompt, gameType);
    } else {
      // Ngược lại sử dụng dữ liệu mẫu cho dev/test
      console.log(`Tải dữ liệu mẫu cho game ${gameType}`);
      handleLoadSampleData(gameType);
      setLoading(false);
    }
  }, [gameType, initialTopic]);

  if (loading) {
    return <GameLoading />;
  }

  if (error) {
    return <GameError error={error} onBack={onBack} onRetry={handleRetry} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        {gameContent ? (
          <GameTemplateRenderer 
            gameType={gameType} 
            gameContent={gameContent} 
            topic={initialTopic || "Chủ đề chung"} 
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Không có nội dung trò chơi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetGameManager;


import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import { GameSettingsData } from './types';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

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
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  
  const defaultSettings: GameSettingsData = {
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
  };

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string, settings?: GameSettingsData) => {
      if (topic.trim()) {
        generateMiniGame(topic, settings || getSettingsFromTopic(topic));
      }
    }
  }));

  const getSettingsFromTopic = (topic: string): GameSettingsData => {
    let settings = {...defaultSettings};
    
    // Adjust settings based on topic keywords
    if (topic.toLowerCase().includes('trí nhớ') || topic.toLowerCase().includes('nhớ hình')) {
      settings.questionCount = 8;
      settings.timePerQuestion = 3;
    } else if (topic.toLowerCase().includes('xếp hình') || topic.toLowerCase().includes('puzzle')) {
      settings.questionCount = 5;
      settings.timePerQuestion = 60;
    } else if (topic.toLowerCase().includes('phản xạ') || topic.toLowerCase().includes('nhanh')) {
      settings.questionCount = 15;
      settings.timePerQuestion = 5;
    } else if (topic.toLowerCase().includes('vẽ') || topic.toLowerCase().includes('drawing')) {
      settings.category = 'arts';
      settings.questionCount = 4;
      settings.timePerQuestion = 60;
    } else if (topic.toLowerCase().includes('câu đố') || topic.toLowerCase().includes('riddle')) {
      settings.questionCount = 8;
      settings.timePerQuestion = 40;
    }
    
    // Adjust category based on topic
    if (topic.toLowerCase().includes('lịch sử')) {
      settings.category = 'history';
    } else if (topic.toLowerCase().includes('khoa học')) {
      settings.category = 'science';
    } else if (topic.toLowerCase().includes('địa lý')) {
      settings.category = 'geography';
    } else if (topic.toLowerCase().includes('nghệ thuật') || topic.toLowerCase().includes('âm nhạc')) {
      settings.category = 'arts';
    } else if (topic.toLowerCase().includes('thể thao')) {
      settings.category = 'sports';
    } else if (topic.toLowerCase().includes('toán')) {
      settings.category = 'math';
    }
    
    return settings;
  };

  const generateMiniGame = async (topic: string, settings: GameSettingsData = defaultSettings) => {
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

  if (isLoading) {
    return <GameLoading />;
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
      </div>
    );
  }

  return <GameView miniGame={miniGame} />;
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;

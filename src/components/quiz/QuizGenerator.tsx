import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import { GameSettingsData } from './types';
import ApiKeySettings from './ApiKeySettings';

const DEFAULT_API_KEY = 'replace-with-default-key';
const API_KEY_STORAGE_KEY = 'claude-api-key';
const SECRET_PHRASE = 'trợ lý tạo web';
const REQUIRED_REPEATS = 3;

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
  const [gameGenerator, setGameGenerator] = useState<AIGameGenerator | null>(null);
  const [secretPhraseCount, setSecretPhraseCount] = useState<number>(0);
  const [showApiSettings, setShowApiSettings] = useState<boolean>(false);
  
  const defaultSettings: GameSettingsData = {
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
  };

  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    const apiKey = storedApiKey || DEFAULT_API_KEY;
    setGameGenerator(new AIGameGenerator(apiKey));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || DEFAULT_API_KEY;
      setGameGenerator(new AIGameGenerator(apiKey));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (topic && topic.toLowerCase() === SECRET_PHRASE.toLowerCase()) {
      const newCount = secretPhraseCount + 1;
      setSecretPhraseCount(newCount);
      
      if (newCount >= REQUIRED_REPEATS) {
        setSecretPhraseCount(0);
        setShowApiSettings(true);
        
        toast({
          title: "Cài đặt API mở",
          description: "Bạn đã mở cài đặt API key",
        });
      } else {
        const remaining = REQUIRED_REPEATS - newCount;
        toast({
          title: `Nhập thêm ${remaining} lần nữa`,
          description: `Cần nhập "${SECRET_PHRASE}" thêm ${remaining} lần để mở cài đặt API`,
        });
      }
    } else {
      setSecretPhraseCount(0);
    }
  }, [topic]);

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string, settings?: GameSettingsData) => {
      if (topic.trim()) {
        generateMiniGame(topic, settings || getSettingsFromTopic(topic));
      }
    }
  }));

  const getSettingsFromTopic = (topic: string): GameSettingsData => {
    let settings = {...defaultSettings};
    
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
    if (!gameGenerator) {
      toast({
        title: "Lỗi Khởi Tạo",
        description: "Không thể khởi tạo trình tạo game. Kiểm tra API key của bạn.",
        variant: "destructive",
      });
      return;
    }

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
      setErrorMessage('Không thể tạo minigame. Vui lòng thử lại hoặc kiểm tra API key của bạn.');
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame. Kiểm tra API key hoặc thử chủ đề khác.",
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
        <ApiKeySettings 
          isOpen={showApiSettings}
          onClose={() => setShowApiSettings(false)}
        />
      </div>
    );
  }

  return (
    <>
      <GameView miniGame={miniGame} />
      <ApiKeySettings 
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
      />
    </>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;

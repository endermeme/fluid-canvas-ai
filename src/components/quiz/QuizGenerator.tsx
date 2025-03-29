
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from '@/utils/AIGameGenerator';
import GameWelcomeScreen from './GameWelcomeScreen';
import GameLoadingError from './GameLoadingError';
import GameDisplay from './GameDisplay';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string) => {
      generateMiniGame(topic);
    }
  }));

  const generateMiniGame = async (topic: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMiniGame(null);

    try {      
      const game = await gameGenerator.generateMiniGame(topic);
      
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

  const handleRetry = () => {
    generateMiniGame(topic || "minigame vui");
  };

  const handleTopicSelect = (selectedTopic: string) => {
    generateMiniGame(selectedTopic);
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <GameLoadingError 
        isLoading={isLoading}
        errorMessage={errorMessage}
        onRetry={handleRetry}
        topic={topic}
      />
      
      {!isLoading && !errorMessage && !miniGame && (
        <GameWelcomeScreen onTopicSelect={handleTopicSelect} />
      )}
      
      <GameDisplay miniGame={miniGame} />
    </div>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;

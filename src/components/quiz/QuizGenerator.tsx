
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from '@/utils/AIGameGenerator';
import GameWelcomeScreen from './GameWelcomeScreen';
import GameLoadingError from './GameLoadingError';
import GameDisplay from './GameDisplay';
import { GameOptions } from './GameOptionsSelector';
import { fadeIn, slideIn } from '@/lib/animations';

// Use an environment variable if available, otherwise use this key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

// Explicitly use the correct forwardRef type with the ref interface
const QuizGenerator = forwardRef<{ generateQuiz: (topic: string, options?: GameOptions) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  // Create game generator on component mount
  const [gameGenerator] = useState<AIGameGenerator>(() => new AIGameGenerator(API_KEY));
  const [currentOptions, setCurrentOptions] = useState<GameOptions>({
    contentType: 'entertainment',
    difficulty: 'medium',
    ageGroup: 'all',
    customContent: '',
    customFile: null,
    questionCount: 5,
    timePerQuestion: 30
  });
  const [animationClass, setAnimationClass] = useState('');

  // Expose the generateQuiz method to parent components through the ref
  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string, options?: GameOptions) => {
      if (options) {
        setCurrentOptions(options);
      }
      generateMiniGame(topic, options);
    }
  }));

  const generateMiniGame = async (topic: string, options?: GameOptions) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMiniGame(null);
    setAnimationClass('');
    
    const gameOptions = options || currentOptions;

    try {
      // Handle custom file if provided
      if (gameOptions.customFile) {
        toast({
          title: "Đang xử lý tệp",
          description: `Đang xử lý tệp "${gameOptions.customFile.name}"...`,
        });
      }
      
      // If custom content is provided, update the toast message
      if (gameOptions.customContent && gameOptions.contentType === 'custom') {
        toast({
          title: "Nội Dung Tùy Chỉnh",
          description: "Đang tạo trò chơi với nội dung tùy chỉnh của bạn...",
        });
      }
      
      // Add question count and time per question information to the toast
      toast({
        title: "Đang Tạo Trò Chơi",
        description: `Đang tạo trò chơi với chủ đề "${topic}" - ${gameOptions.questionCount} câu hỏi, ${gameOptions.timePerQuestion} giây/câu`,
      });
      
      console.log("Gọi API tạo trò chơi với chủ đề:", topic);
      const game = await gameGenerator.generateMiniGame(topic, gameOptions);
      
      if (game) {
        setMiniGame(game);
        setAnimationClass('animate-fade-in');
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Đã tạo minigame xếp hình về "${topic}"`,
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

  const handleTopicSelect = (selectedTopic: string, options?: GameOptions) => {
    if (options) {
      setCurrentOptions(options);
    }
    generateMiniGame(selectedTopic, options);
  };

  useEffect(() => {
    if (miniGame) {
      const element = document.querySelector('.game-frame');
      if (element instanceof HTMLElement) {
        fadeIn(element);
      }
    }
  }, [miniGame]);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      {isLoading && (
        <GameLoadingError 
          isLoading={isLoading}
          errorMessage={null}
          onRetry={handleRetry}
          topic={topic}
        />
      )}
      
      {!isLoading && errorMessage && (
        <GameLoadingError 
          isLoading={false}
          errorMessage={errorMessage}
          onRetry={handleRetry}
          topic={topic}
        />
      )}
      
      {!isLoading && !errorMessage && !miniGame && (
        <GameWelcomeScreen onTopicSelect={handleTopicSelect} />
      )}
      
      {miniGame && (
        <div className={animationClass}>
          <GameDisplay 
            miniGame={miniGame} 
            hasCustomContent={currentOptions.contentType === 'custom' || !!currentOptions.customFile}
            questionCount={currentOptions.questionCount}
            timePerQuestion={currentOptions.timePerQuestion}
          />
        </div>
      )}
    </div>
  );
});

QuizGenerator.displayName = "QuizGenerator"; // Required for forwardRef components

export default QuizGenerator;

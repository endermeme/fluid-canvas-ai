
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from '@/utils/AIGameGenerator';
import GameWelcomeScreen from './GameWelcomeScreen';
import GameLoadingError from './GameLoadingError';
import GameDisplay from './GameDisplay';
import { GameOptions } from './GameOptionsSelector';
import { fadeIn } from '@/lib/animations';

// Sử dụng biến môi trường nếu có, nếu không thì sử dụng key này
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

// Sử dụng rõ ràng kiểu forwardRef với giao diện ref
const QuizGenerator = forwardRef<{ generateQuiz: (topic: string, options?: GameOptions) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
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
  const [attempts, setAttempts] = useState(0);

  // Chia sẻ phương thức generateQuiz với các thành phần cha thông qua ref
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
    setAttempts(attempts + 1);
    
    const gameOptions = options || currentOptions;

    try {
      console.log("Gọi API tạo trò chơi với chủ đề:", topic);
      console.log("Tạo minigame với tùy chọn:", gameOptions);
      
      // Hiển thị thông báo toast cho các tình huống khác nhau
      if (gameOptions.customFile) {
        toast({
          title: "Đang xử lý tệp",
          description: `Đang xử lý tệp "${gameOptions.customFile.name}"...`,
        });
      }
      
      if (gameOptions.customContent && gameOptions.contentType === 'custom') {
        toast({
          title: "Nội Dung Tùy Chỉnh",
          description: "Đang tạo trò chơi với nội dung tùy chỉnh của bạn...",
        });
      }
      
      toast({
        title: "Đang Tạo Trò Chơi",
        description: `Đang tạo trò chơi với Gemini AI về "${topic}" - ${gameOptions.questionCount || 5} câu hỏi, ${gameOptions.timePerQuestion || 30} giây/câu`,
      });
      
      const game = await gameGenerator.generateMiniGame(topic, gameOptions);
      
      if (game && game.htmlContent) {
        console.log("Gemini đã tạo nội dung HTML thành công, độ dài:", game.htmlContent.length);
        setMiniGame(game);
        setAnimationClass('animate-fade-in');
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Đã tạo minigame về "${topic}"`,
        });
      } else {
        throw new Error('Không thể tạo minigame. Không có phản hồi từ AI Gemini hoặc nội dung HTML trống.');
      }
    } catch (error: any) {
      console.error('Lỗi Tạo Minigame:', error);
      setErrorMessage(`Không thể tạo minigame với Gemini AI: ${error.message || 'Lỗi không xác định'}. Vui lòng thử lại hoặc chọn chủ đề khác.`);
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame với Gemini. Vui lòng thử lại với chủ đề khác.",
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

QuizGenerator.displayName = "QuizGenerator"; // Bắt buộc cho các thành phần forwardRef

export default QuizGenerator;

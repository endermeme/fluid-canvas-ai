
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import GameSettings from './GameSettings';
import { GameSettingsData } from '../types/game';
import { getGameTypeById } from './gameTypes';
import gameTemplates from './templates';
import GameLoading from './GameLoading';
import GameError from './GameError';

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ 
  gameType, 
  onBack,
  initialTopic = '' 
}) => {
  const [settings, setSettings] = useState<GameSettingsData | null>(null);
  const [topic, setTopic] = useState<string>(initialTopic);
  const [gameContent, setGameContent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const gameTypeInfo = getGameTypeById(gameType);
  const GameTemplateComponent = gameTemplates[gameType as keyof typeof gameTemplates];
  
  useEffect(() => {
    if (gameTypeInfo) {
      // Initialize with default settings
      setSettings(gameTypeInfo.defaultSettings);
      
      // Automatic generate game if initialTopic is provided
      if (initialTopic) {
        setTopic(initialTopic);
      }
    }
  }, [gameTypeInfo, initialTopic]);

  const handleStartGame = async (gameSettings: GameSettingsData) => {
    if (!topic) {
      toast({
        title: "Thiếu chủ đề",
        description: "Vui lòng nhập chủ đề cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSettings(gameSettings);
    
    try {
      // Simulate generating game content - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate dummy content based on game type
      const dummyContent = generateDummyContent(gameType, topic, gameSettings);
      setGameContent(dummyContent);
      
      toast({
        title: "Trò chơi đã sẵn sàng",
        description: `Đã tạo trò chơi ${gameTypeInfo?.name || gameType} với chủ đề "${topic}"`,
      });
    } catch (error) {
      console.error('Error generating game:', error);
      setError('Không thể tạo trò chơi. Vui lòng thử lại sau.');
      
      toast({
        title: "Lỗi",
        description: "Không thể tạo trò chơi. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (settings) {
      handleStartGame(settings);
    }
  };

  if (loading) {
    return <GameLoading topic={topic} />;
  }

  if (error) {
    return <GameError errorMessage={error} onRetry={handleRetry} topic={topic} />;
  }

  if (gameContent && GameTemplateComponent) {
    return <GameTemplateComponent content={gameContent} topic={topic} onBack={onBack} />;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{gameTypeInfo?.name || 'Trò chơi tùy chỉnh'}</h1>
        
        <GameSettings 
          topic={topic} 
          onTopicChange={setTopic}
          onStart={handleStartGame}
          initialSettings={gameTypeInfo?.defaultSettings}
          onCancel={onBack}
          gameType={gameTypeInfo}
        />
      </div>
    </div>
  );
};

/**
 * Generate dummy content - Replace with actual API calls in production
 */
function generateDummyContent(gameType: string, topic: string, settings: GameSettingsData): any {
  const { difficulty = 'medium', questionCount = 10 } = settings;
  
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  // Common settings for all games
  const baseContent = {
    title: `${capitalize(gameType)}: ${topic}`,
    settings: {
      ...settings,
      showHints: true,
      allowSkip: true,
      showExplanation: true
    }
  };
  
  // Generate content based on game type
  switch (gameType) {
    case 'quiz':
      return {
        ...baseContent,
        questions: Array.from({ length: questionCount }, (_, i) => ({
          question: `Câu hỏi ${i + 1} về ${topic}?`,
          options: [
            `Đáp án A cho câu hỏi ${i + 1}`,
            `Đáp án B cho câu hỏi ${i + 1}`,
            `Đáp án C cho câu hỏi ${i + 1}`,
            `Đáp án D cho câu hỏi ${i + 1}`
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `Giải thích cho câu hỏi ${i + 1}`
        }))
      };
      
    case 'flashcards':
      return {
        ...baseContent,
        cards: Array.from({ length: questionCount }, (_, i) => ({
          front: `Thuật ngữ ${i + 1} về ${topic}`,
          back: `Định nghĩa cho thuật ngữ ${i + 1}`
        }))
      };
      
    case 'matching':
      return {
        ...baseContent,
        pairs: Array.from({ length: questionCount }, (_, i) => ({
          term: `Thuật ngữ ${i + 1} về ${topic}`,
          definition: `Định nghĩa cho thuật ngữ ${i + 1}`
        }))
      };
      
    case 'memory':
      return {
        ...baseContent,
        cards: Array.from({ length: questionCount * 2 }, (_, i) => {
          const pairIndex = Math.floor(i / 2);
          return {
            id: i,
            content: `Mục ${pairIndex + 1}`,
            matched: false,
            flipped: false
          };
        })
      };
      
    case 'ordering':
      return {
        ...baseContent,
        sentences: Array.from({ length: questionCount }, (_, i) => {
          const wordCount = Math.floor(Math.random() * 3) + 4; // 4-6 words
          const words = Array.from({ length: wordCount }, (_, j) => `Từ${j + 1}`);
          return {
            words,
            correctOrder: Array.from({ length: wordCount }, (_, j) => j)
          };
        })
      };
      
    case 'wordsearch':
      return {
        ...baseContent,
        grid: Array.from({ length: 10 }, () => 
          Array.from({ length: 10 }, () => 
            String.fromCharCode(65 + Math.floor(Math.random() * 26))
          )
        ),
        words: Array.from({ length: questionCount }, (_, i) => `Từ${i + 1}`)
      };
      
    case 'pictionary':
      return {
        ...baseContent,
        images: Array.from({ length: questionCount }, (_, i) => ({
          url: `https://via.placeholder.com/300x200?text=Image${i + 1}`,
          answer: `Đáp án cho hình ${i + 1}`,
          hints: [`Gợi ý 1 cho hình ${i + 1}`, `Gợi ý 2 cho hình ${i + 1}`]
        }))
      };
      
    case 'truefalse':
      return {
        ...baseContent,
        questions: Array.from({ length: questionCount }, (_, i) => ({
          statement: `Phát biểu ${i + 1} về ${topic}`,
          isTrue: Math.random() > 0.5,
          explanation: `Giải thích cho phát biểu ${i + 1}`
        }))
      };
      
    default:
      return baseContent;
  }
}

export default PresetGameManager;

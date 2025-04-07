
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import gameTemplates from './templates';
import QuizTemplate from './templates/QuizTemplate';
import FlashcardsTemplate from './templates/FlashcardsTemplate';
import MatchingTemplate from './templates/MatchingTemplate';
import MemoryTemplate from './templates/MemoryTemplate';
import OrderingTemplate from './templates/OrderingTemplate';
import WordSearchTemplate from './templates/WordSearchTemplate';
import PictionaryTemplate from './templates/PictionaryTemplate';
import TrueFalseTemplate from './templates/TrueFalseTemplate';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator } from '../generator/AIGameGenerator';
import { GameSettingsData } from '../types';
import CustomGameForm from './CustomGameForm';

// Sample preset game content for testing/development
import { quizSampleData } from './data/quizSampleData';
import { flashcardsSampleData } from './data/flashcardsSampleData';
import { matchingSampleData } from './data/matchingSampleData';
import { memorySampleData } from './data/memorySampleData';
import { orderingSampleData } from './data/orderingSampleData';
import { wordSearchSampleData } from './data/wordSearchSampleData';
import { pictionarySampleData } from './data/pictionarySampleData';
import { trueFalseSampleData } from './data/trueFalseSampleData';

// API key cứng
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
  customContent?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ 
  gameType, 
  onBack, 
  initialTopic = "Học tiếng Việt",
  customContent
}) => {
  const [loading, setLoading] = useState(false);
  const [gameContent, setGameContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));

  useEffect(() => {
    const loadInitialGameContent = async () => {
      setLoading(true);
      
      try {
        // Nếu có nội dung tùy chỉnh, ưu tiên sử dụng nội dung đó
        if (customContent) {
          setGameContent({ content: customContent });
          setLoading(false);
          return;
        }
        
        // Trong trường hợp không có nội dung tùy chỉnh, tải mẫu
        setTimeout(() => {
          // Load sample data based on game type
          switch(gameType) {
            case 'quiz':
              setGameContent(quizSampleData);
              break;
            case 'flashcards':
              setGameContent(flashcardsSampleData);
              break;
            case 'matching':
              setGameContent(matchingSampleData);
              break;
            case 'memory':
              setGameContent(memorySampleData);
              break;
            case 'ordering':
              setGameContent(orderingSampleData);
              break;
            case 'wordsearch':
              setGameContent(wordSearchSampleData);
              break;
            case 'pictionary':
              setGameContent(pictionarySampleData);
              break;
            case 'truefalse':
              setGameContent(trueFalseSampleData);
              break;
            default:
              setGameContent(quizSampleData);
          }
          setLoading(false);
        }, 500); // Simulate loading
      } catch (err) {
        setError('Không thể tải trò chơi. Vui lòng thử lại sau.');
        setLoading(false);
        toast({
          title: "Lỗi",
          description: "Không thể tải trò chơi. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      }
    };

    if (!showCustomForm) {
      loadInitialGameContent();
    }
  }, [gameType, customContent, showCustomForm, toast]);

  const handleGenerateWithGemini = async (content: string, difficulty: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Tạo prompt dựa trên loại game và nội dung người dùng
      const gamePrompt = content;
      
      // Tạo settings tùy chỉnh dựa trên loại game
      const settings: GameSettingsData = {
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        questionCount: gameType === 'memory' ? 6 : gameType === 'pictionary' ? 5 : 10,
        timePerQuestion: gameType === 'wordsearch' ? 180 : gameType === 'ordering' ? 60 : 30,
        category: 'general',
      };
      
      console.log("Generating game with prompt:", gamePrompt);
      console.log("Game settings:", settings);
      
      // Tạo game với AI
      const game = await gameGenerator.generateMiniGame(gamePrompt, settings);
      
      if (game) {
        setGameContent(game);
        setShowCustomForm(false);
        toast({
          title: "Đã tạo trò chơi mới",
          description: `Trò chơi ${gameType} đã được tạo thành công.`,
        });
      } else {
        throw new Error('Không thể tạo trò chơi');
      }
    } catch (error) {
      console.error('Lỗi khi tạo trò chơi:', error);
      setError('Không thể tạo trò chơi. Vui lòng thử lại với yêu cầu khác.');
      toast({
        title: "Lỗi",
        description: "Không thể tạo trò chơi. Vui lòng thử lại với yêu cầu khác.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Render appropriate template based on game type
  const renderGameTemplate = () => {
    const topic = initialTopic || "Chủ đề chung";
    
    switch(gameType) {
      case 'quiz':
        return <QuizTemplate content={gameContent} topic={topic} />;
      case 'flashcards':
        return <FlashcardsTemplate content={gameContent} topic={topic} />;
      case 'matching':
        return <MatchingTemplate content={gameContent} topic={topic} />;
      case 'memory':
        return <MemoryTemplate content={gameContent} topic={topic} />;
      case 'ordering':
        return <OrderingTemplate content={gameContent} topic={topic} />;
      case 'wordsearch':
        return <WordSearchTemplate content={gameContent} topic={topic} />;
      case 'pictionary':
        return <PictionaryTemplate content={gameContent} topic={topic} />;
      case 'truefalse':
        return <TrueFalseTemplate content={gameContent} topic={topic} />;
      default:
        const DefaultTemplate = gameTemplates[gameType] || QuizTemplate;
        return <DefaultTemplate content={gameContent} topic={topic} />;
    }
  };

  if (showCustomForm) {
    return (
      <CustomGameForm
        gameType={gameType}
        onGenerate={handleGenerateWithGemini}
        onCancel={() => setShowCustomForm(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Đang tải trò chơi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={onBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-background/80 p-2 border-b flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowCustomForm(true)}
          className="ml-auto"
        >
          Tạo với AI
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto">
        {gameContent ? renderGameTemplate() : (
          <div className="flex items-center justify-center h-full">
            <p>Không có nội dung trò chơi</p>
            <Button onClick={() => setShowCustomForm(true)} className="ml-2">
              Tạo với AI
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetGameManager;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import gameTemplates from './templates';
import QuizTemplate from './templates/QuizTemplate';
import MemoryTemplate from './templates/MemoryTemplate';
import FlashcardsTemplate from './templates/FlashcardsTemplate';
import MatchingTemplate from './templates/MatchingTemplate';
import OrderingTemplate from './templates/OrderingTemplate';
import WordSearchTemplate from './templates/WordSearchTemplate';
import PictionaryTemplate from './templates/PictionaryTemplate';
import TrueFalseTemplate from './templates/TrueFalseTemplate';
import { useToast } from '@/hooks/use-toast';

// Sample preset game content for testing/development
import { quizSampleData } from './data/quizSampleData';
import { flashcardsSampleData } from './data/flashcardsSampleData';
import { matchingSampleData } from './data/matchingSampleData';
import { memorySampleData } from './data/memorySampleData';
import { orderingSampleData } from './data/orderingSampleData';
import { wordSearchSampleData } from './data/wordSearchSampleData';
import { pictionarySampleData } from './data/pictionarySampleData';
import { trueFalseSampleData } from './data/trueFalseSampleData';

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
  const [gameContent, setGameContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This would normally fetch from an API
    // For this example, we'll just use the sample data
    setLoading(true);
    
    try {
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
        variant: "destructive",
      });
    }
  }, [gameType, toast]);

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
      <div className="bg-background/80 p-2 border-b flex items-center">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto">
        {gameContent ? renderGameTemplate() : (
          <div className="flex items-center justify-center h-full">
            <p>Không có nội dung trò chơi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetGameManager;

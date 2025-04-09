
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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

// Import sample data for testing/development
import { quizSampleData } from './data/quizSampleData';
import { flashcardsSampleData } from './data/flashcardsSampleData';
import { matchingSampleData } from './data/matchingSampleData';
import { memorySampleData } from './data/memorySampleData';
import { orderingSampleData } from './data/orderingSampleData';
import { wordSearchSampleData } from './data/wordSearchSampleData';
import { pictionarySampleData } from './data/pictionarySampleData';
import { trueFalseSampleData } from './data/trueFalseSampleData';

// Import Gemini API 
import { GoogleGenerativeAI } from '@google/generative-ai';
import { tryGeminiGeneration } from '../generator/geminiGenerator';
import { GameSettingsData } from '../types';

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ gameType, onBack, initialTopic = "Học tiếng Việt" }) => {
  const [loading, setLoading] = useState(true);
  const [gameContent, setGameContent] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const generateAIContent = async (topic, type) => {
    setLoading(true);
    setError(null);
    
    try {
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
      
      // Use optimized Gemini generation approach
      const game = await tryGeminiGeneration(model, topic, settings);
      
      if (game && (game.content || Object.keys(game).length > 0)) {
        console.log(`Successfully generated ${type} game:`, game);
        
        // Handle direct JSON objects for certain game types
        if (typeof game.content === 'string') {
          if (game.content.trim().startsWith('{') && (
            type === 'matching' || type === 'quiz' || 
            type === 'flashcards' || type === 'wordsearch'
          )) {
            try {
              // Try to parse the JSON
              const parsedContent = JSON.parse(game.content);
              setGameContent(parsedContent);
            } catch (e) {
              console.error("Failed to parse game content as JSON:", e);
              setGameContent(game);
            }
          } else {
            setGameContent(game);
          }
        } else {
          setGameContent(game);
        }
        
        toast({
          title: "Đã tạo trò chơi",
          description: `Trò chơi ${getGameTypeName(type)} đã được tạo với AI.`,
        });
      } else {
        throw new Error("Không thể tạo nội dung game");
      }
    } catch (err) {
      console.error("AI Error:", err);
      setError('Không thể tạo nội dung với AI. Vui lòng thử lại sau.');
      toast({
        title: "Lỗi AI",
        description: "Không thể tạo nội dung. Đang chuyển sang dùng dữ liệu mẫu.",
        variant: "destructive"
      });
      
      // Fall back to sample data
      loadSampleData(type);
    } finally {
      setLoading(false);
    }
  };

  const getGameTypeName = (type) => {
    switch (type) {
      case 'quiz': return 'Trắc Nghiệm';
      case 'flashcards': return 'Thẻ Ghi Nhớ';
      case 'matching': return 'Nối Từ';
      case 'memory': return 'Trò Chơi Ghi Nhớ';
      case 'ordering': return 'Sắp Xếp Câu';
      case 'wordsearch': return 'Tìm Từ';
      case 'pictionary': return 'Đoán Hình';
      case 'truefalse': return 'Đúng hay Sai';
      default: return 'Trò Chơi';
    }
  };

  const loadSampleData = (type) => {
    // Fallback to sample data if AI fails
    switch(type) {
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
  };

  const handleRetry = () => {
    if (initialTopic && initialTopic.trim() !== "") {
      generateAIContent(initialTopic, gameType);
    } else {
      loadSampleData(gameType);
    }
  };

  useEffect(() => {
    // Sử dụng initialTopic từ props nếu có
    const aiPrompt = initialTopic;
    
    if (aiPrompt && aiPrompt.trim() !== "") {
      // Sử dụng AI để tạo nội dung nếu có prompt
      console.log(`Tạo game ${gameType} với prompt: "${aiPrompt}"`);
      generateAIContent(aiPrompt, gameType);
    } else {
      // Ngược lại sử dụng dữ liệu mẫu cho dev/test
      console.log(`Tải dữ liệu mẫu cho game ${gameType}`);
      loadSampleData(gameType);
      setLoading(false);
    }
  }, [gameType, initialTopic]);

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
          <p className="text-lg font-medium">Đang tạo trò chơi với AI...</p>
          <p className="text-sm text-muted-foreground mt-2">Việc này có thể mất vài giây</p>
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
          <div className="flex gap-2">
            <Button onClick={onBack}>Quay lại</Button>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
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

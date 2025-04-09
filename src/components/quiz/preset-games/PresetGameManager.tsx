
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
import { wordSearchSampleData, easyWordSearchData, hardWordSearchData } from './data/wordSearchSampleData';
import { pictionarySampleData } from './data/pictionarySampleData';
import { trueFalseSampleData } from './data/trueFalseSampleData';

// Import Gemini API 
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Game play count storage key
const GAME_PLAY_COUNT_KEY = 'lovable_game_play_count';

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ gameType, onBack, initialTopic = "Học tiếng Việt" }) => {
  const [loading, setLoading] = useState(true);
  const [gameContent, setGameContent] = useState(null);
  const [error, setError] = useState(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gamePlayCount, setGamePlayCount] = useState<number>(0);
  const { toast } = useToast();

  // Load and increment game play count
  useEffect(() => {
    // Load current count from localStorage
    try {
      const savedCount = localStorage.getItem(GAME_PLAY_COUNT_KEY);
      const currentCount = savedCount ? parseInt(savedCount, 10) : 0;
      setGamePlayCount(currentCount);
      
      // Increment count only when a game is loaded
      if (!loading && gameContent) {
        const newCount = currentCount + 1;
        localStorage.setItem(GAME_PLAY_COUNT_KEY, newCount.toString());
        setGamePlayCount(newCount);
        console.log(`Game play count: ${newCount}`);
      }
    } catch (err) {
      console.error("Error tracking game count:", err);
    }
  }, [loading, gameContent]);

  // Track game start time
  useEffect(() => {
    if (!loading && gameContent && !gameStartTime) {
      setGameStartTime(Date.now());
    }
  }, [loading, gameContent, gameStartTime]);

  const generateAIContent = async (prompt, type) => {
    setLoading(true);
    setError(null);
    setGameStartTime(null); // Reset game start time
    
    try {
      const generationConfig = {
        temperature: 0.7,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 8000,
      };
      
      let gamePrompt = `Tạo nội dung cho trò chơi ${type} với yêu cầu sau: ${prompt}. Đầu ra phải là JSON hợp lệ. `;
      
      switch(type) {
        case 'quiz':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "questions": [{"question": "câu hỏi", "options": ["lựa chọn 1", "lựa chọn 2", "lựa chọn 3", "lựa chọn 4"], "correctAnswer": số_index_đáp_án_đúng, "explanation": "giải thích"}], "settings": {"timePerQuestion": 30, "totalTime": 300} }`;
          break;
        case 'flashcards':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "cards": [{"front": "mặt trước", "back": "mặt sau", "hint": "gợi ý (nếu có)"}], "settings": {"autoFlip": true, "flipTime": 5, "totalTime": 180} }`;
          break;
        case 'matching':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "pairs": [{"left": "nội dung bên trái", "right": "nội dung bên phải"}], "settings": {"timeLimit": 60, "bonusTimePerMatch": 5} }`;
          break;
        case 'memory':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "cards": [{"id": số_id, "content": "nội dung", "matched": false, "flipped": false}], "settings": {"timeLimit": 120, "allowHints": true, "hintPenalty": 5} }`;
          break;
        case 'ordering':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "sentences": [{"words": ["từ 1", "từ 2", "từ 3"], "correctOrder": [0, 1, 2]}], "settings": {"timeLimit": 180, "showHints": true, "bonusTimePerCorrect": 10} }`;
          break;
        case 'wordsearch':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "description": "mô tả", "words": [{"word": "từ 1", "found": false}, {"word": "từ 2", "found": false}], "grid": [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]], "settings": {"timeLimit": 300, "allowDiagonalWords": true, "showWordList": true, "bonusTimePerWord": 15} }`;
          break;
        case 'pictionary':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "items": [{"imageUrl": "URL hình ảnh", "answer": "đáp án", "options": ["lựa chọn 1", "lựa chọn 2", "lựa chọn 3", "lựa chọn 4"], "hint": "gợi ý"}], "settings": {"timePerQuestion": 20, "showHints": true, "totalTime": 240} }`;
          break;
        case 'truefalse':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "questions": [{"statement": "phát biểu", "isTrue": true/false, "explanation": "giải thích"}], "settings": {"timePerQuestion": 15, "showExplanation": true, "totalTime": 150} }`;
          break;
      }
      
      gamePrompt += " Chỉ trả về JSON, không có văn bản phụ.";
      
      console.log("Sending prompt to Gemini:", gamePrompt);
      
      const result = await model.generateContent(gamePrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Received response from Gemini:", text);
      
      try {
        // Extract JSON if wrapped in backticks
        const jsonStr = text.includes('```json') 
          ? text.split('```json')[1].split('```')[0].trim() 
          : text.includes('```') 
            ? text.split('```')[1].split('```')[0].trim() 
            : text;
            
        console.log("Parsed JSON string:", jsonStr);
        
        const parsedContent = JSON.parse(jsonStr);
        
        // Ensure time settings are present
        if (!parsedContent.settings) {
          parsedContent.settings = {};
        }
        
        // Apply default time settings if not provided
        switch(type) {
          case 'quiz':
            if (!parsedContent.settings.timePerQuestion) parsedContent.settings.timePerQuestion = 30;
            if (!parsedContent.settings.totalTime) parsedContent.settings.totalTime = parsedContent.questions.length * parsedContent.settings.timePerQuestion;
            break;
          case 'flashcards':
            if (!parsedContent.settings.flipTime) parsedContent.settings.flipTime = 5;
            if (!parsedContent.settings.totalTime) parsedContent.settings.totalTime = 180;
            break;
          case 'matching':
          case 'memory':
          case 'ordering':
          case 'wordsearch':
            if (!parsedContent.settings.timeLimit) parsedContent.settings.timeLimit = 120;
            break;
          case 'pictionary':
          case 'truefalse':
            if (!parsedContent.settings.timePerQuestion) parsedContent.settings.timePerQuestion = 15;
            if (!parsedContent.settings.totalTime) parsedContent.settings.totalTime = parsedContent.questions.length * parsedContent.settings.timePerQuestion;
            break;
        }
        
        setGameContent(parsedContent);
        return parsedContent;
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        toast({
          title: "Lỗi định dạng",
          description: "AI tạo phản hồi không đúng định dạng. Vui lòng thử lại.",
          variant: "destructive"
        });
        throw new Error('Lỗi định dạng phản hồi AI');
      }
    } catch (err) {
      console.error("AI Error:", err);
      setError('Không thể tạo nội dung với AI. Vui lòng thử lại sau.');
      toast({
        title: "Lỗi AI",
        description: "Không thể tạo nội dung. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      
      // Fall back to sample data
      loadSampleData(type);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = (type) => {
    // Fallback to sample data if AI fails
    let data = null;
    
    switch(type) {
      case 'quiz':
        data = quizSampleData;
        break;
      case 'flashcards':
        data = flashcardsSampleData;
        break;
      case 'matching':
        data = matchingSampleData;
        break;
      case 'memory':
        data = memorySampleData;
        break;
      case 'ordering':
        data = orderingSampleData;
        break;
      case 'wordsearch':
        // Choose difficulty based on topic keyword if present
        if (initialTopic?.toLowerCase().includes('dễ') || initialTopic?.toLowerCase().includes('easy')) {
          data = easyWordSearchData;
        } else if (initialTopic?.toLowerCase().includes('khó') || initialTopic?.toLowerCase().includes('hard')) {
          data = hardWordSearchData;
        } else {
          data = wordSearchSampleData;
        }
        break;
      case 'pictionary':
        data = pictionarySampleData;
        break;
      case 'truefalse':
        data = trueFalseSampleData;
        break;
      default:
        data = quizSampleData;
    }
    
    // Ensure time settings are present in sample data
    if (data && !data.settings) {
      data.settings = {};
    }
    
    // Add default time settings to sample data if missing
    switch(type) {
      case 'quiz':
        if (!data.settings.timePerQuestion) data.settings.timePerQuestion = 30;
        if (!data.settings.totalTime) data.settings.totalTime = data.questions.length * data.settings.timePerQuestion;
        break;
      case 'flashcards':
        if (!data.settings.flipTime) data.settings.flipTime = 5;
        if (!data.settings.totalTime) data.settings.totalTime = 180;
        break;
      case 'matching':
      case 'memory':
      case 'ordering':
      case 'wordsearch':
        if (!data.settings.timeLimit) data.settings.timeLimit = 120;
        break;
      case 'pictionary':
      case 'truefalse':
        if (!data.settings.timePerQuestion) data.settings.timePerQuestion = 15;
        if (!data.settings.totalTime) data.settings.totalTime = data.questions ? data.questions.length * data.settings.timePerQuestion : 150;
        break;
    }
    
    setGameContent(data);
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
      {gamePlayCount > 0 && (
        <div className="absolute top-2 right-4 bg-primary/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-10">
          Lượt đã chơi: {gamePlayCount}
        </div>
      )}
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

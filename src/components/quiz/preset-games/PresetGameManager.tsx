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

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const PresetGameManager = ({ gameType, onBack, initialTopic = "Học tiếng Việt" }) => {
  const [loading, setLoading] = useState(true);
  const [gameContent, setGameContent] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const generateAIContent = async (prompt, type) => {
    setLoading(true);
    setError(null);
    
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
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "questions": [{"question": "câu hỏi", "options": ["lựa chọn 1", "lựa chọn 2", "lựa chọn 3", "lựa chọn 4"], "correctIndex": số_index_đáp_án_đúng, "explanation": "giải thích"}] }`;
          break;
        case 'flashcards':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "cards": [{"front": "mặt trước", "back": "mặt sau", "hint": "gợi ý (nếu có)"}] }`;
          break;
        case 'matching':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "pairs": [{"left": "nội dung bên trái", "right": "nội dung bên phải"}] }`;
          break;
        case 'memory':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "pairs": [{"text": "nội dung", "id": "id duy nhất"}] }`;
          break;
        case 'ordering':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "sentences": [{"original": "câu gốc", "words": ["từ 1", "từ 2", "từ 3"]}] }`;
          break;
        case 'wordsearch':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "words": ["từ 1", "từ 2", "từ 3"], "grid": [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]], "solution": [{"word": "từ", "start": {"row": 0, "col": 0}, "end": {"row": 0, "col": 2}}] }`;
          break;
        case 'pictionary':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "items": [{"word": "từ cần đoán", "clue": "gợi ý", "imageDescription": "mô tả chi tiết hình ảnh"}] }`;
          break;
        case 'truefalse':
          gamePrompt += `JSON có định dạng: { "title": "tiêu đề", "statements": [{"text": "phát biểu", "isTrue": true/false, "explanation": "giải thích"}] }`;
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

  useEffect(() => {
    // Get game content from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const aiPrompt = urlParams.get('prompt');
    
    if (aiPrompt) {
      // If we have a prompt in URL, use AI to generate content
      generateAIContent(aiPrompt, gameType);
    } else {
      // Otherwise use sample data for testing/development
      loadSampleData(gameType);
      setLoading(false);
    }
  }, [gameType]);

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

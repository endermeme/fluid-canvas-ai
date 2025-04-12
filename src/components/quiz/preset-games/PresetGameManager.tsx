import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import gameTemplates from './templates';
import { useToast } from '@/hooks/use-toast';
import GameSettings from '../GameSettings';
import GameLoading from '../GameLoading';
import { GameSettingsData } from '../types';
import { Card } from '@/components/ui/card';
import GameShareButtons from '../share/GameShareButtons';

// Import Gemini API 
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ gameType, onBack, initialTopic = "Learn interactively" }) => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [gameContent, setGameContent] = useState(null);
  const [error, setError] = useState(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState<GameSettingsData>({
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
    totalTime: 0,
    bonusTime: 5,
    useTimer: true,
    prompt: initialTopic || "Learn interactively"
  });
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  // Track game start time
  useEffect(() => {
    if (!loading && gameContent && !gameStartTime) {
      setGameStartTime(Date.now());
    }
  }, [loading, gameContent, gameStartTime]);

  const generateAIContent = async (prompt, type, gameSettings: GameSettingsData) => {
    setGenerating(true);
    setError(null);
    setGameStartTime(null); // Reset game start time
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 4 + 1;
      });
    }, 300);
    
    try {
      const generationConfig = {
        temperature: 0.7,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 8000,
      };
      
      // Incorporate settings into the prompt
      const difficultyLevel = gameSettings.difficulty;
      const questionCount = gameSettings.questionCount;
      const timePerQuestion = gameSettings.timePerQuestion;
      const category = gameSettings.category;
      const totalTime = gameSettings.totalTime;
      const bonusTime = gameSettings.bonusTime;
      const promptContent = gameSettings.prompt || prompt;
      
      let gamePrompt = `Create content for a ${type} game with the following requirements:
- Topic: ${promptContent}
- Difficulty: ${difficultyLevel}
- Number of items: ${questionCount}
- Time per item: ${timePerQuestion} seconds
- Category: ${category}
- Total time limit: ${totalTime || 'not specified'} seconds
- Bonus time: ${bonusTime || 'not specified'} seconds

Output must be valid JSON. `;
      
      switch(type) {
        case 'quiz':
          gamePrompt += `JSON format: { "title": "title", "questions": [{"question": "question", "options": ["option 1", "option 2", "option 3", "option 4"], "correctAnswer": correct_answer_index, "explanation": "explanation"}], "settings": {"timePerQuestion": ${timePerQuestion}, "totalTime": ${totalTime || questionCount * timePerQuestion}, "bonusTimePerCorrect": ${bonusTime || 5}} }`;
          break;
        case 'flashcards':
          gamePrompt += `JSON format: { "title": "title", "cards": [{"front": "front", "back": "back", "hint": "hint (if any)"}], "settings": {"autoFlip": true, "flipTime": ${timePerQuestion}, "totalTime": ${totalTime || 180}} }`;
          break;
        case 'matching':
          gamePrompt += `JSON format: { "title": "title", "pairs": [{"left": "left content", "right": "right content"}], "settings": {"timeLimit": ${totalTime || 60}, "bonusTimePerMatch": ${bonusTime || 5}} }`;
          break;
        case 'memory':
          gamePrompt += `JSON format: { "title": "title", "cards": [{"id": id_number, "content": "content", "matched": false, "flipped": false}], "settings": {"timeLimit": ${totalTime || 120}, "allowHints": true, "hintPenalty": ${bonusTime || 5}} }`;
          break;
        case 'ordering':
          gamePrompt += `JSON format: { "title": "title", "sentences": [{"words": ["word 1", "word 2", "word 3"], "correctOrder": [0, 1, 2]}], "settings": {"timeLimit": ${totalTime || 180}, "showHints": true, "bonusTimePerCorrect": ${bonusTime || 10}} }`;
          break;
        case 'wordsearch':
          gamePrompt += `JSON format: { "title": "title", "description": "description", "words": [{"word": "word 1", "found": false}, {"word": "word 2", "found": false}], "grid": [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]], "settings": {"timeLimit": ${totalTime || 300}, "allowDiagonalWords": true, "showWordList": true, "bonusTimePerWord": ${bonusTime || 15}} }`;
          break;
        case 'pictionary':
          gamePrompt += `JSON format: { "title": "title", "items": [{"imageUrl": "image URL", "answer": "answer", "options": ["option 1", "option 2", "option 3", "option 4"], "hint": "hint"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showHints": true, "totalTime": ${totalTime || questionCount * timePerQuestion}} }`;
          break;
        case 'truefalse':
          gamePrompt += `JSON format: { "title": "title", "questions": [{"statement": "statement", "isTrue": true/false, "explanation": "explanation"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showExplanation": true, "totalTime": ${totalTime || questionCount * timePerQuestion}, "bonusTimePerCorrect": ${bonusTime || 3}} }`;
          break;
      }
      
      gamePrompt += " Return only JSON, no additional text.";
      
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
        
        // Ensure time settings are present and match user settings
        if (!parsedContent.settings) {
          parsedContent.settings = {};
        }
        
        // Apply settings from user input
        switch(type) {
          case 'quiz':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            parsedContent.settings.bonusTimePerCorrect = bonusTime || 5;
            break;
          case 'flashcards':
            parsedContent.settings.flipTime = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || 180;
            break;
          case 'matching':
          case 'memory':
            parsedContent.settings.timeLimit = totalTime || 120;
            break;
          case 'ordering':
            parsedContent.settings.timeLimit = totalTime || 180;
            parsedContent.settings.bonusTimePerCorrect = bonusTime || 10;
            break;
          case 'wordsearch':
            parsedContent.settings.timeLimit = totalTime || 300;
            parsedContent.settings.bonusTimePerWord = bonusTime || 15;
            break;
          case 'pictionary':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            break;
          case 'truefalse':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            parsedContent.settings.bonusTimePerCorrect = bonusTime || 3;
            break;
        }
        
        // Clear generation progress interval and set to 100%
        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        // Delay a bit to show 100% before completing
        setTimeout(() => {
          setGenerating(false);
          setLoading(false);
          setGameContent(parsedContent);
        }, 500);
        
        return parsedContent;
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        clearInterval(progressInterval);
        toast({
          title: "Lỗi định dạng",
          description: "AI tạo phản hồi không hợp lệ. Vui lòng thử lại.",
          variant: "destructive"
        });
        throw new Error('AI response format error');
      }
    } catch (err) {
      console.error("AI Error:", err);
      clearInterval(progressInterval);
      setError('Không thể tạo nội dung với AI. Vui lòng thử lại sau.');
      toast({
        title: "Lỗi AI",
        description: "Không thể tạo nội dung. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      
      // Fall back to sample data
      loadSampleData(type);
    } finally {
      setGenerating(false);
    }
  };

  const loadSampleData = (type) => {
    // Dynamically import sample data based on type
    import(`./data/${type}SampleData.ts`).then(module => {
      let data = null;
      
      // Determine which data to use based on type and difficulty keywords in the topic
      if (type === 'wordsearch' && initialTopic) {
        const lowerTopic = initialTopic.toLowerCase();
        if (lowerTopic.includes('easy') || lowerTopic.includes('simple')) {
          data = module.easyWordSearchData || module.default || module[`${type}SampleData`];
        } else if (lowerTopic.includes('hard') || lowerTopic.includes('difficult')) {
          data = module.hardWordSearchData || module.default || module[`${type}SampleData`];
        } else {
          data = module.default || module[`${type}SampleData`];
        }
      } else {
        data = module.default || module[`${type}SampleData`];
      }
      
      // Apply user settings to sample data
      if (data) {
        if (!data.settings) {
          data.settings = {};
        }
        
        // Apply settings from user input
        switch(type) {
          case 'quiz':
            data.settings.timePerQuestion = settings.timePerQuestion;
            data.settings.totalTime = settings.totalTime || settings.questionCount * settings.timePerQuestion;
            data.settings.bonusTimePerCorrect = settings.bonusTime || 5;
            break;
          case 'flashcards':
            data.settings.flipTime = settings.timePerQuestion;
            data.settings.totalTime = settings.totalTime || 180;
            break;
          case 'matching':
          case 'memory':
            data.settings.timeLimit = settings.totalTime || 120;
            break;
          case 'ordering':
            data.settings.timeLimit = settings.totalTime || 180;
            data.settings.bonusTimePerCorrect = settings.bonusTime || 10;
            break;
          case 'wordsearch':
            data.settings.timeLimit = settings.totalTime || 300;
            data.settings.bonusTimePerWord = settings.bonusTime || 15;
            break;
          case 'pictionary':
            data.settings.timePerQuestion = settings.timePerQuestion;
            data.settings.totalTime = settings.totalTime || settings.questionCount * settings.timePerQuestion;
            break;
          case 'truefalse':
            data.settings.timePerQuestion = settings.timePerQuestion;
            data.settings.totalTime = settings.totalTime || settings.questionCount * settings.timePerQuestion;
            data.settings.bonusTimePerCorrect = settings.bonusTime || 3;
            break;
        }
      }
      
      setLoading(false);
      setGameContent(data);
    }).catch(err => {
      console.error(`Error loading sample data for ${type}:`, err);
      setError(`Không thể tải dữ liệu mẫu cho ${type}. Vui lòng thử lại.`);
      setLoading(false);
    });
  };

  const handleRetry = () => {
    if (initialTopic && initialTopic.trim() !== "") {
      generateAIContent(initialTopic, gameType, settings);
    } else {
      loadSampleData(gameType);
    }
  };

  const handleStartGame = (gameSettings: GameSettingsData) => {
    setSettings(gameSettings);
    setShowSettings(false);
    setLoading(true);
    
    // Use prompt from settings
    const aiPrompt = gameSettings.prompt || initialTopic;
    
    if (aiPrompt && aiPrompt.trim() !== "") {
      // Use AI to generate content if prompt exists
      console.log(`Creating ${gameType} game with prompt: "${aiPrompt}" and settings:`, gameSettings);
      toast({
        title: "Đang tạo trò chơi",
        description: `Đang tạo trò chơi dạng ${getGameTypeName()} với các cài đặt đã chọn.`,
      });
      generateAIContent(aiPrompt, gameType, gameSettings);
    } else {
      // Otherwise use sample data for dev/test
      console.log(`Loading sample data for ${gameType} game with settings:`, gameSettings);
      loadSampleData(gameType);
    }
  };

  const getGameTypeName = () => {
    switch (gameType) {
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

  const renderGameTemplate = () => {
    const topic = initialTopic || "Chủ đề chung";
    const Template = gameTemplates[gameType];
    
    if (Template) {
      return <Template content={gameContent} topic={topic} onBack={onBack} />;
    }
    
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6 max-w-md">
          <p>Không tìm thấy mẫu cho loại game: {gameType}</p>
          <Button onClick={onBack} className="mt-4">Quay lại</Button>
        </Card>
      </div>
    );
  };

  const getGameTypeObject = () => {
    const gameTypeMap = {
      'quiz': {
        id: 'quiz',
        name: 'Trắc Nghiệm',
        description: 'Trò chơi trắc nghiệm với nhiều lựa chọn',
        icon: 'brain-circuit',
        defaultSettings: settings
      },
      'flashcards': {
        id: 'flashcards',
        name: 'Thẻ Ghi Nhớ',
        description: 'Thẻ lật hai mặt để học và ghi nhớ thông tin',
        icon: 'light-bulb',
        defaultSettings: settings
      },
      'matching': {
        id: 'matching',
        name: 'Nối Từ',
        description: 'Nối các cặp từ tương ứng với nhau',
        icon: 'puzzle-piece',
        defaultSettings: settings
      },
      'memory': {
        id: 'memory',
        name: 'Trò Chơi Ghi Nhớ',
        description: 'Lật và ghép cặp các thẻ giống nhau',
        icon: 'brain-circuit',
        defaultSettings: settings
      },
      'ordering': {
        id: 'ordering',
        name: 'Sắp Xếp Câu',
        description: 'Sắp xếp các từ theo thứ tự đúng',
        icon: 'dices',
        defaultSettings: settings
      },
      'wordsearch': {
        id: 'wordsearch',
        name: 'Tìm Từ',
        description: 'Tìm các từ ẩn trong bảng chữ cái',
        icon: 'pen-tool',
        defaultSettings: settings
      },
      'pictionary': {
        id: 'pictionary', 
        name: 'Đoán Hình',
        description: 'Chọn đáp án đúng dựa trên hình ảnh',
        icon: 'heart-handshake',
        defaultSettings: settings
      },
      'truefalse': {
        id: 'truefalse',
        name: 'Đúng hay Sai',
        description: 'Kiểm tra kiến thức với các câu hỏi đúng/sai',
        icon: 'clock',
        defaultSettings: settings
      }
    };
    
    return gameTypeMap[gameType] || null;
  };

  if (showSettings) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Cài đặt trò chơi {getGameTypeName()}</h2>
        <GameSettings
          onStart={handleStartGame}
          topic={initialTopic || ""}
          initialSettings={settings}
          gameType={getGameTypeObject()}
          onCancel={onBack}
        />
      </div>
    );
  }

  if (generating) {
    return <GameLoading topic={initialTopic || ""} progress={generationProgress} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Đang tạo trò chơi {getGameTypeName()}...</p>
          <p className="text-sm text-muted-foreground mt-2">Quá trình này có thể mất vài giây</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="p-6 max-w-md">
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
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        {gameContent ? (
          <>
            <div className="flex justify-end p-4">
              <GameShareButtons 
                gameId={`preset-${gameType}`}
                shareUrl={`${window.location.origin}/game/preset/${gameType}?topic=${encodeURIComponent(initialTopic || "")}`}
                title={`${getGameTypeName()} - ${initialTopic || "Chơi game"}`}
              />
            </div>
            {renderGameTemplate()}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="p-6 max-w-md">
              <p className="text-center">Không có nội dung trò chơi</p>
              <div className="flex justify-center mt-4">
                <Button onClick={onBack}>Quay lại</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetGameManager;

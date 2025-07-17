import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Share2 } from 'lucide-react';
import gameTemplates from './templates';
import { useToast } from '@/hooks/use-toast';
import { 
  QuizSettings, 
  FlashcardsSettings, 
  MemorySettings, 
  MatchingSettings, 
  OrderingSettings, 
  WordSearchSettings, 
  TrueFalseSettings 
} from './settings';
import GameLoading from '../GameLoading';
import { GameSettingsData } from '../types';
import { Card } from '@/components/ui/card';
import { saveGameForSharing } from '@/utils/gameExport';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import PresetGameHeader from './PresetGameHeader';

import { 
  GEMINI_API_KEY, 
  GEMINI_MODELS, 
  getApiEndpoint, 
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';

// Import static data for all games
import { quizSampleData } from './data/quizSampleData';
import { flashcardsSampleData } from './data/flashcardsSampleData';
import { matchingSampleData } from './data/matchingSampleData';
import { memorySampleData } from './data/memorySampleData';
import { orderingSampleData } from './data/orderingSampleData';
import { wordSearchSampleData, easyWordSearchData, hardWordSearchData } from './data/wordSearchSampleData';
import { trueFalseSampleData } from './data/trueFalseSampleData';

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
  const [settings, setSettings] = useState<any>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && gameContent && !gameStartTime) {
      setGameStartTime(Date.now());
    }
  }, [loading, gameContent, gameStartTime]);

  const generateAIContent = async (prompt, type, gameSettings: GameSettingsData) => {
    setGenerating(true);
    setError(null);
    setGameStartTime(null);

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
        case 'truefalse':
          gamePrompt += `JSON format: { "title": "title", "questions": [{"statement": "statement", "isTrue": true/false, "explanation": "explanation"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showExplanation": true, "totalTime": ${totalTime || questionCount * timePerQuestion}, "bonusTimePerCorrect": ${bonusTime || 3}} }`;
          break;
      }

      gamePrompt += " Return only JSON, no additional text.";

      console.log("Sending prompt to Gemini:", gamePrompt);

      const payload = {
        contents: [{
          role: "user",
          parts: [{text: gamePrompt}]
        }],
        generationConfig: {
          ...DEFAULT_GENERATION_SETTINGS,
          temperature: 0.7
        }
      };

      const response = await fetch(getApiEndpoint(GEMINI_MODELS.PRESET_GAME), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('No content returned from API');
      }

      console.log("Received response from Gemini:", text);

      try {
        const jsonStr = text.includes('```json') 
          ? text.split('```json')[1].split('```')[0].trim() 
          : text.includes('```') 
            ? text.split('```')[1].split('```')[0].trim() 
            : text;

        console.log("Parsed JSON string:", jsonStr);

        const parsedContent = JSON.parse(jsonStr);

        if (!parsedContent.settings) {
          parsedContent.settings = {};
        }

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
          case 'truefalse':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            parsedContent.settings.bonusTimePerCorrect = bonusTime || 3;
            break;
        }

        clearInterval(progressInterval);
        setGenerationProgress(100);

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

      setLoading(false);
      setGameContent(null);
    } finally {
      setGenerating(false);
    }
  };

  const loadSampleData = (type) => {
    let data = null;

    // Get sample data based on game type
    switch (type) {
      case 'quiz':
        data = { ...quizSampleData };
        data.settings = {
          ...data.settings,
          timePerQuestion: settings.timePerQuestion,
          totalTime: settings.totalTime || settings.questionCount * settings.timePerQuestion
        };
        break;
      
      case 'flashcards':
        data = { ...flashcardsSampleData };
        data.settings = {
          ...data.settings,
          flipTime: settings.timePerQuestion,
          totalTime: settings.totalTime || 180
        };
        break;
      
      case 'matching':
        data = { ...matchingSampleData };
        data.settings = {
          ...data.settings,
          timeLimit: settings.totalTime || 120,
          bonusTimePerMatch: settings.bonusTime || 5
        };
        break;
      
      case 'memory':
        data = { ...memorySampleData };
        data.settings = {
          ...data.settings,
          timeLimit: settings.totalTime || 120,
          allowHints: true,
          hintPenalty: settings.bonusTime || 5
        };
        break;
      
      case 'ordering':
        data = { ...orderingSampleData };
        data.settings = {
          ...data.settings,
          timeLimit: settings.totalTime || 180,
          bonusTimePerCorrect: settings.bonusTime || 10
        };
        break;
      
      case 'wordsearch':
        if (initialTopic) {
          const lowerTopic = initialTopic.toLowerCase();
          if (lowerTopic.includes('easy') || lowerTopic.includes('simple')) {
            data = { ...easyWordSearchData };
          } else if (lowerTopic.includes('hard') || lowerTopic.includes('difficult')) {
            data = { ...hardWordSearchData };
          } else {
            data = { ...wordSearchSampleData };
          }
        } else {
          data = { ...wordSearchSampleData };
        }
        data.settings = {
          ...data.settings,
          timeLimit: settings.totalTime || 300,
          bonusTimePerWord: settings.bonusTime || 15
        };
        break;
      
      case 'truefalse':
        data = { ...trueFalseSampleData };
        data.settings = {
          ...data.settings,
          timePerQuestion: settings.timePerQuestion,
          totalTime: settings.totalTime || settings.questionCount * settings.timePerQuestion,
          bonusTimePerCorrect: settings.bonusTime || 3
        };
        break;
      
      default:
        setError(`Không có dữ liệu mẫu cho game ${getGameTypeName()}. Vui lòng sử dụng AI để tạo nội dung.`);
        setLoading(false);
        return;
    }

    if (data) {
      setLoading(false);
      setGameContent(data);
    } else {
      setError(`Không thể tải dữ liệu mẫu cho ${getGameTypeName()}. Vui lòng thử lại.`);
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (initialTopic && initialTopic.trim() !== "") {
      generateAIContent(initialTopic, gameType, settings);
    } else {
      loadSampleData(gameType);
    }
  };

  const handleStartGame = (gameSettings: any) => {
    setSettings(gameSettings);
    setShowSettings(false);
    setLoading(true);

    // Check if debug mode is enabled
    if (gameSettings.debugMode) {
      console.log(`Debug mode enabled - Loading sample data for ${gameType} game`);
      toast({
        title: "Debug Mode",
        description: `Đang tải dữ liệu mẫu cho ${getGameTypeName()} (Debug Mode)`,
        variant: "default"
      });
      loadSampleData(gameType);
      return;
    }

    const aiPrompt = gameSettings.prompt || initialTopic;

    if (aiPrompt && aiPrompt.trim() !== "") {
      console.log(`Creating ${gameType} game with prompt: "${aiPrompt}" and settings:`, gameSettings);
      toast({
        title: "Đang tạo trò chơi",
        description: `Đang tạo trò chơi dạng ${getGameTypeName()} với các cài đặt đã chọn.`,
      });
      generateAIContent(aiPrompt, gameType, gameSettings);
    } else {
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
      case 'truefalse': return 'Đúng hay Sai';
      default: return 'Trò Chơi';
    }
  };

  const renderGameTemplate = () => {
    const GameTemplate = gameTemplates[gameType];

    if (!GameTemplate) {
      return <div>Game type not supported</div>;
    }

    return (
      <GameTemplate 
        data={gameContent} 
        onBack={onBack}
        topic={initialTopic || ""}
        content={gameContent}
        settings={settings}
      />
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

  const handleShare = async () => {
    try {
      if (!gameContent) return;
      
      const gameContainer = document.getElementById('game-container');
      let html = gameContainer?.innerHTML || '';
      
      const encodedContent = encodeURIComponent(JSON.stringify(gameContent));
      html = `<div data-game-content="${encodedContent}">${html}</div>`;
      
      const shareUrl = await saveGameForSharing(
        gameContent.title || getGameTypeName(),
        gameType,
        gameContent,
        html
      );
      
      if (shareUrl) {
        setShareUrl(shareUrl);
        setShowShareDialog(true);
        
        toast({
          title: "Game đã được chia sẻ",
          description: "Đường dẫn đã được tạo để chia sẻ trò chơi.",
        });
      } else {
        toast({
          title: "Không thể chia sẻ game",
          description: "Đã xảy ra lỗi khi tạo đường dẫn. Vui lòng thử lại.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
      });
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {showSettings ? (
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex-shrink-0 border-b border-primary/10">
            <PresetGameHeader 
              showShare={false} 
              isGameCreated={false}
              onBack={onBack}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            {gameType === 'quiz' && <QuizSettings onStart={handleStartGame} topic={initialTopic} />}
            {gameType === 'flashcards' && <FlashcardsSettings onStart={handleStartGame} topic={initialTopic} />}
            {gameType === 'memory' && <MemorySettings onStart={handleStartGame} topic={initialTopic} />}
            {gameType === 'matching' && <MatchingSettings onStart={handleStartGame} topic={initialTopic} />}
            {gameType === 'ordering' && <OrderingSettings onStart={handleStartGame} topic={initialTopic} />}
            {gameType === 'wordsearch' && <WordSearchSettings onStart={handleStartGame} topic={initialTopic} />}
            {gameType === 'truefalse' && <TrueFalseSettings onStart={handleStartGame} topic={initialTopic} />}
          </div>
        </div>
      ) : generating ? (
        <div className="h-full">
          <GameLoading topic={initialTopic || ""} progress={generationProgress} />
        </div>
      ) : loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 border-3 sm:border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-base sm:text-lg font-medium text-primary">Đang tạo trò chơi {getGameTypeName()}...</p>
            <p className="text-xs sm:text-sm text-primary/70 mt-2">Quá trình này có thể mất vài giây</p>
          </div>
        </div>
      ) : error ? (
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex-shrink-0 border-b border-primary/10">
            <PresetGameHeader 
              showShare={false} 
              isGameCreated={false}
              onBack={onBack}
            />
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="p-4 sm:p-6 max-w-sm sm:max-w-md w-full border-destructive/20">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-destructive">Đã xảy ra lỗi</h3>
                <p className="text-primary/70 mb-4 text-sm sm:text-base">{error}</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button onClick={onBack} variant="outline" className="w-full sm:flex-1">
                    Quay lại
                  </Button>
                  <Button onClick={handleRetry} className="w-full sm:flex-1">
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Thử lại
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex-shrink-0 border-b border-primary/10">
            <PresetGameHeader 
              onShare={handleShare}
              showShare={true}
              isGameCreated={!!gameContent}
              onBack={onBack}
            />
          </div>
          <div className="flex-1 overflow-hidden" id="game-container">
            {renderGameTemplate()}
          </div>
          
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary">Chia sẻ game</DialogTitle>
                <DialogDescription className="text-primary/70">
                  Chia sẻ game này với bạn bè để họ có thể tham gia chơi
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG value={shareUrl} size={200} />
                </div>
                
                <div className="w-full space-y-2">
                  <Label htmlFor="share-link" className="text-primary">Liên kết chia sẻ</Label>
                  <div className="flex">
                    <Input 
                      id="share-link" 
                      value={shareUrl} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button 
                      variant="outline" 
                      className="rounded-l-none"
                      onClick={handleCopyLink}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowShareDialog(false)}>Đóng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default PresetGameManager;

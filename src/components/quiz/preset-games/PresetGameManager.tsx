import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Share2 } from 'lucide-react';
import gameTemplates from './templates';
import { useToast } from '@/hooks/use-toast';
import GameSettings from '../GameSettings';
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
        case 'pictionary':
          gamePrompt += `JSON format: { "title": "title", "items": [{"imageUrl": "URL ảnh từ internet", "answer": "answer", "options": ["option 1", "option 2", "option 3", "option 4"], "hint": "hint"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showHints": true, "totalTime": ${totalTime || questionCount * timePerQuestion}} }

QUAN TRỌNG cho game Pictionary: 
- imageUrl PHẢI là URL ảnh thật từ internet dạng link
- Tìm ảnh từ các nguồn internet phù hợp với chủ đề
- KHÔNG sử dụng placeholder hay ảnh giả
- Mỗi ảnh phải phù hợp với đáp án và chủ đề`;
          break;
        case 'truefalse':
          gamePrompt += `JSON format: { "title": "title", "questions": [{"statement": "statement", "isTrue": true/false, "explanation": "explanation"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showExplanation": true, "totalTime": ${totalTime || questionCount * timePerQuestion}, "bonusTimePerCorrect": ${bonusTime || 3}} }`;
          break;
        case 'groupsort':
          gamePrompt += `JSON format: { "title": "title", "items": [{"id": "1", "text": "item text", "group": "group name"}], "groups": [{"id": "group1", "name": "Group Name", "items": []}], "settings": {"timeLimit": ${totalTime || 120}, "bonusTimePerCorrect": ${bonusTime || 10}} }

HƯỚNG DẪN CHI TIẾT cho game GroupSort:
- Tạo CHÍNH XÁC ${questionCount || 12} items để phân nhóm
- Tạo 3-4 groups phù hợp và cân bằng với chủ đề "${promptContent}"
- Mỗi item phải có: id duy nhất (item1, item2...), text mô tả rõ ràng, group chính xác
- Groups phải có: id duy nhất (group1, group2...), name rõ ràng, items array rỗng []
- Phân bố items ĐỀU NHAU giữa các groups (mỗi group 3-4 items)
- Items phải thú vị, đa dạng và liên quan chặt chẽ đến chủ đề
- Group names phải khác biệt rõ ràng, không gây nhầm lẫn

QUAN TRỌNG - YÊU CẦU VỀ TÊN:
- Tên items phải CHUẨN, RÕ RÀNG, DỨT KHOÁT
- KHÔNG dùng cụm từ khó hiểu, úp mở hay mơ hồ
- Tên phải đơn giản, dễ hiểu cho người chơi
- Ví dụ tốt: "Sư tử", "Táo", "Máy tính"
- Ví dụ tránh: "Sinh vật tuyệt vời", "Thứ ngọt ngào", "Công cụ hiện đại"

VÍ DỤ cụ thể với chủ đề "Động vật":
- Groups: "Động vật có vú", "Chim", "Cá", "Bò sát"
- Items: "Sư tử" (group: "Động vật có vú"), "Đại bàng" (group: "Chim")

VÍ DỤ với chủ đề "Học tập":
- Groups: "Phương pháp học", "Công cụ học tập", "Kỹ năng cần thiết"
- Items: "Đọc sách" (group: "Phương pháp học"), "Máy tính" (group: "Công cụ học tập")`;
          break;
        case 'spinwheel':
          gamePrompt += `JSON format: { "title": "title", "segments": [{"id": "1", "text": "segment text", "color": "#FF6B6B", "points": 10}], "settings": {"allowMultipleSpins": true, "maxSpins": 10}} }

HƯỚNG DẪN CHI TIẾT cho game SpinWheel:
- Tạo 6-8 segments cho vòng quay
- Mỗi segment phải có: id duy nhất, text ngắn gọn, color hex khác nhau, points (5-50)
- Colors gợi ý: "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FFB6C1", "#98FB98"
- Text phải liên quan đến chủ đề và ngắn (tối đa 15 ký tự)
- Points tăng dần theo độ khó: 10, 20, 30, 40, 50, 60
- Ví dụ chủ đề "Toán học": segments có thể là "Cộng", "Trừ", "Nhân", "Chia"

QUAN TRỌNG - YÊU CẦU VỀ TÊN:
- Text segments phải CHUẨN, RÕ RÀNG, DỨT KHOÁT  
- KHÔNG dùng từ khó hiểu hay mơ hồ
- Tên phải ngắn gọn, dễ đọc trên vòng quay`;
          break;
        case 'completesentence':
          gamePrompt += `JSON format: { "title": "title", "sentences": [{"sentence": "Sentence with _____ blanks", "blanks": ["word1", "word2"], "options": ["option1", "option2", "option3", "option4"]}], "settings": {"timePerQuestion": ${timePerQuestion}, "showHints": true, "totalTime": ${totalTime || questionCount * timePerQuestion}} }`;
          break;
        case 'anagram':
          gamePrompt += `JSON format: { "title": "title", "words": [{"id": "1", "original": "original word", "scrambled": "scrambled", "hint": "hint text"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showHints": true, "totalTime": ${totalTime || questionCount * timePerQuestion}} }`;
          break;
        case 'openbox':
          gamePrompt += `JSON format: { "title": "title", "boxes": [{"id": "1", "content": "box content", "type": "question/reward/challenge", "points": 10, "opened": false}], "settings": {"allowHints": true, "bonusTimePerBox": ${bonusTime || 5}} }

HƯỚNG DẪN CHI TIẾT cho game OpenBox:
- Tạo 9 boxes (3x3 grid)
- Mỗi box phải có: id duy nhất (1-9), content mô tả, type, points, opened: false
- Type distribution: 4 questions, 3 rewards, 2 challenges
- Questions: Câu hỏi liên quan chủ đề với points 10-20
- Rewards: "Phần thưởng: Bonus X điểm!" với points 15-30
- Challenges: "Thử thách: [hành động]" với points 20-25
- Content phải ngắn gọn và rõ ràng

QUAN TRỌNG - YÊU CẦU VỀ TÊN:
- Content phải CHUẨN, RÕ RÀNG, DỨT KHOÁT
- KHÔNG dùng cụm từ khó hiểu hay úp mở
- Ví dụ: {"id": "1", "content": "Câu hỏi: Thủ đô Việt Nam?", "type": "question", "points": 10, "opened": false}`;
          break;
        case 'speakingcards':
          gamePrompt += `JSON format: { "title": "title", "cards": [{"id": "1", "prompt": "speaking prompt", "category": "category", "difficulty": "easy/medium/hard", "timeLimit": 60}], "settings": {"defaultTimeLimit": ${timePerQuestion || 60}, "allowExtension": true}} }

HƯỚNG DẪN CHI TIẾT cho game SpeakingCards:
- Tạo ${questionCount || 8} thẻ luyện nói
- Mỗi card phải có: id duy nhất, prompt rõ ràng, category, difficulty, timeLimit
- Difficulty distribution: 30% easy, 50% medium, 20% hard
- Categories gợi ý: "Mô tả", "Thảo luận", "Kể chuyện", "Tranh luận"
- Prompts phải khuyến khích người chơi nói trong 30-90 giây
- Easy: Câu hỏi đơn giản, timeLimit 30-45s
- Medium: Câu hỏi phức tạp hơn, timeLimit 60s  
- Hard: Câu hỏi sâu sắc, timeLimit 90s

QUAN TRỌNG - YÊU CẦU VỀ TÊN:
- Prompts phải CHUẨN, RÕ RÀNG, DỨT KHOÁT
- KHÔNG dùng câu hỏi khó hiểu hay mơ hồ
- Ví dụ: {"id": "1", "prompt": "Mô tả món ăn yêu thích của bạn", "category": "Mô tả", "difficulty": "easy", "timeLimit": 45}`;
          break;
        case 'neuronpaths':
          gamePrompt += `JSON format: { "title": "title", "nodes": [{"id": "node1", "data": {"label": "concept name", "level": "basic|intermediate|advanced", "category": "category"}, "position": {"x": 100, "y": 100}, "type": "default"}], "settings": {"timeLimit": ${totalTime || 300}, "allowHints": true}} }

HƯỚNG DẪN CHI TIẾT cho game NeuronPaths:
- Tạo 8-12 nodes concepts cho neural map
- Mix levels: 40% basic, 40% intermediate, 20% advanced  
- Position nodes ngẫu nhiên trên canvas 800x600
- Concepts phải liên quan chặt chẽ đến chủ đề "${promptContent}"
- Có thể tạo kết nối logic giữa các concepts
- Categories gợi ý: "foundation", "application", "theory", "connection", "result"

QUAN TRỌNG - YÊU CẦU VỀ CONCEPTS:
- Label phải CHUẨN, RÕ RÀNG, DỨT KHOÁT
- KHÔNG dùng cụm từ khó hiểu hay mơ hồ  
- Concepts phải ngắn gọn, dễ hiểu (tối đa 20 ký tự)
- Ví dụ tốt: "Core Theory", "Method A", "Final Result"
- Ví dụ tránh: "Complex interconnected principle", "Advanced methodological approach"

VÍ DỤ cụ thể với chủ đề "Machine Learning":
- Basic: "Data Input", "Training", "Model"
- Intermediate: "Feature Selection", "Validation", "Optimization"  
- Advanced: "Deep Learning", "Neural Networks", "AI Ethics"

VÍ DỤ position:
- {"x": 150, "y": 100}, {"x": 400, "y": 150}, {"x": 600, "y": 200}
- Spread concepts across canvas, avoid clustering`;
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
          case 'pictionary':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            break;
          case 'truefalse':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            parsedContent.settings.bonusTimePerCorrect = bonusTime || 3;
            break;
          case 'neuronpaths':
            parsedContent.settings.timeLimit = totalTime || 300;
            parsedContent.settings.allowHints = true;
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
    const newGames = ['groupsort', 'spinwheel', 'completesentence', 'anagram', 'openbox', 'speakingcards', 'neuronpaths'];
    
    if (newGames.includes(type) || type === 'pictionary') {
      setError(`Không có dữ liệu mẫu cho game ${getGameTypeName()}. Vui lòng sử dụng AI để tạo nội dung.`);
      setLoading(false);
      return;
    }

    import(`./data/${type}SampleData.ts`).then(module => {
      let data = null;

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

      if (data) {
        if (!data.settings) {
          data.settings = {};
        }

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
      case 'pictionary': return 'Đoán Hình';
      case 'truefalse': return 'Đúng hay Sai';
      case 'groupsort': return 'Phân Nhóm';
      case 'spinwheel': return 'Vòng Quay May Mắn';
      case 'completesentence': return 'Hoàn Thành Câu';
      case 'anagram': return 'Đảo Chữ';
      case 'openbox': return 'Mở Hộp Bí Ẩn';
      case 'speakingcards': return 'Thẻ Luyện Nói';
      case 'neuronpaths': return 'Đường Dẫn Thần Kinh';
      default: return 'Trò Chơi';
    }
  };

  const renderGameTemplate = () => {
    const GameTemplate = gameTemplates[gameType];

    if (!GameTemplate) {
      return <div>Game type not supported</div>;
    }

    return (
      <div className="flex flex-col h-full">
        <GameTemplate 
          data={gameContent} 
          onBack={onBack} // Truyền onBack từ props thay vì handleRetry
          topic={initialTopic || ""}
          content={gameContent}
        />
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
      },
      'groupsort': {
        id: 'groupsort',
        name: 'Phân Nhóm',
        description: 'Phân nhóm các câu hỏi theo nhóm',
        icon: 'users',
        defaultSettings: settings
      },
      'spinwheel': {
        id: 'spinwheel',
        name: 'Vòng Quay May Mắn',
        description: 'Vòng quay may mắn với các phần thưởng',
        icon: 'dices',
        defaultSettings: settings
      },
      'completesentence': {
        id: 'completesentence',
        name: 'Hoàn Thành Câu',
        description: 'Hoàn thành câu hỏi với các từ trống',
        icon: 'pencil',
        defaultSettings: settings
      },
      'anagram': {
        id: 'anagram',
        name: 'Đảo Chữ',
        description: 'Đảo chữ của các từ',
        icon: 'pencil',
        defaultSettings: settings
      },
      'openbox': {
        id: 'openbox',
        name: 'Mở Hộp Bí Ẩn',
        description: 'Mở hộp bí ẩn với các phần thưởng',
        icon: 'box',
        defaultSettings: settings
      },
      'speakingcards': {
        id: 'speakingcards',
        name: 'Thẻ Luyện Nói',
        description: 'Thẻ luyện nói với các câu hỏi',
        icon: 'pencil',
        defaultSettings: settings
      },
      'neuronpaths': {
        id: 'neuronpaths',
        name: 'Đường Dẫn Thần Kinh',
        description: 'Tạo neural map với các nodes concepts',
        icon: 'brain-circuit',
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
    <div className="flex flex-col h-full">
      {showSettings ? (
        <div className="p-4">
          <PresetGameHeader 
            showShare={false} 
            isGameCreated={false}
            onBack={onBack}
          />
          <GameSettings 
            initialSettings={settings}
            onStart={handleStartGame}
            onCancel={onBack}
            topic={initialTopic || ""}
          />
        </div>
      ) : generating ? (
        <GameLoading topic={initialTopic || ""} progress={generationProgress} />
      ) : loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Đang tạo trò chơi {getGameTypeName()}...</p>
            <p className="text-sm text-muted-foreground mt-2">Quá trình này có thể mất vài giây</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full">
          <PresetGameHeader 
            showShare={false} 
            isGameCreated={false}
            onBack={onBack}
          />
          <Card className="p-6 max-w-md mt-4">
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
      ) : (
        <>
          <PresetGameHeader 
            onShare={handleShare}
            showShare={true}
            isGameCreated={!!gameContent}
            onBack={onBack}
          />
          {renderGameTemplate()}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Chia sẻ game</DialogTitle>
                <DialogDescription>
                  Chia sẻ game này với bạn bè để họ có thể tham gia chơi
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG value={shareUrl} size={200} />
                </div>
                
                <div className="w-full space-y-2">
                  <Label htmlFor="share-link">Liên kết chia sẻ</Label>
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
        </>
      )}
    </div>
  );
};

export default PresetGameManager;

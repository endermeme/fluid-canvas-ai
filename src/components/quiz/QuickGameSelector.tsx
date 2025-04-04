
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Gamepad, Settings, Puzzle, BrainCircuit, Clock4, 
  Dices, PenTool, HeartHandshake, Lightbulb, 
  Sparkles, Book, GraduationCap, School, Award, Globe, 
  MessageSquare, BookOpen, RotateCcw, Layers, FlaskConical, 
  Image, Shuffle, Check, X, Shapes, Zap, Target, Plane, SortAsc,
  Calculator, BadgeDollarSign, Blocks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import GameSettings from './GameSettings';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GameSettingsData, GameType } from './types';
import { animateBlockCreation } from '@/lib/animations';
import { Link } from 'react-router-dom';
import OpenAIKeyModal from './OpenAIKeyModal';
import { Input } from '@/components/ui/input';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuickGameSelectorProps {
  onGameRequest: (topic: string) => void;
  onToggleChat: () => void;
}

const QuickGameSelector: React.FC<QuickGameSelectorProps> = ({ onGameRequest, onToggleChat }) => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  
  const gameTypes: GameType[] = [
    {
      id: "quiz",
      name: "Trắc nghiệm",
      description: "Chuỗi câu hỏi trắc nghiệm có nhiều lựa chọn. Chọn đáp án đúng để tiếp tục qua câu tiếp theo.",
      icon: "award",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "flashcards",
      name: "Thẻ ghi nhớ",
      description: "Thẻ có nội dung ở một mặt (câu hỏi) và câu trả lời ở mặt còn lại. Tự kiểm tra bản thân bằng cách lật mặt sau xem đáp án.",
      icon: "rotate-ccw",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 12,
        timePerQuestion: 20,
        category: 'general',
      }
    },
    {
      id: "matchup",
      name: "Ghép cặp từ - nghĩa",
      description: "Các từ hoặc khái niệm và định nghĩa rời rạc. Kéo và thả từng từ vào đúng định nghĩa của nó.",
      icon: "puzzle",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 40,
        category: 'general',
      }
    },
    {
      id: "anagram",
      name: "Xáo chữ tạo từ",
      description: "Một từ hoặc cụm từ bị xáo trộn chữ cái. Kéo các chữ cái vào đúng vị trí để tạo ra từ/cụm từ đúng.",
      icon: "shuffle",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 45,
        category: 'general',
      }
    },
    {
      id: "speakingcards",
      name: "Thẻ nói",
      description: "Bộ bài gồm nhiều chủ đề hoặc câu hỏi. Rút ngẫu nhiên một thẻ và nói/diễn đạt ý tưởng theo nội dung trên thẻ.",
      icon: "message-square",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 60,
        category: 'general',
      }
    },
    {
      id: "findmatch",
      name: "Tìm cặp giống nhau",
      description: "Cặp thông tin bị trộn lẫn (từ + nghĩa, hình + tên). Nhấn vào hai mục khớp nhau để loại bỏ. Làm đến khi hết.",
      icon: "layers",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 3,
        category: 'general',
      }
    },
    {
      id: "unjumble",
      name: "Sắp xếp câu",
      description: "Một câu bị trộn lộn từ. Kéo và thả các từ để sắp xếp lại câu đúng ngữ pháp.",
      icon: "sort-asc",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 40,
        category: 'general',
      }
    },
    {
      id: "openbox",
      name: "Mở hộp bí ẩn",
      description: "Hộp được đánh số, mỗi hộp chứa một câu hỏi hoặc phần thưởng. Nhấn vào từng hộp để mở và xem nội dung bên trong.",
      icon: "blocks",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "spinwheel",
      name: "Xoay bánh xe",
      description: "Bánh xe có các lựa chọn ngẫu nhiên. Nhấn xoay và thực hiện nhiệm vụ ở ô đã dừng.",
      icon: "dices",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 12,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "groupsort",
      name: "Phân loại nhóm",
      description: "Các mục rời rạc thuộc nhiều nhóm khác nhau. Kéo và thả vào nhóm đúng (vd: động vật–đồ vật–thực vật).",
      icon: "layers",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 15,
        timePerQuestion: 45,
        category: 'general',
      }
    },
    {
      id: "matchpairs",
      name: "Ghép cặp hình",
      description: "Các ô ẩn, mỗi cặp là một sự khớp về nghĩa/hình/âm. Lật 2 ô một lượt, nếu trùng thì giữ lại, không thì úp xuống.",
      icon: "puzzle",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 3,
        category: 'general',
      }
    },
    {
      id: "sentence",
      name: "Hoàn thành câu",
      description: "Câu bị bỏ trống từ/cụm từ. Kéo thả đúng từ vào chỗ trống để hoàn chỉnh câu.",
      icon: "pen-tool",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "gameshow",
      name: "Đố vui kiểu gameshow",
      description: "Giống show truyền hình đố vui, có điểm số và áp lực thời gian. Trả lời đúng càng nhiều càng tốt, có thể có trợ giúp.",
      icon: "sparkles",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 20,
        category: 'general',
      }
    },
    {
      id: "fliptiles",
      name: "Lật thẻ",
      description: "Bộ thẻ hai mặt với nội dung liên quan. Nhấn lật từng thẻ để xem thông tin và tìm cặp/trả lời.",
      icon: "rotate-ccw",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 3,
        category: 'general',
      }
    },
    {
      id: "wordsearch",
      name: "Tìm từ trong bảng chữ",
      description: "Một lưới chữ cái có giấu các từ vựng. Tìm và tô đậm các từ được yêu cầu càng nhanh càng tốt.",
      icon: "book-open",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 120,
        category: 'general',
      }
    },
    {
      id: "spellword",
      name: "Đánh vần từ",
      description: "Một từ bị trống chữ. Kéo các chữ cái vào đúng vị trí để hoàn thành từ.",
      icon: "pen-tool",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 12,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "labelled",
      name: "Gắn nhãn hình ảnh",
      description: "Hình minh họa cần gắn nhãn đúng vị trí. Kéo các nhãn vào vị trí đúng trên sơ đồ/hình ảnh.",
      icon: "image",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 60,
        category: 'science',
      }
    },
    {
      id: "crossword",
      name: "Ô chữ",
      description: "Trò chơi giải ô chữ với gợi ý. Nhấn vào một ô, đọc gợi ý, rồi nhập từ đúng vào ô đó.",
      icon: "grid-3x3",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 15,
        timePerQuestion: 300,
        category: 'general',
      }
    },
    {
      id: "hangman",
      name: "Treo cổ chữ cái",
      description: "Đoán từng chữ cái để hoàn thành từ. Đoán sai nhiều lần là thua.",
      icon: "shapes",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 60,
        category: 'general',
      }
    },
    {
      id: "imagequiz",
      name: "Đố qua hình ảnh",
      description: "Hình ảnh dần hé lộ, ai bấm chuông đầu tiên sẽ được trả lời câu hỏi.",
      icon: "image",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 15,
        category: 'general',
      }
    },
    {
      id: "flyingfruit",
      name: "Trái cây bay",
      description: "Các đáp án bay ngang màn hình, bạn phải nhấn đúng khi thấy đáp án đúng.",
      icon: "zap",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 15,
        timePerQuestion: 3,
        category: 'general',
      }
    },
    {
      id: "truefalse",
      name: "Đúng hay sai",
      description: "Mỗi phát biểu xuất hiện nhanh, chọn đúng hoặc sai trong thời gian giới hạn.",
      icon: "check",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 15,
        timePerQuestion: 10,
        category: 'general',
      }
    },
    {
      id: "mazechase",
      name: "Rượt đuổi mê cung",
      description: "Điều khiển nhân vật chạy đến đáp án đúng, tránh va vào vật cản hoặc sai.",
      icon: "target",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 5,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "balloonpop",
      name: "Bắn bong bóng",
      description: "Bắn bong bóng chứa từ để kéo vào đúng định nghĩa.",
      icon: "zap",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 15,
        timePerQuestion: 2,
        category: 'general',
      }
    },
    {
      id: "whackamole",
      name: "Đập chuột chũi",
      description: "Chuột hiện lên từng con, đập đúng con mang đáp án chính xác.",
      icon: "gamepad",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 15,
        timePerQuestion: 2,
        category: 'general',
      }
    },
    {
      id: "memorize",
      name: "Xem và ghi nhớ",
      description: "Xem một loạt vật phẩm xuất hiện, sau đó chọn lại đúng các món đã thấy.",
      icon: "brain-circuit",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 3,
        category: 'general',
      }
    },
    {
      id: "airplane",
      name: "Máy bay đáp án",
      description: "Điều khiển máy bay bay qua đáp án đúng, né các đáp án sai.",
      icon: "plane",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 5,
        category: 'general',
      }
    },
    {
      id: "rankorder",
      name: "Xếp theo thứ tự",
      description: "Kéo và thả các mục theo thứ tự đúng (vd: từ nhỏ đến lớn, theo thời gian...).",
      icon: "sort-asc",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 45,
        category: 'general',
      }
    },
    {
      id: "winlosequiz",
      name: "Đố vui ăn điểm",
      description: "Chọn số điểm đặt cược cho từng câu, đúng thì được, sai thì mất điểm.",
      icon: "badge-dollar-sign",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "mathgenerator",
      name: "Tạo đề toán",
      description: "Chọn chủ đề toán học, hệ thống sẽ tạo ra loạt câu hỏi tự động.",
      icon: "calculator",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'math',
      }
    },
    {
      id: "wordmagnets",
      name: "Nam châm từ",
      description: "Kéo thả các từ hoặc chữ cái như nam châm để tạo thành câu hoàn chỉnh.",
      icon: "book-open",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 45,
        category: 'general',
      }
    },
  ];

  useEffect(() => {
    const gameButtons = containerRef.current?.querySelectorAll('.game-button');
    gameButtons?.forEach((button, index) => {
      setTimeout(() => {
        if (button instanceof HTMLElement) {
          animateBlockCreation(button);
        }
      }, index * 40); // Faster animation for more items
    });
  }, []);

  const handleTitleClick = () => {
    setTitleClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setTimeout(() => {
          setShowOpenAIKeyModal(true);
          return 0;
        }, 100);
      }
      return newCount;
    });
  };

  const handleSaveOpenAIKey = (key: string) => {
    gameGenerator.setOpenAIKey(key);
  };

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'brain-circuit': return <BrainCircuit size={28} />;
      case 'puzzle': return <Puzzle size={28} />;
      case 'lightbulb': return <Lightbulb size={28} />;
      case 'clock': return <Clock4 size={28} />;
      case 'dices': return <Dices size={28} />;
      case 'pen-tool': return <PenTool size={28} />;
      case 'book': return <Book size={28} />;
      case 'book-open': return <BookOpen size={28} />;
      case 'graduation-cap': return <GraduationCap size={28} />;
      case 'globe': return <Globe size={28} />;
      case 'award': return <Award size={28} />;
      case 'school': return <School size={28} />;
      case 'message-square': return <MessageSquare size={28} />;
      case 'rotate-ccw': return <RotateCcw size={28} />;
      case 'layers': return <Layers size={28} />;
      case 'flask-conical': return <FlaskConical size={28} />;
      case 'image': return <Image size={28} />;
      case 'shuffle': return <Shuffle size={28} />;
      case 'check': return <Check size={28} />;
      case 'x-mark': return <X size={28} />;
      case 'shapes': return <Shapes size={28} />;
      case 'zap': return <Zap size={28} />;
      case 'target': return <Target size={28} />;
      case 'plane': return <Plane size={28} />;
      case 'sort-asc': return <SortAsc size={28} />;
      case 'calculator': return <Calculator size={28} />;
      case 'badge-dollar-sign': return <BadgeDollarSign size={28} />;
      case 'blocks': return <Blocks size={28} />;
      default: return <Gamepad size={28} />;
    }
  };

  const handleTopicSelect = (gameType: GameType) => {
    setSelectedTopic(gameType.name);
    setCurrentGameType(gameType);
    setShowSettings(true);
  };

  const handleCustomGameCreate = () => {
    onToggleChat();
  };
  
  const handleStartGame = async (settings: GameSettingsData) => {
    setShowSettings(false);
    if (!selectedTopic) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const game = await gameGenerator.generateMiniGame(selectedTopic, settings);
      
      if (game) {
        setSelectedGame(game);
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Đã tạo minigame về "${selectedTopic}"`,
        });
      } else {
        throw new Error('Không thể tạo minigame');
      }
    } catch (error) {
      console.error('Lỗi Tạo Minigame:', error);
      setErrorMessage('Không thể tạo minigame. Vui lòng thử lại hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame. Vui lòng thử lại với chủ đề khác.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onGameRequest(customTopic.trim());
    }
  };

  const handleCancelSettings = () => {
    setShowSettings(false);
    setSelectedTopic("");
    setCurrentGameType(null);
  };

  if (isLoading) {
    return <GameLoading />;
  }

  if (errorMessage) {
    return <GameError 
      errorMessage={errorMessage} 
      onRetry={() => setErrorMessage(null)} 
      topic="minigame" 
    />;
  }

  if (selectedGame) {
    return (
      <div className="h-full relative">
        <GameView miniGame={selectedGame} />
        <div className="absolute top-4 right-4">
          <h3 
            className="text-sm font-medium text-primary/60 cursor-pointer select-none" 
            onClick={handleTitleClick}
            title="Trợ Lý Tạo Web"
          >
            Trợ Lý Tạo Web
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-4 md:p-6 overflow-auto">
      <div className="text-primary mb-4 animate-float-in">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse-soft"></div>
          <School size={56} className="relative z-10 text-primary" />
        </div>
      </div>
      
      <h2 
        className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in cursor-pointer"
        onClick={handleTitleClick}
      >
        Minigames Giáo Dục
      </h2>

      {/* Custom Game Button */}
      <div className="w-full max-w-4xl mb-6 flex flex-col md:flex-row gap-3">
        <Button 
          onClick={handleCustomGameCreate}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base relative overflow-hidden"
          size="lg"
        >
          <span className="mr-2">✨</span> Tạo Game Tùy Chỉnh <span className="ml-2">✨</span>
          <span className="absolute inset-0 bg-white/20 blur-3xl opacity-20 animate-pulse-slow"></span>
        </Button>
        
        <form onSubmit={handleCustomTopicSubmit} className="flex-1 flex gap-2">
          <Input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Nhập chủ đề cho minigame..."
            className="flex-1 min-w-0 rounded-lg border-gray-300 text-base"
          />
          <Button 
            type="submit" 
            variant="default"
            className="whitespace-nowrap"
            disabled={!customTopic.trim()}
          >
            Tạo Game
          </Button>
        </form>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-6xl w-full">
        {gameTypes.map((gameType) => (
          <Button 
            key={gameType.id}
            variant="outline" 
            className="game-button flex flex-col h-28 justify-center items-center gap-2 transition-all duration-300 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:border-primary/60 hover:shadow-lg hover:bg-primary/5 active:scale-95 opacity-0 group"
            onClick={() => handleTopicSelect(gameType)}
            title={gameType.description}
          >
            <div className="text-primary/80 p-2 rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary">
              {getIconComponent(gameType.icon)}
            </div>
            <span className="font-medium text-sm text-center line-clamp-2">{gameType.name}</span>
          </Button>
        ))}
      </div>
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-white/20">
          <GameSettings 
            topic={selectedTopic}
            onStart={handleStartGame}
            initialSettings={currentGameType?.defaultSettings}
            onCancel={handleCancelSettings}
            inModal={true}
            gameType={currentGameType}
          />
        </DialogContent>
      </Dialog>

      <OpenAIKeyModal 
        isOpen={showOpenAIKeyModal}
        onClose={() => setShowOpenAIKeyModal(false)}
        onSave={handleSaveOpenAIKey}
        currentKey={localStorage.getItem('openai_api_key')}
      />
    </div>
  );
};

export default QuickGameSelector;

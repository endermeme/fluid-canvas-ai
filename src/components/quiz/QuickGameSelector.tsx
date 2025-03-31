
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Gamepad, Settings, Puzzle, BrainCircuit, Clock4, Dices, PenTool, HeartHandshake, Lightbulb, Sparkles, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import GameSettings from './GameSettings';
import ApiKeySettings from './ApiKeySettings';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GameSettingsData, GameType } from './types';
import { animateBlockCreation } from '@/lib/animations';

const DEFAULT_API_KEY = 'replace-with-default-key';
const API_KEY_STORAGE_KEY = 'claude-api-key';

const QuickGameSelector: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const { toast } = useToast();
  const [gameGenerator, setGameGenerator] = useState<AIGameGenerator | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  
  const gameTypes: GameType[] = [
    {
      id: "quiz",
      name: "Đố vui",
      description: "Trắc nghiệm kiến thức đa dạng",
      icon: "brain-circuit",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "puzzle",
      name: "Xếp hình",
      description: "Ghép hình và hoàn thành các câu đố",
      icon: "puzzle-piece",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 5,
        timePerQuestion: 60,
        category: 'general',
      }
    },
    {
      id: "memory",
      name: "Nhớ hình",
      description: "Rèn luyện trí nhớ với các thẻ bài",
      icon: "light-bulb",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 3,
        category: 'general',
      }
    },
    {
      id: "reflex",
      name: "Phản xạ",
      description: "Kiểm tra tốc độ phản xạ của bạn",
      icon: "clock",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 15,
        timePerQuestion: 5,
        category: 'general',
      }
    },
    {
      id: "hunt",
      name: "Truy tìm",
      description: "Tìm kiếm và khám phá các manh mối",
      icon: "dices",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 6,
        timePerQuestion: 45,
        category: 'general',
      }
    },
    {
      id: "riddle",
      name: "Câu đố",
      description: "Suy luận và giải quyết các câu đố",
      icon: "heart-handshake",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 40,
        category: 'general',
      }
    },
    {
      id: "drawing",
      name: "Vẽ tranh",
      description: "Phát huy khả năng sáng tạo nghệ thuật",
      icon: "pen-tool",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 4,
        timePerQuestion: 60,
        category: 'arts',
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
      }, index * 80);
    });
  }, []);

  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    const apiKey = storedApiKey || DEFAULT_API_KEY;
    setGameGenerator(new AIGameGenerator(apiKey));

    const handleStorageChange = () => {
      const newApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || DEFAULT_API_KEY;
      setGameGenerator(new AIGameGenerator(newApiKey));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'brain-circuit': return <BrainCircuit size={36} />;
      case 'puzzle-piece': return <Puzzle size={36} />;
      case 'light-bulb': return <Lightbulb size={36} />;
      case 'clock': return <Clock4 size={36} />;
      case 'dices': return <Dices size={36} />;
      case 'heart-handshake': return <HeartHandshake size={36} />;
      case 'pen-tool': return <PenTool size={36} />;
      default: return <Gamepad size={36} />;
    }
  };

  const handleTopicSelect = (gameType: GameType) => {
    setSelectedTopic(gameType.name);
    setCurrentGameType(gameType);
    setShowSettings(true);
  };
  
  const handleStartGame = async (settings: GameSettingsData) => {
    if (!gameGenerator) {
      toast({
        title: "Lỗi Khởi Tạo",
        description: "Không thể khởi tạo trình tạo game. Kiểm tra API key của bạn.",
        variant: "destructive",
      });
      return;
    }

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
      setErrorMessage('Không thể tạo minigame. Vui lòng ki��m tra API key hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame. Kiểm tra API key hoặc thử chủ đề khác.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSettings = () => {
    setShowSettings(false);
    setSelectedTopic("");
    setCurrentGameType(null);
  };

  const handleBackToSelection = () => {
    setSelectedGame(null);
    setErrorMessage(null);
  };

  const handleOpenApiSettings = () => {
    setShowApiSettings(true);
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
        <div className="absolute bottom-4 right-4">
          <Button 
            onClick={handleBackToSelection}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm shadow-md transition-transform active:scale-95 animate-fade-in"
          >
            Chọn Game Khác
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-6">
      <div className="text-primary mb-4 animate-float-in">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse-soft"></div>
          <Sparkles size={56} className="relative z-10 text-primary" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in">
        Minigames
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-3xl w-full">
        {gameTypes.map((gameType) => (
          <Button 
            key={gameType.id}
            variant="outline" 
            className="game-button flex flex-col h-32 justify-center items-center gap-2 transition-all duration-300 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:border-primary/60 hover:shadow-lg hover:bg-primary/5 active:scale-95 opacity-0 group"
            onClick={() => handleTopicSelect(gameType)}
          >
            <div className="text-primary/80 p-3 rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary">
              {getIconComponent(gameType.icon)}
            </div>
            <span className="font-medium text-base">{gameType.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="mt-8">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-primary/20 hover:bg-primary/10"
          onClick={handleOpenApiSettings}
        >
          <Key size={14} />
          Cài đặt API Key
        </Button>
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
      
      <ApiKeySettings 
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
      />
    </div>
  );
};

export default QuickGameSelector;

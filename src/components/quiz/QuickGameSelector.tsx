import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Gamepad, Settings, Puzzle, BrainCircuit, Clock4, Dices, PenTool, HeartHandshake, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import GameSettings from './GameSettings';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GameSettingsData, GameType } from './types';
import { animateBlockCreation } from '@/lib/animations';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

const QuickGameSelector: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
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

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'brain-circuit': return <BrainCircuit />;
      case 'puzzle-piece': return <Puzzle />;
      case 'light-bulb': return <Lightbulb />;
      case 'clock': return <Clock4 />;
      case 'dices': return <Dices />;
      case 'heart-handshake': return <HeartHandshake />;
      case 'pen-tool': return <PenTool />;
      default: return <Gamepad />;
    }
  };

  const handleTopicSelect = (gameType: GameType) => {
    setSelectedTopic(gameType.name);
    setCurrentGameType(gameType);
    setShowSettings(true);
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

  const handleCancelSettings = () => {
    setShowSettings(false);
    setSelectedTopic("");
    setCurrentGameType(null);
  };

  const handleBackToSelection = () => {
    setSelectedGame(null);
    setErrorMessage(null);
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
    <div ref={containerRef} className="flex flex-col items-center justify-center h-full w-full space-y-6 py-10 px-4">
      <div className="text-primary mb-4 animate-float-in">
        <Gamepad size={64} />
      </div>
      <h2 className="text-2xl font-bold text-center animate-fade-in">Chào mừng đến với Trò Chơi Mini</h2>
      <p className="text-center max-w-md animate-fade-in opacity-90">
        Chọn một thể loại game dưới đây hoặc nhập chủ đề vào thanh chat để tạo một minigame vui nhộn và tương tác.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mt-4 px-4">
        {gameTypes.map((gameType) => (
          <Button 
            key={gameType.id}
            variant="outline" 
            className="game-button flex flex-col h-28 p-4 justify-center items-center gap-2 transition-all border-2 hover:border-primary/60 hover:shadow-md active:scale-95 opacity-0"
            onClick={() => handleTopicSelect(gameType)}
          >
            <div className="text-primary">
              {getIconComponent(gameType.icon)}
            </div>
            <span className="font-medium text-sm">{gameType.name}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{gameType.description}</span>
          </Button>
        ))}
      </div>
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
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
    </div>
  );
};

export default QuickGameSelector;

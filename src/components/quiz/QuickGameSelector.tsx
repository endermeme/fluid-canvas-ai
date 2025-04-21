import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator } from './generator/geminiGenerator';
import { MiniGame } from './generator/types';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import GameSettings from './GameSettings';
import { GameSettingsData, GameType } from './types';
import { gameTypes } from './gameTypes';
import { animateBlockCreation } from '@/lib/animations';
import CustomGameForm from './custom-games/CustomGameForm';
import { 
  BrainCircuit, 
  Puzzle, 
  Lightbulb, 
  Clock4, 
  Dices, 
  PenTool, 
  Book, 
  BookOpen, 
  GraduationCap, 
  Globe, 
  Award, 
  School, 
  MessageSquare, 
  RotateCcw, 
  Layers, 
  FlaskConical, 
  ImageIcon as Image, 
  Shuffle, 
  Check, 
  X, 
  Shapes, 
  Zap, 
  Target, 
  Plane, 
  ArrowUpDown as SortAsc, 
  Calculator, 
  BadgeDollarSign, 
  Blocks, 
  Gamepad
} from 'lucide-react';

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
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  
  const gameGenerator = AIGameGenerator.getInstance();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  
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
    setSelectedTopic(gameType.description);
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
          description: `Đã tạo minigame về "${currentGameType?.name || selectedTopic}"`,
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

  if (isLoading) {
    return <GameLoading topic={selectedTopic || currentGameType?.name || "minigame"} />;
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
      </div>
    );
  }

  const renderGameGrid = () => (
    <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-6xl w-full">
      {gameTypes.map((gameType) => (
        <button
          key={gameType.id}
          onClick={() => handleTopicSelect(gameType)}
          className="game-button relative overflow-hidden rounded-xl transition-all duration-300 group"
        >
          <div className="p-4 flex flex-col items-center justify-center gap-3 relative z-0">
            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300 transform group-hover:scale-110">
              {getIconComponent(gameType.icon)}
            </div>
            <h3 className="font-medium text-sm text-center line-clamp-2 h-10 text-primary/90">
              {gameType.name}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-4 md:p-6 overflow-auto">
      <div className="text-primary mb-4 animate-float-in">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse-soft"></div>
          <GraduationCap size={56} className="relative z-10 text-primary" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in cursor-pointer">
        Minigames Giáo Dục
      </h2>

      <CustomGameForm 
        onGenerate={(content, game) => {
          if (game) {
            setIsLoading(true);
            setTimeout(() => {
              setSelectedGame(game);
              setIsLoading(false);
              toast({
                title: "Minigame Đã Sẵn Sàng",
                description: `Đã tạo minigame về "${content}"`,
              });
            }, 500);
          } else {
            onGameRequest(content);
          }
        }}
        onCancel={handleCustomGameCreate}
      />
      
      {renderGameGrid()}
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-white/20">
          <DialogTitle>Điều chỉnh game {currentGameType?.name || ""}</DialogTitle>
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

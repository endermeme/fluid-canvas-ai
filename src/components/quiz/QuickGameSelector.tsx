
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

import { Button } from '@/components/ui/button';
import CustomGameForm from './custom-games/CustomGameForm';

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

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-4 md:p-6 overflow-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-center mb-8">
        <div className="flex items-center gap-3">
          <School className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Minigames Giáo Dục
          </h1>
        </div>
      </div>

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
      
      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mt-6">
        {gameTypes.map((gameType, index) => (
          <Button
            key={index}
            variant="outline"
            className="game-button flex flex-col items-center justify-center h-32 p-4 border border-border/40 rounded-lg hover:bg-accent/80 hover:border-accent transition-all"
            onClick={() => handleTopicSelect(gameType)}
          >
            <div className="bg-primary/10 text-primary p-2 rounded-full mb-2">
              {getIconComponent(gameType.icon)}
            </div>
            <span className="font-medium text-foreground">{gameType.name}</span>
            <span className="text-xs text-muted-foreground text-center mt-1">
              {gameType.description}
            </span>
          </Button>
        ))}
      </div>
      
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

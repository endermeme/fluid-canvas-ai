
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
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { GameSettingsData, GameType } from './types';
import { animateBlockCreation } from '@/lib/animations';
import { Link } from 'react-router-dom';
import OpenAIKeyModal from './OpenAIKeyModal';
import { Input } from '@/components/ui/input';
import { gameTypes } from './gameTypes';

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
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  
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

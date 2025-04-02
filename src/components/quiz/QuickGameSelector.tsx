import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Gamepad, Settings, Puzzle, BrainCircuit, Clock4, Dices, PenTool, HeartHandshake, Lightbulb, Sparkles, Book, GraduationCap, School, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameSettings from './GameSettings';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GameSettingsData, GameType } from './types';
import { animateBlockCreation } from '@/lib/animations';
import { Link } from 'react-router-dom';
import OpenAIKeyModal from './OpenAIKeyModal';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuickGameSelectorProps {
  onGameSelect?: (topic: string) => void;
}

const QuickGameSelector: React.FC<QuickGameSelectorProps> = ({ onGameSelect }) => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  
  const gameTypes: GameType[] = [
    {
      id: "vocabulary",
      name: "Từ vựng",
      description: "Học từ mới qua các trò chơi tương tác",
      icon: "book",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
      }
    },
    {
      id: "math",
      name: "Toán học",
      description: "Rèn luyện kỹ năng tính toán nhanh",
      icon: "brain-circuit",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 30,
        category: 'math',
      }
    },
    {
      id: "science",
      name: "Khoa học",
      description: "Khám phá thế giới khoa học kỳ thú",
      icon: "lightbulb",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 45,
        category: 'science',
      }
    },
    {
      id: "history",
      name: "Lịch sử",
      description: "Khám phá các sự kiện lịch sử quan trọng",
      icon: "graduation-cap",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 40,
        category: 'history',
      }
    },
    {
      id: "geography",
      name: "Địa lý",
      description: "Khám phá các quốc gia và địa danh",
      icon: "globe",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 30,
        category: 'geography',
      }
    },
    {
      id: "memory",
      name: "Trí nhớ",
      description: "Rèn luyện trí nhớ với các thử thách",
      icon: "puzzle",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 3,
        category: 'general',
      }
    },
    {
      id: "grammar",
      name: "Ngữ pháp",
      description: "Học ngữ pháp qua các bài tập tương tác",
      icon: "pen-tool",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 40,
        category: 'arts',
      }
    },
    {
      id: "logic",
      name: "Tư duy",
      description: "Rèn luyện tư duy logic và phản xạ nhanh",
      icon: "award",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 6,
        timePerQuestion: 30,
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
      }, index * 80);
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
      case 'brain-circuit': return <BrainCircuit size={36} />;
      case 'puzzle-piece': return <Puzzle size={36} />;
      case 'light-bulb': return <Lightbulb size={36} />;
      case 'clock': return <Clock4 size={36} />;
      case 'dices': return <Dices size={36} />;
      case 'heart-handshake': return <HeartHandshake size={36} />;
      case 'pen-tool': return <PenTool size={36} />;
      case 'book': return <Book size={36} />;
      case 'graduation-cap': return <GraduationCap size={36} />;
      case 'globe': return <Globe size={36} />;
      case 'award': return <Award size={36} />;
      case 'school': return <School size={36} />;
      default: return <Gamepad size={36} />;
    }
  };

  const handleTopicSelect = (gameType: GameType) => {
    setSelectedTopic(gameType.name);
    setCurrentGameType(gameType);
    
    if (onGameSelect) {
      onGameSelect(gameType.name);
    } else {
      setShowSettings(true);
    }
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
          description: gameGenerator.hasOpenAIKey() 
            ? `Đã tạo và cải thiện minigame về "${selectedTopic}"` 
            : `Đã tạo minigame về "${selectedTopic}"`,
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
        <div className="absolute top-4 right-4">
          <Button 
            onClick={handleBackToSelection}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm shadow-md transition-transform active:scale-95 animate-fade-in"
          >
            Chọn Game Khác
          </Button>
        </div>
        <div className="h-full">
          {selectedGame && <div className="h-full">{JSON.stringify(selectedGame)}</div>}
        </div>
        <div className="absolute top-4 right-20">
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
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-6">
      <div className="text-primary mb-4 animate-float-in">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse-soft"></div>
          <School size={56} className="relative z-10 text-primary" />
        </div>
      </div>
      
      <h2 
        className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in cursor-pointer"
        onClick={handleTitleClick}
      >
        Minigames Giáo Dục
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

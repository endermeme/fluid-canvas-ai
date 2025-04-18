
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MiniGame } from './generator/types';
import { GameType } from './types';
import { gameTypes } from './gameTypes';
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
  ImageIcon, 
  Shuffle, 
  Check, 
  X, 
  Shapes, 
  Zap, 
  Target, 
  Plane, 
  ArrowUpDown, 
  Calculator, 
  BadgeDollarSign, 
  Blocks, 
  Gamepad
} from 'lucide-react';

interface QuickGameSelectorProps {
  onGameRequest: (topic: string) => void;
  onToggleChat: () => void;
}

const QuickGameSelector: React.FC<QuickGameSelectorProps> = ({ onGameRequest, onToggleChat }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);

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
      case 'image': return <ImageIcon size={28} />;
      case 'shuffle': return <Shuffle size={28} />;
      case 'check': return <Check size={28} />;
      case 'x-mark': return <X size={28} />;
      case 'shapes': return <Shapes size={28} />;
      case 'zap': return <Zap size={28} />;
      case 'target': return <Target size={28} />;
      case 'plane': return <Plane size={28} />;
      case 'sort-asc': return <ArrowUpDown size={28} />;
      case 'calculator': return <Calculator size={28} />;
      case 'badge-dollar-sign': return <BadgeDollarSign size={28} />;
      case 'blocks': return <Blocks size={28} />;
      default: return <Gamepad size={28} />;
    }
  };

  const handleTopicSelect = (gameType: GameType) => {
    setSelectedTopic(gameType.description);
    setCurrentGameType(gameType);
    toast({
      title: "Game Selection",
      description: `Selected game: ${gameType.name}`,
    });
  };

  const handleCustomGameCreate = () => {
    onToggleChat();
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-4 md:p-6 overflow-auto">
      <div className="w-full max-w-4xl mb-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Game Selection</h1>
        <p className="text-muted-foreground text-center mb-6">Choose from our curated selection of educational games</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {gameTypes.map((gameType) => (
          <button
            key={gameType.id}
            className="game-button flex flex-col items-center justify-center p-4 bg-card hover:bg-card/80 rounded-xl border border-border shadow hover:shadow-md transition-all duration-200"
            onClick={() => handleTopicSelect(gameType)}
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-3">
              {getIconComponent(gameType.icon)}
            </div>
            <h3 className="font-medium text-lg mb-1">{gameType.name}</h3>
            <p className="text-xs text-muted-foreground text-center">{gameType.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickGameSelector;

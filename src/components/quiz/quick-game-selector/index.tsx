
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator } from '../generator/AIGameGenerator';
import { MiniGame } from '../generator/types';
import GameLoading from '../GameLoading';
import GameError from '../GameError';
import GameView from '../GameView';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import GameSettings from '../GameSettings';
import { GameSettingsData, GameType } from '../types';
import { gameTypes } from '../gameTypes';
import PresetGameManager from '../preset-games/PresetGameManager';
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

// Import our components
import GameHeader from './GameHeader';
import CustomGameForm from './CustomGameForm';
import GameGrid from './GameGrid';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  
  // New state for preset game management
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

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
    // Map game types to preset types
    const presetMappings: {[key: string]: string} = {
      'quiz': 'quiz',
      'multiple-choice': 'quiz',
      'trivia': 'quiz',
      'matching-pairs': 'matching',
      'flashcards': 'flashcards',
      'memory-game': 'memory',
      'sequence': 'ordering',
      'word-search': 'wordsearch'
    };
    
    const presetType = presetMappings[gameType.id] || 'quiz'; // Default to quiz if mapping not found
    
    // Set the selected preset and game type
    setSelectedPreset(presetType);
    setCurrentGameType(gameType);
  };

  const handleCustomGameCreate = () => {
    onToggleChat();
  };
  
  const handleBackFromPreset = () => {
    setSelectedPreset(null);
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
      <div className="h-full relative overflow-hidden">
        <GameView miniGame={selectedGame} />
      </div>
    );
  }

  // If a preset game type is selected, show the preset game manager
  if (selectedPreset) {
    return (
      <PresetGameManager 
        gameType={selectedPreset} 
        onBack={handleBackFromPreset}
        initialTopic={currentGameType?.name || ""}
      />
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-4 md:p-6 overflow-auto">
      <GameHeader onTitleClick={() => {}} />
      
      <CustomGameForm 
        onCustomGameCreate={handleCustomGameCreate}
        onGameRequest={onGameRequest}
      />
      
      <div className="w-full max-h-[calc(100vh-250px)] overflow-auto pb-6">
        <GameGrid 
          gameTypes={gameTypes} 
          onTopicSelect={handleTopicSelect} 
          getIconComponent={getIconComponent}
        />
      </div>
    </div>
  );
};

export default QuickGameSelector;


import React from 'react';
import { GameType } from '../types';
import { Button } from '@/components/ui/button';
import { 
  Gamepad, BrainCircuit, Puzzle, Lightbulb, 
  Clock4, Dices, PenTool, HeartHandshake, 
  MessageSquare, BookOpen, RotateCcw, Layers, 
  FlaskConical, Image, Shuffle, Check, X, 
  Shapes, Zap, Target, Plane, SortAsc,
  Calculator, BadgeDollarSign, Blocks,
  Book, GraduationCap, School, Award, Globe
} from 'lucide-react';

interface GameButtonProps {
  gameType: GameType;
  onClick: (gameType: GameType) => void;
}

const GameButton: React.FC<GameButtonProps> = ({ gameType, onClick }) => {
  return (
    <Button 
      key={gameType.id}
      variant="outline" 
      className="game-button flex flex-col h-28 justify-center items-center gap-2 transition-all duration-300 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:border-primary/60 hover:shadow-lg hover:bg-primary/5 active:scale-95 opacity-0 group"
      onClick={() => onClick(gameType)}
      title={gameType.description}
    >
      <div className="text-primary/80 p-2 rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary">
        {getIconComponent(gameType.icon)}
      </div>
      <span className="font-medium text-sm text-center line-clamp-2">{gameType.name}</span>
    </Button>
  );
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

export default GameButton;

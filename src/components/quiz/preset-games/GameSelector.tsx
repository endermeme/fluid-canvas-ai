
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Brain, BookOpen, Puzzle, Dices, Footprints, 
  Image, CheckSquare, Layers, ArrowRightLeft, Search, Sparkles
} from 'lucide-react';

interface GameSelectorProps {
  onSelectGame: (gameType: string) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const gameTypes = [
    { 
      id: 'quiz', 
      name: 'Quiz', 
      description: 'Answer multiple-choice questions',
      icon: <Brain className="h-8 w-8 text-primary" />
    },
    { 
      id: 'flashcards', 
      name: 'Flashcards', 
      description: 'Learn with two-sided cards',
      icon: <BookOpen className="h-8 w-8 text-primary" />
    },
    { 
      id: 'matching', 
      name: 'Matching', 
      description: 'Match related pairs of items',
      icon: <ArrowRightLeft className="h-8 w-8 text-primary" />
    },
    { 
      id: 'memory', 
      name: 'Memory Game', 
      description: 'Find matching pairs of cards',
      icon: <Dices className="h-8 w-8 text-primary" />
    },
    { 
      id: 'ordering', 
      name: 'Sentence Ordering', 
      description: 'Arrange words to form complete sentences',
      icon: <Layers className="h-8 w-8 text-primary" />
    },
    { 
      id: 'wordsearch', 
      name: 'Word Search', 
      description: 'Find hidden words in a grid',
      icon: <Search className="h-8 w-8 text-primary" />
    },
    { 
      id: 'pictionary', 
      name: 'Pictionary', 
      description: 'Guess words from pictures',
      icon: <Image className="h-8 w-8 text-primary" />
    },
    { 
      id: 'truefalse', 
      name: 'True or False', 
      description: 'Determine if statements are true or false',
      icon: <CheckSquare className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose a game type to create with AI</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {gameTypes.map((game) => (
          <Card 
            key={game.id}
            className="p-4 hover:shadow-md transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
            onClick={() => onSelectGame(game.id)}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                {game.icon}
              </div>
              <div>
                <h3 className="font-bold">{game.name}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </div>
              <div className="mt-2 flex items-center justify-center w-full px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-1" />
                Create with AI
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GameSelector;

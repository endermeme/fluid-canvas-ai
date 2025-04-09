
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SparklesIcon, Brain, PenTool, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator, MiniGame } from '../generator/AIGameGenerator';
import { GameSettingsData } from '../types';

interface CustomGameFormProps {
  gameType: string;
  onGenerate: (content: string, game?: MiniGame) => void;
  onCancel: () => void;
}

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

const CustomGameForm: React.FC<CustomGameFormProps> = ({ gameType, onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the singleton pattern
  const gameGenerator = AIGameGenerator.getInstance(API_KEY);

  const getGameTypeName = () => {
    switch (gameType) {
      case 'quiz': return 'Quiz';
      case 'flashcards': return 'Flashcards';
      case 'matching': return 'Matching';
      case 'memory': return 'Memory Game';
      case 'ordering': return 'Sentence Ordering';
      case 'wordsearch': return 'Word Search';
      case 'pictionary': return 'Pictionary';
      case 'truefalse': return 'True or False';
      default: return 'Interactive Game';
    }
  };

  const getPlaceholderText = () => {
    switch (gameType) {
      case 'quiz':
        return 'Enter instructions for AI to create quiz questions.\n\nExample: "Create 10 multiple choice questions about Ancient Egypt history with 4 options each."';
      
      case 'flashcards':
        return 'Enter instructions for AI to create flashcards.\n\nExample: "Create 15 flashcards for learning Spanish vocabulary related to food, with Spanish term, English meaning, and example sentence."';
      
      case 'matching':
        return 'Enter instructions for AI to create a matching game.\n\nExample: "Create 12 pairs of synonyms for a matching game, medium difficulty, literature theme."';
      
      case 'truefalse':
        return 'Enter instructions for AI to create true/false questions.\n\nExample: "Create 10 true/false statements about high school biology, with equal numbers of true and false statements."';
      
      default:
        return 'Enter detailed instructions for AI to create game content. Specify topic, difficulty, quantity, and any special requirements.';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content instructions for the game",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const settings: GameSettingsData = {
        difficulty: difficulty,
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general'
      };
      
      console.log("Creating game with topic:", content);
      
      const game = await gameGenerator.generateMiniGame(content, settings);
      
      if (game) {
        toast({
          title: "Game Created",
          description: `${getGameTypeName()} game successfully created with AI.`,
        });
        
        onGenerate(content, game);
      } else {
        throw new Error("Could not create game");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        title: "Game Creation Error",
        description: "An error occurred while creating the game. Please try again.",
        variant: "destructive"
      });
      onGenerate(content);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    if (window.location.pathname === '/quiz' && !window.location.search) {
      navigate('/');
    } else {
      onCancel();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <Card className="bg-background/60 backdrop-blur-sm border-primary/20 shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Create {getGameTypeName()} with AI
          </h2>
          <p className="text-muted-foreground">Describe what you want the AI to create for your game</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select 
              value={difficulty} 
              onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="content">Content Instructions</Label>
            <Textarea
              id="content"
              placeholder={getPlaceholderText()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <PenTool className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Detailed Instructions</h4>
                <p className="text-xs text-muted-foreground">The more specific, the better</p>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <SparklesIcon className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Interactive Games</h4>
                <p className="text-xs text-muted-foreground">Quiz, matching, ordering, and more</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isGenerating}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Create with AI
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameForm;

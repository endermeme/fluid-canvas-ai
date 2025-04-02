
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';

interface QuickGameOptionsProps {
  options: string[];
}

const QuickGameOptions: React.FC<QuickGameOptionsProps> = ({ options }) => {
  const navigate = useNavigate();
  
  const handleQuickGameSelect = (gameTopic: string) => {
    navigate(`/quiz?topic=${encodeURIComponent(gameTopic)}&autostart=true`);
  };
  
  return (
    <div className="bg-gradient-to-r from-background to-accent/20 backdrop-blur-md border-t border-border/40 p-3 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mr-2 animate-pulse-soft">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Học tập vui
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {options.map((game, index) => (
            <div key={game} className="flex">
              <Button
                variant="ghost" 
                size="sm"
                className="w-full h-auto py-3 px-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-sm animate-float-in min-h-[52px] text-sm"
                style={{animationDelay: `${index * 0.05}s`}}
                onClick={() => handleQuickGameSelect(game)}
              >
                <div className="flex flex-col items-center">
                  {game.split(' ').slice(-1)[0]}
                </div>
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="sr-only">Thông tin</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" className="bg-white/90 backdrop-blur-md border border-primary/20 shadow-lg">
                  {game}
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickGameOptions;

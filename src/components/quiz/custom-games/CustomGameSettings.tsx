
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Code } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface CustomGameSettingsProps {
  onGenerate: (prompt: string, useCanvas: boolean) => void;
  isGenerating?: boolean;
}

const CustomGameSettings: React.FC<CustomGameSettingsProps> = ({ 
  onGenerate, 
  isGenerating = false
}) => {
  const [prompt, setPrompt] = useState('');
  // Canvas mode is now always true by default
  const [useCanvas] = useState(true);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onGenerate(prompt, useCanvas);
    }
  };

  const getPlaceholderText = () => {
    return 'Mô tả chi tiết game bạn muốn tạo (ví dụ: Tạo trò chơi xếp hình với 9 mảnh ghép về hệ mặt trời)';
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-sm border-primary/20 p-8 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full opacity-70 animate-pulse"></div>
          <div className="z-10 flex flex-col items-center">
            <div className="flex items-center justify-center p-4 mb-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 backdrop-blur-sm animate-bounce-slow">
              <Code className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Tạo Game Tương Tác
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Mô tả game bạn muốn và AI sẽ tạo ra một trò chơi tương tác với Canvas
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label 
              htmlFor="prompt" 
              className="flex items-center gap-2 text-lg font-medium mb-2 text-primary/90"
            >
              <Sparkles className="h-5 w-5 text-primary animate-pulse" /> 
              Mô tả game của bạn
            </Label>
            <Textarea
              id="prompt"
              placeholder={getPlaceholderText()}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="mt-2 font-mono text-base border-primary/20 focus-visible:ring-primary/30 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 focus:bg-white/90"
            />
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Sparkles className="h-5 w-5 mr-2 animate-pulse group-hover:animate-spin" />
            {isGenerating ? 'Đang tạo game...' : 'Tạo game với AI'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameSettings;


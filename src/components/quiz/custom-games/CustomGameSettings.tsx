import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Code } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GameSettingsData } from '../types';

interface CustomGameSettingsProps {
  onGenerate: (prompt: string, settings: GameSettingsData) => void;
  initialPrompt?: string;
  isGenerating?: boolean;
}

const CustomGameSettings: React.FC<CustomGameSettingsProps> = ({ 
  onGenerate, 
  initialPrompt = '',
  isGenerating = false
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);

  const handleSubmit = () => {
    if (prompt.trim()) {
      // Debug logging
      console.groupCollapsed('%c GAME REQUEST %c ' + prompt.substring(0, 30) + '...', 
        'background: #6f42c1; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', 
        'font-weight: bold;');
      console.log('Prompt:', prompt);
      console.log('Timestamp:', new Date().toISOString());
      console.log('Request ID:', Date.now().toString(36) + Math.random().toString(36).substring(2, 5));
      console.groupEnd();
      
      // Tạo settings cơ bản nhất
      const defaultSettings: GameSettingsData = {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
        prompt: prompt
      };
      
      // Log settings
      console.log('%c GAME SETTINGS %c Using defaults', 
        'background: #0366d6; color: white; padding: 2px 6px; border-radius: 4px;', 
        '', defaultSettings);
      
      onGenerate(prompt, defaultSettings);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-3xl bg-background/60 backdrop-blur-sm border-primary/20 p-6 shadow-lg">
        <div className="flex flex-col items-center mb-6 relative">
          <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full opacity-70"></div>
          <div className="z-10 flex flex-col items-center">
            <div className="flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 backdrop-blur-sm">
              <Code className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Tạo Game Tương Tác Với AI
            </h2>
            <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
              Mô tả chi tiết game bạn muốn tạo và AI sẽ tạo toàn bộ code HTML, CSS, JavaScript
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Mô tả chi tiết trò chơi bạn muốn tạo (ví dụ: Tạo trò chơi xếp hình với 9 mảnh ghép về hệ mặt trời, có hiệu ứng âm thanh khi hoàn thành)"
            className="min-h-[180px] border-primary/20 bg-white/50 backdrop-blur-sm transition-all shadow-sm hover:border-primary/30 focus:ring-2 focus:ring-primary/20 text-base"
          />

          <div className="pt-4">
            <Button 
              onClick={handleSubmit} 
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={!prompt.trim() || isGenerating}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isGenerating ? 'Đang tạo game...' : 'Tạo game với AI'}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="text-center italic">
              Ví dụ: "Tạo trò chơi memory với 8 cặp thẻ về các biểu tượng văn hoá", "Tạo trò chơi xoay vòng may mắn với 10 phần thưởng ngẫu nhiên", "Tạo trò chơi đố vui về động vật với hình ảnh và âm thanh"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameSettings; 

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CustomGameSettingsProps {
  onGenerate: (prompt: string, useCanvas?: boolean) => void;
  isGenerating: boolean;
}

const CustomGameSettings: React.FC<CustomGameSettingsProps> = ({ 
  onGenerate, 
  isGenerating 
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Tạo Game Tùy Chỉnh</h2>
      
      <p className="mb-4 text-muted-foreground">
        Nhập mô tả cho trò chơi của bạn, và chúng tôi sẽ tạo ra một trò chơi tương tác.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <Textarea
            placeholder="Ví dụ: Tạo một trò chơi câu hỏi về lịch sử Việt Nam..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-full min-h-[200px] resize-none"
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isGenerating || !prompt.trim()}>
            {isGenerating ? 'Đang tạo...' : 'Tạo Game'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomGameSettings;

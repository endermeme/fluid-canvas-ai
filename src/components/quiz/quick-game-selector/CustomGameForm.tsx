
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AIGameGenerator } from '../generator/AIGameGenerator';

interface CustomGameFormProps {
  onGameGenerated: (topic: string) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGameGenerated, onCancel }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simply pass the topic to the parent component
    onGameGenerated(topic);
  };

  return (
    <div className="bg-background/95 backdrop-blur-lg rounded-lg border border-primary/20 p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Tạo Game Tùy Chỉnh</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            Chủ đề
          </label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Nhập chủ đề cho trò chơi (ví dụ: Lịch sử Việt Nam)"
            required
            className="w-full"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isGenerating}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={!topic.trim() || isGenerating}
            className={isGenerating ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {isGenerating ? 'Đang tạo...' : 'Tạo Game'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomGameForm;

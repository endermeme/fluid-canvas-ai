
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface CustomGameFormProps {
  onGameGenerated: (topic: string) => void;
  onCancel: () => void;
  onCustomGameCreate?: () => void;
  onGameRequest: (topic: string) => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ 
  onGameGenerated, 
  onCancel, 
  onCustomGameCreate, 
  onGameRequest 
}) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simply pass the topic to the parent component
    onGameGenerated(topic);
  };

  const handleGameRequest = () => {
    if (!topic.trim()) return;
    onGameRequest(topic);
  };

  const handleCustomGameCreate = () => {
    if (onCustomGameCreate) {
      onCustomGameCreate();
    }
  };

  return (
    <div className="bg-background/95 backdrop-blur-lg rounded-lg border border-primary/20 p-6 shadow-lg my-4">
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
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isGenerating}
            className="flex-1"
          >
            Hủy
          </Button>
          
          <Button 
            type="submit" 
            disabled={!topic.trim() || isGenerating}
            className={`flex-1 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? 'Đang tạo...' : 'Tạo Game'}
          </Button>
          
          {onCustomGameCreate && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleCustomGameCreate}
              className="flex-1"
            >
              Tùy chỉnh nâng cao
            </Button>
          )}
          
          {onGameRequest && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleGameRequest}
              className="flex-1"
            >
              Tạo bằng Chat AI
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CustomGameForm;

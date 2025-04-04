
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomGameFormProps {
  onCustomGameCreate: () => void;
  onGameRequest: (topic: string) => void;
  customTopic?: string;
  setCustomTopic?: React.Dispatch<React.SetStateAction<string>>;
  handleCustomTopicSubmit?: (e: React.FormEvent) => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ 
  onCustomGameCreate,
  onGameRequest,
  customTopic: externalCustomTopic,
  setCustomTopic: externalSetCustomTopic,
  handleCustomTopicSubmit: externalHandleCustomTopicSubmit
}) => {
  const [internalCustomTopic, setInternalCustomTopic] = useState<string>("");
  
  // Use either external or internal state management
  const customTopic = externalCustomTopic !== undefined ? externalCustomTopic : internalCustomTopic;
  const setCustomTopic = externalSetCustomTopic || setInternalCustomTopic;
  
  const handleCustomTopicSubmit = externalHandleCustomTopicSubmit || ((e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onGameRequest(customTopic.trim());
    }
  });

  return (
    <div className="w-full max-w-4xl mb-6 flex flex-col md:flex-row gap-3">
      <Button 
        onClick={onCustomGameCreate}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base relative overflow-hidden"
        size="lg"
      >
        <span className="mr-2">✨</span> Tạo Game Tùy Chỉnh <span className="ml-2">✨</span>
        <span className="absolute inset-0 bg-white/20 blur-3xl opacity-20 animate-pulse-slow"></span>
      </Button>
      
      <form onSubmit={handleCustomTopicSubmit} className="flex-1 flex gap-2">
        <Input
          type="text"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="Nhập chủ đề cho minigame..."
          className="flex-1 min-w-0 rounded-lg border-gray-300 text-base"
        />
        <Button 
          type="submit" 
          variant="default"
          className="whitespace-nowrap"
          disabled={!customTopic.trim()}
        >
          Tạo Game
        </Button>
      </form>
    </div>
  );
};

export default CustomGameForm;

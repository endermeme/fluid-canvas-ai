
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Use either external or internal state management
  const customTopic = externalCustomTopic !== undefined ? externalCustomTopic : internalCustomTopic;
  const setCustomTopic = externalSetCustomTopic || setInternalCustomTopic;
  
  const handleCustomTopicSubmit = externalHandleCustomTopicSubmit || ((e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onGameRequest(customTopic.trim());
    }
  });

  // Auto resize textarea when content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [customTopic]);

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
        <div className={`relative flex-1 transition-all duration-300 ${inputFocused ? 'flex-grow' : ''}`}>
          <Textarea
            ref={textareaRef}
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Nhập chủ đề cho minigame..."
            className={`flex-1 min-w-0 rounded-lg border-gray-300 text-base resize-none overflow-hidden transition-all duration-300 min-h-[42px] ${inputFocused ? 'shadow-md border-primary/50' : ''}`}
            style={{ height: customTopic ? 'auto' : '42px' }}
          />
        </div>
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

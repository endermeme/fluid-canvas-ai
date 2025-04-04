
import React, { useState } from 'react';
import { KeyRound, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpenAIKeyModal from '@/components/quiz/OpenAIKeyModal';
import { useToast } from '@/hooks/use-toast';

const APIKeyButton = () => {
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  const { toast } = useToast();

  const handleSaveOpenAIKey = (key: string) => {
    // Allow empty key (user wants to remove the key)
    localStorage.setItem('openai_api_key', key);
    if (key) {
      toast({
        title: "API Key Đã Lưu",
        description: "OpenAI API key của bạn đã được lưu thành công.",
      });
    } else {
      toast({
        title: "Đã Xóa API Key",
        description: "Đã chuyển sang chỉ sử dụng Gemini với chế độ Canvas.",
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 absolute top-2 right-2 z-50"
        onClick={() => setShowOpenAIKeyModal(true)}
      >
        <KeyRound className="h-4 w-4" />
        <span className="text-xs font-medium">API Key</span>
      </Button>
      
      <OpenAIKeyModal 
        isOpen={showOpenAIKeyModal}
        onClose={() => setShowOpenAIKeyModal(false)}
        onSave={handleSaveOpenAIKey}
        currentKey={localStorage.getItem('openai_api_key')}
        allowEmpty={true}
      />
    </>
  );
};

export default APIKeyButton;

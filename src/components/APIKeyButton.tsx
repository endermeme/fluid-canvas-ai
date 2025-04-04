
import React, { useState } from 'react';
import { KeyRound, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpenAIKeyModal from '@/components/quiz/OpenAIKeyModal';
import { useToast } from '@/hooks/use-toast';

const APIKeyButton = () => {
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  const { toast } = useToast();

  const handleSaveOpenAIKey = (key: string) => {
    if (key) {
      localStorage.setItem('openai_api_key', key);
      toast({
        title: "API Key Đã Lưu",
        description: "OpenAI API key của bạn đã được lưu thành công.",
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
      />
    </>
  );
};

export default APIKeyButton;


import React, { useState } from 'react';
import { KeyRound, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpenAIKeyModal from '@/components/quiz/OpenAIKeyModal';
import { useToast } from '@/hooks/use-toast';
import { getUseOpenAIAsPrimary } from '@/components/quiz/generator/apiUtils';

const APIKeyButton = () => {
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  const { toast } = useToast();
  const useOpenAIAsPrimary = getUseOpenAIAsPrimary();

  const handleSaveOpenAIKey = (key: string, useAsPrimary: boolean = false) => {
    // Allow empty key (user wants to remove the key)
    localStorage.setItem('openai_api_key', key);
    localStorage.setItem('use_openai_primary', useAsPrimary ? 'true' : 'false');
    
    // Log the key format for debugging (censored)
    if (key) {
      const keyType = key.startsWith('sk-proj-') ? 'Project key' : 'Regular key';
      const keyPreview = `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
      console.log(`APIKeyButton: Saved OpenAI key - Type: ${keyType}, Format: ${keyPreview}`);
      console.log(`APIKeyButton: Primary API set to: ${useAsPrimary ? 'OpenAI' : 'Gemini'}`);
      
      toast({
        title: "API Key Đã Lưu",
        description: useAsPrimary 
          ? "OpenAI sẽ được sử dụng làm API chính với GPT-4o-mini" 
          : "OpenAI API key của bạn đã được lưu thành công.",
      });
    } else {
      console.log("APIKeyButton: API key has been removed");
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
        useOpenAIAsPrimary={useOpenAIAsPrimary}
      />
    </>
  );
};

export default APIKeyButton;


import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpenAIKeyModal from '@/components/quiz/OpenAIKeyModal';
import { useToast } from '@/hooks/use-toast';
import { validateOpenAIKey } from '@/components/quiz/generator/apiUtils';

const APIKeyButton = () => {
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  const { toast } = useToast();

  const handleSaveOpenAIKey = (key: string) => {
    // Allow empty key (user wants to remove the key)
    if (!key.trim()) {
      localStorage.removeItem('openai_api_key');
      toast({
        title: "API Key Removed",
        description: "Switched to using only Gemini with Canvas mode.",
      });
      return true;
    }
    
    // Validate key format
    if (!validateOpenAIKey(key)) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API key is not in the correct format. Please check and try again.",
        variant: "destructive"
      });
      return false;
    }
    
    localStorage.setItem('openai_api_key', key);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully.",
    });
    return true;
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

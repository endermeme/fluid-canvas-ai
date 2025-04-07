
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const APIKeyButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const { toast } = useToast();

  const handleSave = () => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
      toast({
        title: "API Key đã lưu",
        description: "Gemini API key của bạn đã được lưu thành công.",
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsOpen(true)}
      >
        <Key className="h-4 w-4" />
        <span className="sr-only">API Key</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cài đặt API Key</DialogTitle>
            <DialogDescription>
              Nhập Gemini API key để sử dụng tính năng AI.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <Input
              type="password"
              placeholder="Nhập Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleSave}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default APIKeyButton;

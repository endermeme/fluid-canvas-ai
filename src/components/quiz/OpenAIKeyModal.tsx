
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OpenAIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string | null;
}

const OpenAIKeyModal: React.FC<OpenAIKeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentKey
}) => {
  const [apiKey, setApiKey] = useState(currentKey || '');

  const handleSave = () => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
      onSave(apiKey);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cài đặt API Key</DialogTitle>
          <DialogDescription>
            Nhập Gemini API key để sử dụng tính năng AI nâng cao.
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
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={handleSave}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenAIKeyModal;

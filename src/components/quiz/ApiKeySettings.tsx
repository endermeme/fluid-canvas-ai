
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { X, Save, Key } from 'lucide-react';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_KEY_STORAGE_KEY = 'claude-api-key';

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  // Load saved API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    
    toast({
      title: "Thành công",
      description: "API key đã được lưu",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg border border-border bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Cài đặt Claude API Key
          </DialogTitle>
          <DialogDescription>
            Nhập Claude API key của bạn để sử dụng với ứng dụng tạo minigame
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Input
            placeholder="Claude API Key..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            type="password"
            className="font-mono"
          />
          
          <div className="text-sm text-muted-foreground">
            <p>Để lấy API key:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Đăng nhập vào tài khoản <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Anthropic Console</a></li>
              <li>Chọn API Keys từ menu</li>
              <li>Tạo và sao chép API key</li>
            </ol>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X size={16} />
            Huỷ
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            Lưu API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;

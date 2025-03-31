
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { X, Save, Key, ExternalLink } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_KEY_STORAGE_KEY = 'claude-api-key';

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();
  const [apiKeyStatus, setApiKeyStatus] = useState<'empty' | 'invalid' | 'valid'>('empty');

  // Load saved API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeyStatus(savedKey.startsWith('sk-') ? 'valid' : 'invalid');
    } else {
      setApiKeyStatus('empty');
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

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Định dạng không hợp lệ",
        description: "API key Claude phải bắt đầu bằng 'sk-'",
        variant: "destructive",
      });
      setApiKeyStatus('invalid');
      return;
    }

    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    setApiKeyStatus('valid');
    
    toast({
      title: "Thành công",
      description: "API key đã được lưu",
    });
    
    // Dispatch a storage event so other components can react to API key change
    window.dispatchEvent(new Event('storage'));
    
    onClose();
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    
    if (!value.trim()) {
      setApiKeyStatus('empty');
    } else if (!value.startsWith('sk-')) {
      setApiKeyStatus('invalid');
    } else {
      setApiKeyStatus('valid');
    }
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
            placeholder="Claude API Key... (bắt đầu bằng sk-)"
            value={apiKey}
            onChange={handleApiKeyChange}
            type="password"
            className={`font-mono ${apiKeyStatus === 'invalid' ? 'border-red-500' : ''}`}
          />
          
          {apiKeyStatus === 'invalid' && (
            <Alert variant="destructive" className="py-2">
              <AlertTitle className="text-sm">API key không hợp lệ</AlertTitle>
              <AlertDescription className="text-xs">
                API key Claude phải bắt đầu bằng 'sk-'
              </AlertDescription>
            </Alert>
          )}
          
          {apiKeyStatus === 'empty' && (
            <Alert className="py-2 bg-amber-50 border-amber-200">
              <AlertTitle className="text-sm">API key bắt buộc</AlertTitle>
              <AlertDescription className="text-xs">
                Bạn cần nhập API key của Claude để sử dụng chức năng tạo minigame
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>Để lấy API key:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Đăng nhập vào tài khoản <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center gap-1 inline-flex">Anthropic Console <ExternalLink size={12} /></a></li>
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
          <Button 
            onClick={handleSave} 
            className="gap-2" 
            disabled={apiKeyStatus === 'empty' || apiKeyStatus === 'invalid'}
          >
            <Save size={16} />
            Lưu API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;


import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface OpenAIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, useOpenAIAsPrimary?: boolean) => void;
  currentKey: string | null;
  allowEmpty?: boolean;
  useOpenAIAsPrimary?: boolean;
}

const OpenAIKeyModal: React.FC<OpenAIKeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentKey,
  allowEmpty = false,
  useOpenAIAsPrimary = false
}) => {
  const [apiKey, setApiKey] = useState<string>(currentKey || '');
  const [isPrimaryAPI, setIsPrimaryAPI] = useState<boolean>(useOpenAIAsPrimary);
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim() && !allowEmpty) {
      toast({
        title: "API Key Required",
        description: "Vui lòng nhập API key của bạn.",
        variant: "destructive",
      });
      return;
    }

    if (apiKey.trim() && !apiKey.startsWith('sk-')) {
      toast({
        title: "API Key Không Hợp Lệ",
        description: "API key OpenAI phải bắt đầu bằng sk-",
        variant: "destructive",
      });
      return;
    }

    onSave(apiKey, isPrimaryAPI);
    onClose();
  };
  
  const handleRemoveKey = () => {
    if (allowEmpty) {
      setApiKey('');
      onSave('', false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-white/20" aria-describedby="api-key-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              OpenAI API Key
            </span>
          </DialogTitle>
          <DialogDescription id="api-key-description">
            Nhập API key OpenAI để cải thiện chất lượng minigame tạo ra.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-background/50 border-white/20"
            />
            
            {apiKey.trim() && (
              <div className="flex items-center space-x-2 mt-4">
                <Switch 
                  id="use-openai-primary"
                  checked={isPrimaryAPI}
                  onCheckedChange={setIsPrimaryAPI}
                />
                <Label htmlFor="use-openai-primary" className="cursor-pointer">
                  Sử dụng OpenAI làm API chính thay vì Gemini
                </Label>
              </div>
            )}
            
            {isPrimaryAPI && apiKey.trim() && (
              <div className="flex items-start gap-2 mt-3 p-2 rounded border border-primary/20 bg-primary/5">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Khi bật chế độ này, hệ thống sẽ sử dụng mô hình GPT-4o Mini của OpenAI để tạo game trực tiếp thay vì dùng Gemini.
                </p>
              </div>
            )}
            
            {allowEmpty && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded border border-yellow-500/20 bg-yellow-500/5">
                <Info className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Bạn có thể để trống API key. Khi đó, chỉ model Gemini sẽ được sử dụng và chế độ Canvas sẽ tự động được bật.
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Key của bạn sẽ được lưu trên trình duyệt và không được gửi đến máy chủ của chúng tôi.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          {allowEmpty && currentKey && (
            <Button variant="destructive" onClick={handleRemoveKey}>
              Xóa Key
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500">
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenAIKeyModal;

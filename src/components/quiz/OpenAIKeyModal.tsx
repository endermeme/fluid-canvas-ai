
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';

interface OpenAIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string | null;
}

const OpenAIKeyModal: React.FC<OpenAIKeyModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [apiKey, setApiKey] = useState<string>(currentKey || '');
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Vui lòng nhập API key của bạn.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "API Key Không Hợp Lệ",
        description: "API key OpenAI phải bắt đầu bằng sk-",
        variant: "destructive",
      });
      return;
    }

    onSave(apiKey);
    toast({
      title: "API Key Đã Lưu",
      description: "API key OpenAI của bạn đã được lưu thành công.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              OpenAI API Key
            </span>
          </DialogTitle>
          <DialogDescription>
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
            <p className="text-xs text-muted-foreground">
              Key của bạn sẽ được lưu trên trình duyệt và không được gửi đến máy chủ của chúng tôi.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
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

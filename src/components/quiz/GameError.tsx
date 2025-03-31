
import React, { useEffect, useRef } from 'react';
import { X, RefreshCw, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { animateBlockCreation } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import ApiKeySettings from './ApiKeySettings';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface GameErrorProps {
  errorMessage: string;
  onRetry: () => void;
  topic: string;
}

const GameError: React.FC<GameErrorProps> = ({ errorMessage, onRetry, topic }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showApiSettings, setShowApiSettings] = React.useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (containerRef.current) {
      animateBlockCreation(containerRef.current);
    }
  }, []);
  
  const handleOpenApiSettings = () => {
    setShowApiSettings(true);
    toast({
      title: "Cài Đặt API",
      description: "Kiểm tra và cập nhật API key của bạn.",
    });
  };
  
  const isApiKeyError = errorMessage.includes('API key') || 
    errorMessage.includes('kết nối') ||
    errorMessage.includes('vượt quá giới hạn API') ||
    errorMessage.includes('server') ||
    errorMessage.toLowerCase().includes('cors');
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full w-full space-y-6 opacity-0 scale-95 p-4"
    >
      <div className="text-red-500 bg-red-100 dark:bg-red-950/30 p-4 rounded-full">
        <X size={48} />
      </div>
      
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <AlertTitle className="text-lg font-medium">Lỗi khi tạo minigame</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Button 
          onClick={onRetry} 
          size="lg"
          className="transition-transform active:scale-95 w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Thử Lại
        </Button>
        
        <Button 
          onClick={handleOpenApiSettings} 
          size="lg"
          variant={isApiKeyError ? "default" : "outline"}
          className="transition-transform active:scale-95 w-full"
        >
          <Settings className="mr-2 h-4 w-4" /> Cài Đặt API Key
        </Button>
        
        {isApiKeyError && (
          <div className="text-sm text-center text-muted-foreground mt-2 space-y-2">
            <p>Lỗi này có thể do API key không hợp lệ hoặc CORS</p>
            <p>API key Claude phải bắt đầu bằng <code className="bg-muted px-1 py-0.5 rounded">sk-</code></p>
            <a 
              href="https://console.anthropic.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline flex items-center gap-1 justify-center"
            >
              Tạo API key tại Anthropic Console
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
      
      <ApiKeySettings 
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
      />
    </div>
  );
};

export default GameError;

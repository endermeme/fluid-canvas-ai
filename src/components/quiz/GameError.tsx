
import React, { useEffect, useRef } from 'react';
import { X, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { animateBlockCreation } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import ApiKeySettings from './ApiKeySettings';

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
    errorMessage.includes('kết nối tới API') ||
    errorMessage.includes('vượt quá giới hạn API');
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full w-full space-y-6 opacity-0 scale-95"
    >
      <div className="text-red-500 bg-red-100 dark:bg-red-950/30 p-4 rounded-full">
        <X size={48} />
      </div>
      <p className="text-lg text-center max-w-md px-4">{errorMessage}</p>
      
      <div className="flex gap-3">
        <Button 
          onClick={onRetry} 
          size="lg"
          className="transition-transform active:scale-95"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Thử Lại
        </Button>
        
        {isApiKeyError && (
          <Button 
            onClick={handleOpenApiSettings} 
            size="lg"
            variant="outline"
            className="transition-transform active:scale-95"
          >
            <Settings className="mr-2 h-4 w-4" /> Cài Đặt API Key
          </Button>
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

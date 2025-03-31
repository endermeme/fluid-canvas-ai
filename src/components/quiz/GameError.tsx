
import React, { useEffect, useRef } from 'react';
import { X, RefreshCw, Settings, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { animateBlockCreation } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import ApiKeySettings from './ApiKeySettings';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    errorMessage.includes('key không hợp lệ') ||
    errorMessage.includes('kết nối') ||
    errorMessage.includes('vượt quá giới hạn API') ||
    errorMessage.includes('server') ||
    errorMessage.toLowerCase().includes('unauthorized');
  
  const isCorsError = errorMessage.toLowerCase().includes('cors') ||
    errorMessage.toLowerCase().includes('proxy') ||
    errorMessage.includes('kết nối') ||
    errorMessage.includes('404');
    
  const isParseError = errorMessage.toLowerCase().includes('parse') ||
    errorMessage.toLowerCase().includes('phân tích') ||
    errorMessage.toLowerCase().includes('xử lý dữ liệu');
  
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
            <p>Lỗi này có thể do API key không hợp lệ</p>
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
        
        {isCorsError && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTitle>Lỗi CORS / Network</AlertTitle>
            <AlertDescription className="text-sm">
              <p className="mb-2">Hệ thống đang sử dụng CORS proxy để kết nối tới Claude API. Proxy này có thể bị giới hạn truy cập hoặc không hoạt động.</p>
              <p>Đã thử sử dụng nhiều proxy khác nhau nhưng không thành công. Vui lòng thử lại sau hoặc thử chủ đề khác.</p>
            </AlertDescription>
          </Alert>
        )}
        
        {isParseError && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle>Lỗi Phân Tích Dữ Liệu</AlertTitle>
            <AlertDescription className="text-sm">
              <p className="mb-2">Không thể xử lý phản hồi từ API. Điều này có thể do định dạng phản hồi không hợp lệ.</p>
              <p>Vui lòng thử chủ đề đơn giản hơn hoặc thử lại sau.</p>
            </AlertDescription>
          </Alert>
        )}
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="troubleshooting">
            <AccordionTrigger className="text-sm font-normal">
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Hướng dẫn khắc phục
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm space-y-2 text-muted-foreground">
              <p>1. <strong>Kiểm tra API key</strong>: Đảm bảo API key Claude bắt đầu bằng "sk-" và được nhập đúng.</p>
              <p>2. <strong>Thử chủ đề khác</strong>: Một số chủ đề có thể quá phức tạp hoặc gây lỗi.</p>
              <p>3. <strong>Thử lại sau</strong>: Proxy CORS có thể bị giới hạn truy cập tạm thời.</p>
              <p>4. <strong>Kiểm tra kết nối mạng</strong>: Đảm bảo bạn có kết nối internet ổn định.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <ApiKeySettings 
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
      />
    </div>
  );
};

export default GameError;

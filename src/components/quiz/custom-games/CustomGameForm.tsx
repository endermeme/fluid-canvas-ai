import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, Info, Code, Key, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator } from '../generator/AIGameGenerator';
import { MiniGame } from '../generator/types';
import { GameSettingsData } from '../types';
import GameLoading from '../GameLoading';
import { Input } from '@/components/ui/input';
import { tryOpenAIGeneration } from '../generator/openaiGenerator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import fs from 'fs';
import path from 'path';

interface CustomGameFormProps {
  onGenerate: (content: string, game?: MiniGame) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useCanvas, setUseCanvas] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyField, setShowApiKeyField] = useState(true);
  const [apiKeyValidated, setApiKeyValidated] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the singleton pattern
  const gameGenerator = AIGameGenerator.getInstance();

  // Check for environment variable or stored API key on component mount
  useEffect(() => {
    // First check for environment variable
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envKey) {
      // If environment variable exists, no need to show API key field
      setShowApiKeyField(false);
      setApiKeyValidated(true);
      (window as any).OPENAI_API_KEY = envKey;
      return;
    }
    
    // Fallback to localStorage
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setShowApiKeyField(false);
      setApiKeyValidated(true);
      // Set OpenAI API key in window for global access
      (window as any).OPENAI_API_KEY = storedKey;
    }
  }, []);

  const getPlaceholderText = () => {
    return 'Mô tả chi tiết game bạn muốn tạo. Hãy bao gồm thể loại game, giao diện, cách chơi và bất kỳ yêu cầu đặc biệt nào.\n\nVí dụ: "Tạo một trò chơi xếp hình với 9 mảnh ghép hình ảnh về vũ trụ, có âm thanh khi hoàn thành và hiệu ứng ngôi sao khi người chơi thắng."';
  };

  const toggleApiKeyField = () => {
    setShowApiKeyField(!showApiKeyField);
  };

  const validateApiKey = (key: string) => {
    // Basic validation to check if key has correct format (starts with 'sk-')
    return key.trim().startsWith('sk-') && key.trim().length > 10;
  };

  const saveApiKeyToEnv = (key: string) => {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      const envContent = `VITE_OPENAI_API_KEY=${key}\n`;
      
      fs.writeFileSync(envPath, envContent);
      console.log('API key saved to .env.local');
    } catch (error) {
      console.error('Error saving API key:', error);
    }
  };

  const saveApiKey = () => {
    setApiKeyError(null);
    
    if (!apiKey.trim()) {
      setApiKeyError("API Key không được để trống");
      return;
    }
    
    if (!validateApiKey(apiKey)) {
      setApiKeyError("API Key không hợp lệ. Key phải bắt đầu bằng 'sk-'");
      return;
    }
    
    localStorage.setItem('openai_api_key', apiKey.trim());
    saveApiKeyToEnv(apiKey.trim());  // Thêm dòng này
    
    setShowApiKeyField(false);
    setApiKeyValidated(true);
    
    toast({
      title: "API Key đã được lưu",
      description: "API Key của bạn đã được lưu vào trình duyệt và .env.local",
    });
    
    (window as any).OPENAI_API_KEY = apiKey.trim();
  };

  const clearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setShowApiKeyField(true);
    setApiKeyValidated(false);
    (window as any).OPENAI_API_KEY = null;
    
    toast({
      title: "API Key đã được xóa",
      description: "API Key đã được xóa khỏi trình duyệt",
    });
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng mô tả game bạn muốn tạo",
        variant: "destructive"
      });
      return;
    }

    // Check for environment variable first
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envKey) {
      // If we have an env key, set it globally and continue
      (window as any).OPENAI_API_KEY = envKey;
    } else if (!apiKeyValidated) {
      // No env key and no validated API key from localStorage
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập và lưu API Key của OpenAI",
        variant: "destructive"
      });
      setShowApiKeyField(true);
      return;
    } else {
      // No env key, but we have a localStorage key
      const currentApiKey = apiKey.trim() || localStorage.getItem('openai_api_key');
      if (!currentApiKey) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy API Key. Vui lòng nhập lại.",
          variant: "destructive"
        });
        setShowApiKeyField(true);
        return;
      }
      
      (window as any).OPENAI_API_KEY = currentApiKey;
    }

    // Tạo requestId độc nhất với timestamp và random string
    const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    const timestamp = new Date().toISOString();
    
    // Log thông tin request trong console với styled console group
    console.groupCollapsed(
      `%c 🎮 GAME REQUEST ${requestId} %c ${content.substring(0, 40)}${content.length > 40 ? '...' : ''}`,
      'background: #6f42c1; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      'font-weight: bold;'
    );
    console.log('%c 📝 Content', 'font-weight: bold; color: #6f42c1;', content);
    console.log('%c ⏱️ Timestamp', 'font-weight: bold; color: #6f42c1;', timestamp);
    console.log('%c 🔑 Request ID', 'font-weight: bold; color: #6f42c1;', requestId);
    console.log('%c 📊 Content Length', 'font-weight: bold; color: #6f42c1;', content.length, 'characters');
    console.log('%c 🤖 Model', 'font-weight: bold; color: #6f42c1;', 'gpt-4o-mini');
    console.log('%c 🎨 Canvas Mode', 'font-weight: bold; color: #6f42c1;', useCanvas ? 'Enabled' : 'Disabled');
    console.groupEnd();

    setIsGenerating(true);
    
    try {
      // Set canvas mode according to the toggle
      gameGenerator.setCanvasMode(useCanvas);
      
      // Minimal settings with metadata including canvas mode
      const settings: GameSettingsData = {
        category: 'custom',
        requestMetadata: {
          requestId: requestId,
          timestamp: timestamp,
          contentLength: content.length,
          source: 'openai',
          useCanvas: useCanvas
        }
      };
      
      // Log when starting the API request
      console.group(
        `%c 🚀 API REQUEST ${requestId} %c Generating game`,
        'background: #2ea44f; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'font-weight: bold;'
      );
      console.log('%c 📋 User Prompt', 'font-weight: bold; color: #2ea44f;', content);
      console.log('%c 🤖 Model', 'font-weight: bold; color: #2ea44f;', 'gpt-4o-mini');
      console.log('%c ⏳ Request Start Time', 'font-weight: bold; color: #2ea44f;', new Date().toISOString());
      console.groupEnd();
      
      // Measure processing time
      const startTime = performance.now();
      
      // Use OpenAI directly instead of gameGenerator
      const game = await tryOpenAIGeneration(content, settings);
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      // Log API results
      console.group(
        `%c ✅ API RESPONSE ${requestId} %c Completed in ${duration}s`,
        'background: #2ea44f; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'font-weight: bold;'
      );
      console.log('%c 📊 Result', 'font-weight: bold; color: #2ea44f;', {
        success: !!game,
        title: game?.title || 'N/A',
        contentSize: game?.content?.length || 0,
        processingTime: `${duration}s`,
        timestamp: new Date().toISOString()
      });
      
      // Log code sample (if any, only showing first 200 characters)
      if (game?.content) {
        console.log('%c 🧩 Code Sample', 'font-weight: bold; color: #2ea44f;', 
          game.content.substring(0, 200) + (game.content.length > 200 ? '...' : ''));
      }
      console.groupEnd();
      
      if (game) {
        toast({
          title: "Đã tạo trò chơi",
          description: `Trò chơi đã được tạo thành công với HTML, CSS và JavaScript.`,
        });
        
        onGenerate(content, game);
      } else {
        throw new Error("Không thể tạo game");
      }
    } catch (error: any) {
      // Check for API key related errors
      const errorMessage = error?.message || "Không thể tạo game";
      const isApiKeyError = 
        errorMessage.includes("API key") || 
        errorMessage.includes("authorization") || 
        errorMessage.includes("401") ||
        errorMessage.includes("Unauthorized");
      
      // Log error with more information
      console.group(
        `%c ❌ API ERROR ${requestId} %c Generation failed`,
        'background: #d73a49; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'font-weight: bold;'
      );
      console.log('%c 🚨 Error Details', 'font-weight: bold; color: #d73a49;', error);
      console.log('%c 📝 Request Content', 'font-weight: bold; color: #d73a49;', content);
      console.log('%c ⏱️ Error Time', 'font-weight: bold; color: #d73a49;', new Date().toISOString());
      console.log('%c 🔍 Stack Trace', 'font-weight: bold; color: #d73a49;', error instanceof Error ? error.stack : 'No stack trace available');
      console.log('%c 🔑 API Key Valid', 'font-weight: bold; color: #d73a49;', apiKeyValidated);
      console.groupEnd();
      
      if (isApiKeyError) {
        setApiKeyValidated(false);
        setShowApiKeyField(true);
        setApiKeyError("API Key không hợp lệ hoặc đã hết hạn. Vui lòng nhập key mới.");
        toast({
          title: "Lỗi API Key",
          description: "API Key không hợp lệ hoặc đã hết hạn. Vui lòng nhập key mới.",
          variant: "destructive"
        });
        localStorage.removeItem('openai_api_key');
      } else {
        toast({
          title: "Lỗi tạo game",
          description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
          variant: "destructive"
        });
      }
      onGenerate(content);
    } finally {
      setIsGenerating(false);
      
      // Log end of the entire process
      console.log(
        `%c 🏁 REQUEST COMPLETE ${requestId} %c ${new Date().toISOString()}`,
        'background: #6f42c1; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'font-weight: bold;'
      );
    }
  };

  const handleCancel = () => {
    if (window.location.pathname === '/quiz' && !window.location.search) {
      navigate('/');
    } else {
      onCancel();
    }
  };

  if (isGenerating) {
    return <GameLoading topic={content} />;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto w-full">
      <Card className="bg-background/70 backdrop-blur-sm border-primary/20 shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <div className="p-2 rounded-lg bg-primary/10">
              <Code className="h-6 w-6 text-primary" />
            </div>
            Tạo trò chơi tùy chỉnh với OpenAI
          </h2>
          <p className="text-muted-foreground">Mô tả chi tiết game bạn muốn tạo và AI sẽ xây dựng nó cho bạn</p>
        </div>
        
        <div className="space-y-4">
          {apiKeyError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lỗi API Key</AlertTitle>
              <AlertDescription>{apiKeyError}</AlertDescription>
            </Alert>
          )}
          
          {showApiKeyField && (
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <div className="flex justify-between items-start mb-2">
                <Label htmlFor="api-key" className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  OpenAI API Key
                </Label>
              </div>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setApiKeyError(null);
                  }}
                  placeholder="sk-..."
                  className="font-mono text-sm"
                />
                <Button 
                  onClick={saveApiKey} 
                  variant="outline" 
                  className="shrink-0"
                  disabled={!apiKey.trim() || !apiKey.trim().startsWith('sk-')}
                >
                  Lưu
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                API Key sẽ được lưu trong trình duyệt của bạn và không được gửi đến máy chủ của chúng tôi
              </p>
            </div>
          )}
          
          {!showApiKeyField && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Key className="h-3 w-3" />
                API Key đã được lưu
              </div>
              <div className="flex gap-2">
                <Button onClick={toggleApiKeyField} variant="ghost" size="sm" className="h-7 text-xs">
                  Chỉnh sửa
                </Button>
                <Button onClick={clearApiKey} variant="ghost" size="sm" className="h-7 text-xs text-destructive">
                  Xóa
                </Button>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="content" className="flex items-center gap-2 text-base">
                <SparklesIcon className="h-4 w-4 mr-2" /> 
                Mô tả game của bạn
              </Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="use-canvas" className="text-sm cursor-pointer">Canvas mode</Label>
                <input
                  id="use-canvas"
                  type="checkbox"
                  checked={useCanvas}
                  onChange={(e) => setUseCanvas(e.target.checked)}
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
              </div>
            </div>
            <Textarea
              id="content"
              placeholder={getPlaceholderText()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="mt-2 font-mono text-sm border-primary/20 focus-visible:ring-primary/30 w-full"
            />
          </div>
          
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-start gap-2 bg-primary/5 p-3 rounded-lg">
              <Info className="w-4 h-4 text-primary mt-1" />
              <p className="text-sm text-muted-foreground">
                AI sẽ tạo một game hoàn chỉnh với HTML, CSS và JavaScript dựa trên mô tả của bạn. Bạn càng mô tả chi tiết, AI càng tạo ra game phù hợp với ý tưởng của bạn.
                {useCanvas && " Canvas mode sẽ tạo game sử dụng HTML5 Canvas cho hiệu ứng đồ họa tốt hơn."}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="border-primary/20 hover:border-primary/30 hover:bg-primary/5"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isGenerating || !content.trim() || (!apiKeyValidated && !validateApiKey(apiKey))}
              className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              Tạo với OpenAI
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameForm;

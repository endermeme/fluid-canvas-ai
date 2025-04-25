
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, Info, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator } from '../generator/geminiGenerator';
import { MiniGame } from '../generator/types';
import { GameSettingsData } from '../types';
import GameLoading from '../GameLoading';
import { GEMINI_MODELS, API_VERSION, API_BASE_URL } from '@/constants/api-constants';

interface CustomGameFormProps {
  onGenerate: (content: string, game?: MiniGame) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the singleton pattern
  const gameGenerator = AIGameGenerator.getInstance();

  const getPlaceholderText = () => {
    return 'Mô tả chi tiết game bạn muốn tạo. Hãy bao gồm thể loại game, giao diện, cách chơi và bất kỳ yêu cầu đặc biệt nào.\n\nVí dụ: "Tạo một trò chơi xếp hình với 9 mảnh ghép hình ảnh về vũ trụ, có âm thanh khi hoàn thành và hiệu ứng ngôi sao khi người chơi thắng."';
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
    console.log('%c 🤖 Model', 'font-weight: bold; color: #6f42c1;', GEMINI_MODELS.CUSTOM_GAME);
    console.log('%c 🤖 API Version', 'font-weight: bold; color: #6f42c1;', API_VERSION);
    console.log('%c 🤖 API Endpoint', 'font-weight: bold; color: #6f42c1;', `${API_BASE_URL}/${API_VERSION}/models/${GEMINI_MODELS.CUSTOM_GAME}:generateContent`);
    console.groupEnd();

    setIsGenerating(true);
    
    try {
      // Minimal settings
      const settings: GameSettingsData = {
        category: 'custom'
      };
      
      // Log when starting the API request
      console.group(
        `%c 🚀 API REQUEST ${requestId} %c Generating game`,
        'background: #2ea44f; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'font-weight: bold;'
      );
      console.log('%c 📋 User Prompt', 'font-weight: bold; color: #2ea44f;', content);
      console.log('%c 🤖 Model', 'font-weight: bold; color: #2ea44f;', GEMINI_MODELS.CUSTOM_GAME);
      console.log('%c 🤖 API Endpoint', 'font-weight: bold; color: #2ea44f;', `${API_BASE_URL}/${API_VERSION}/models/${GEMINI_MODELS.CUSTOM_GAME}:generateContent`);
      console.log('%c ⏳ Request Start Time', 'font-weight: bold; color: #2ea44f;', new Date().toISOString());
      console.groupEnd();
      
      // Measure processing time
      const startTime = performance.now();
      const game = await gameGenerator.generateMiniGame(content, settings);
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
    } catch (error) {
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
      console.groupEnd();
      
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
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
            Tạo trò chơi tùy chỉnh với AI
          </h2>
          <p className="text-muted-foreground">Mô tả chi tiết game bạn muốn tạo và AI sẽ xây dựng nó cho bạn</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="content" className="flex items-center gap-2 text-base">
              <SparklesIcon className="h-4 w-4 text-primary" /> 
              Mô tả game của bạn
            </Label>
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
              disabled={isGenerating || !content.trim()}
              className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              Tạo với AI
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameForm;

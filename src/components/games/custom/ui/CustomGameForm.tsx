import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, Info, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator } from '../../generator';
import { MiniGame } from '../../generator/types';
import { GameSettingsData } from '../../shared/types';
import GameLoading from '../../shared/GameLoading';
import { GEMINI_MODELS } from '@/constants/api-constants';

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

    setIsGenerating(true);
    
    try {
      // Luôn sử dụng canvas mode
      gameGenerator.setCanvasMode(true);
      
      // Minimal settings
      const settings: GameSettingsData = {
        category: 'custom'
      };
      
      const game = await gameGenerator.generateMiniGame(content, settings);
      
      if (game) {
        toast({
          title: "Đã tạo trò chơi",
          description: `Trò chơi đã được tạo thành công.`,
        });
        
        onGenerate(content, game);
      } else {
        throw new Error("Không thể tạo game");
      }
    } catch (error) {
      console.error("Lỗi khi tạo game:", error);
      
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
      onGenerate(content);
    } finally {
      setIsGenerating(false);
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Card className="max-w-3xl w-full mx-auto bg-background/70 backdrop-blur-xl border border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="p-3.5 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/10 shadow-sm">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Tạo trò chơi tùy chỉnh với AI
                </h2>
                <p className="text-muted-foreground mt-2.5 max-w-xl mx-auto">
                  Mô tả chi tiết game bạn muốn tạo và AI sẽ xây dựng nó cho bạn
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="relative">
              <Label htmlFor="content" className="flex items-center justify-center gap-2.5 text-lg font-medium mb-4">
                <SparklesIcon className="h-5 w-5 text-primary" /> 
                Mô tả game của bạn
              </Label>
              <Textarea
                id="content"
                placeholder={getPlaceholderText()}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
                className="font-mono text-sm border-2 border-primary/20 bg-white/20 backdrop-blur-md focus-visible:ring-primary/30 focus-visible:border-primary/40 rounded-2xl transition-all duration-300 resize-none shadow-inner"
              />
              <div className="absolute -z-10 w-full h-full max-w-md blur-3xl bg-primary/5 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            </div>
            
            <div className="flex items-start gap-3.5 p-5 bg-primary/5 rounded-2xl border border-primary/15 backdrop-blur-sm">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                AI sẽ tạo một game hoàn chỉnh với HTML, CSS và JavaScript dựa trên mô tả của bạn. Game sẽ sử dụng HTML5 Canvas cho hiệu ứng đồ họa tốt hơn.
              </p>
            </div>
            
            <div className="flex justify-center gap-5 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="min-w-[130px] border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all duration-300"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isGenerating || !content.trim()}
                className="min-w-[220px] bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 font-medium"
              >
                <SparklesIcon className="h-5 w-5 mr-2.5" />
                Tạo với AI
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameForm;

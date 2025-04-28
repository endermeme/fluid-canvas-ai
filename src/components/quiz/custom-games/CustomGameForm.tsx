
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <Card className="max-w-4xl w-full bg-background/80 backdrop-blur-xl border-primary/20 shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
                <Code className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Tạo trò chơi tùy chỉnh với AI
                </h2>
                <p className="text-muted-foreground mt-1">
                  Mô tả chi tiết game bạn muốn tạo và AI sẽ xây dựng nó cho bạn
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="content" className="flex items-center gap-2 text-lg font-medium mb-3">
                <SparklesIcon className="h-5 w-5 text-primary" /> 
                Mô tả game của bạn
              </Label>
              <Textarea
                id="content"
                placeholder={getPlaceholderText()}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="font-mono text-sm border-2 border-primary/20 bg-white/30 backdrop-blur-sm focus-visible:ring-primary/30 focus-visible:border-primary/40 rounded-xl transition-all duration-200 resize-none shadow-inner"
              />
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                AI sẽ tạo một game hoàn chỉnh với HTML, CSS và JavaScript dựa trên mô tả của bạn. Game sẽ sử dụng HTML5 Canvas cho hiệu ứng đồ họa tốt hơn.
              </p>
            </div>
            
            <div className="flex justify-between gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="min-w-[120px] border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all duration-200"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isGenerating || !content.trim()}
                className="min-w-[200px] bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 rounded-xl shadow-lg shadow-primary/20 transition-all duration-200"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
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

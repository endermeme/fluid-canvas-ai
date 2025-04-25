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
                AI sẽ tạo một game hoàn chỉnh với HTML, CSS và JavaScript dựa trên mô tả của bạn. Game sẽ sử dụng HTML5 Canvas cho hiệu ứng đồ họa tốt hơn.
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


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, Info, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MiniGame } from '../generator/types';

interface CustomGameFormProps {
  onGenerate: (content: string, game?: MiniGame) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useCanvas, setUseCanvas] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

    // Just pass the content to the parent component which will handle the actual generation
    onGenerate(content);
  };

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
            <div className="flex justify-between items-center">
              <Label htmlFor="content" className="flex items-center gap-2 text-base">
                <SparklesIcon className="h-4 w-4 text-primary" /> 
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
              onClick={onCancel}
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

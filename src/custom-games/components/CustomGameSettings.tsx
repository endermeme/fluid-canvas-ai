
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { GameSettingsData } from '../../types/game';
import { Wand, Gamepad } from 'lucide-react';

interface CustomGameSettingsProps {
  onGenerate: (prompt: string, useCanvas: boolean) => void;
  isGenerating: boolean;
}

const CustomGameSettings: React.FC<CustomGameSettingsProps> = ({ 
  onGenerate,
  isGenerating
}) => {
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [useCanvas, setUseCanvas] = useState<boolean>(true);
  
  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt, useCanvas);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const suggestions = [
    'Học phép cộng với số từ 1-10',
    'Ghi nhớ các quốc gia và thủ đô',
    'Từ vựng tiếng Anh về động vật',
    'Luyện đọc nốt nhạc',
    'Phân biệt các loại hình học',
    'Ghép cặp các danh nhân với thành tựu'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col h-full">
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-background border-primary/20">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Gamepad className="h-6 w-6 text-primary" />
          <span>Tạo Game Tùy Chỉnh</span>
        </h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Chủ đề hoặc Yêu cầu</Label>
            <Textarea
              id="prompt"
              placeholder="Nhập chủ đề hoặc mô tả game bạn muốn tạo... (VD: Trò chơi học từ vựng tiếng Anh về động vật)"
              className="min-h-[120px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select
                value={difficulty}
                onValueChange={setDifficulty}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Chọn độ khó" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questionCount">Số câu hỏi/phần tử: {questionCount}</Label>
              <Slider
                id="questionCount"
                min={5}
                max={20}
                step={1}
                value={[questionCount]}
                onValueChange={(value) => setQuestionCount(value[0])}
                className="py-4"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="useCanvas">Tối ưu hóa cho Canvas/Iframe</Label>
              <Switch
                id="useCanvas"
                checked={useCanvas}
                onCheckedChange={setUseCanvas}
              />
            </div>
            <p className="text-sm text-muted-foreground">Bật chức năng này sẽ tối ưu game cho việc hiển thị trong iframe.</p>
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          >
            <Wand className="mr-2 h-5 w-5" />
            {isGenerating ? 'Đang tạo...' : 'Tạo Game'}
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <h3 className="text-lg font-medium col-span-full mb-2">Gợi ý</h3>
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            className="justify-start bg-background/50 hover:bg-background/80 border-primary/20"
            onClick={() => setPrompt(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CustomGameSettings;

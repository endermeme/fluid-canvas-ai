
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GameSettingsData } from '@/pages/Quiz';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gamepad, X } from 'lucide-react';

interface GameSettingsProps {
  onStart: (settings: GameSettingsData) => void;
  topic: string;
  initialSettings?: GameSettingsData;
  inDrawer?: boolean;
  inModal?: boolean;
  onCancel?: () => void;
}

const GameSettings = ({ onStart, topic, initialSettings, inDrawer = false, inModal = false, onCancel }: GameSettingsProps) => {
  const [settings, setSettings] = useState<GameSettingsData>({
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
  });

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSliderChange = (name: keyof GameSettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof GameSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`${inDrawer || inModal ? '' : 'h-full w-full'} flex flex-col items-center justify-center p-6 bg-background`}>
      <div className={`w-full max-w-md bg-card rounded-lg ${inModal ? '' : 'shadow-lg'} p-6 ${inDrawer || inModal ? '' : 'border'}`}>
        <div className="flex items-center justify-center mb-6">
          <Gamepad className="h-10 w-10 text-primary mr-2" />
          <h2 className="text-2xl font-bold">Cài Đặt Minigame</h2>
        </div>

        {topic && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Chủ đề: <span className="text-primary">{topic}</span></h3>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="difficulty">Độ Khó</Label>
            <Select 
              value={settings.difficulty} 
              onValueChange={(value) => handleSelectChange('difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="questionCount">Số Câu Hỏi: {settings.questionCount}</Label>
            </div>
            <Slider 
              id="questionCount"
              min={5} 
              max={20} 
              step={1} 
              value={[settings.questionCount]} 
              onValueChange={(value) => handleSliderChange('questionCount', value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="timePerQuestion">Thời Gian Mỗi Câu: {settings.timePerQuestion} giây</Label>
            </div>
            <Slider 
              id="timePerQuestion"
              min={10} 
              max={60} 
              step={5} 
              value={[settings.timePerQuestion]} 
              onValueChange={(value) => handleSliderChange('timePerQuestion', value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="category">Thể Loại</Label>
            <Select 
              value={settings.category} 
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Kiến thức chung</SelectItem>
                <SelectItem value="history">Lịch sử</SelectItem>
                <SelectItem value="science">Khoa học</SelectItem>
                <SelectItem value="geography">Địa lý</SelectItem>
                <SelectItem value="arts">Nghệ thuật</SelectItem>
                <SelectItem value="sports">Thể thao</SelectItem>
                <SelectItem value="math">Toán học</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex gap-3">
            {onCancel && (
              <Button 
                variant="outline"
                className="w-full"
                onClick={onCancel}
              >
                Hủy
              </Button>
            )}
            <Button 
              className="w-full"
              onClick={() => onStart(settings)}
            >
              Bắt Đầu Trò Chơi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettings;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'vi' | 'en';
  useCanvas: boolean;
}

interface GameSettingsProps {
  onStart: (settings: GameSettingsData) => void;
  initialSettings: GameSettingsData;
  onCancel: () => void;
  inModal?: boolean;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  onStart,
  initialSettings,
  onCancel,
  inModal = false
}) => {
  const [settings, setSettings] = React.useState<GameSettingsData>(initialSettings);

  const handleDifficultyChange = (value: 'easy' | 'medium' | 'hard') => {
    setSettings({ ...settings, difficulty: value });
  };

  const handleLanguageChange = (value: 'vi' | 'en') => {
    setSettings({ ...settings, language: value });
  };

  const handleUseCanvasChange = (value: boolean) => {
    setSettings({ ...settings, useCanvas: value });
  };

  const handleSubmit = () => {
    onStart(settings);
  };

  return (
    <Card className={inModal ? "w-full" : "w-[500px]"}>
      <CardHeader>
        <CardTitle>Cài đặt trò chơi</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="difficulty" className="text-right">
            Độ khó
          </Label>
          <Select
            id="difficulty"
            value={settings.difficulty}
            onValueChange={handleDifficultyChange}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Dễ</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="hard">Khó</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="language" className="text-right">
            Ngôn ngữ
          </Label>
          <Select
            id="language"
            value={settings.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="useCanvas" className="text-right">
            Sử dụng Canvas
          </Label>
          <Switch
            id="useCanvas"
            checked={settings.useCanvas}
            onCheckedChange={handleUseCanvasChange}
            className="col-span-3"
          />
        </div> */}
      </CardContent>
      <div className="flex justify-end space-x-2 p-4">
        <Button variant="ghost" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button onClick={handleSubmit}>Bắt đầu</Button>
      </div>
    </Card>
  );
};

export default GameSettings;

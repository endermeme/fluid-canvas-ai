
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GameSettingsProps {
  settings: {
    difficulty: string;
    soundEnabled: boolean;
    autoSave: boolean;
    theme: string;
    gameSpeed: number;
  };
  onSettingsChange: (settings: any) => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt game</CardTitle>
          <CardDescription>
            Tùy chỉnh các thiết lập cho trò chơi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Độ khó</Label>
            <Select
              value={settings.difficulty}
              onValueChange={(value) => updateSetting('difficulty', value)}
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
            <Label htmlFor="theme">Giao diện</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => updateSetting('theme', value)}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Chọn giao diện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Sáng</SelectItem>
                <SelectItem value="dark">Tối</SelectItem>
                <SelectItem value="auto">Tự động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="speed">Tốc độ game: {settings.gameSpeed}x</Label>
            <Slider
              id="speed"
              min={0.5}
              max={2}
              step={0.1}
              value={[settings.gameSpeed]}
              onValueChange={(value) => updateSetting('gameSpeed', value[0])}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="flex flex-col space-y-1">
              <span>Âm thanh</span>
              <span className="text-sm text-muted-foreground">
                Bật/tắt hiệu ứng âm thanh
              </span>
            </Label>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autosave" className="flex flex-col space-y-1">
              <span>Tự động lưu</span>
              <span className="text-sm text-muted-foreground">
                Tự động lưu tiến độ game
              </span>
            </Label>
            <Switch
              id="autosave"
              checked={settings.autoSave}
              onCheckedChange={(checked) => updateSetting('autoSave', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSettings;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { GameSettingsData } from './types';

interface GameSettingsProps {
  topic: string;
  onStart: (settings: GameSettingsData) => void;
  initialSettings?: GameSettingsData;
  onCancel?: () => void;
  inModal?: boolean;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  topic,
  onStart,
  initialSettings,
  onCancel,
  inModal = false
}) => {
  const [settings, setSettings] = React.useState<GameSettingsData>({
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    useTimer: true,
    category: 'general',
    language: 'vi',
    ...initialSettings
  });

  const handleSubmit = () => {
    onStart(settings);
  };

  const updateSetting = <K extends keyof GameSettingsData>(
    key: K,
    value: GameSettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={inModal ? "border-0 shadow-none" : ""}>
      <CardHeader>
        <CardTitle>Cài đặt game</CardTitle>
        <CardDescription>
          Tùy chỉnh cài đặt cho game về "{topic}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Độ khó</Label>
            <Select 
              value={settings.difficulty} 
              onValueChange={(value: 'easy' | 'medium' | 'hard') => updateSetting('difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionCount">Số câu hỏi</Label>
            <Input
              id="questionCount"
              type="number"
              min="5"
              max="50"
              value={settings.questionCount}
              onChange={(e) => updateSetting('questionCount', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="useTimer">Sử dụng thời gian</Label>
            <Switch
              id="useTimer"
              checked={settings.useTimer}
              onCheckedChange={(checked) => updateSetting('useTimer', checked)}
            />
          </div>

          {settings.useTimer && (
            <div className="space-y-2">
              <Label htmlFor="timePerQuestion">Thời gian mỗi câu (giây)</Label>
              <Input
                id="timePerQuestion"
                type="number"
                min="10"
                max="300"
                value={settings.timePerQuestion}
                onChange={(e) => updateSetting('timePerQuestion', parseInt(e.target.value))}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Hủy
            </Button>
          )}
          <Button onClick={handleSubmit}>
            Bắt đầu game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSettings;

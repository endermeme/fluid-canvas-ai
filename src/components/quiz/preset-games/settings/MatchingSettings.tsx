import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Puzzle, Type, Trophy, Medal, Timer, Clock4, Bug, Link } from 'lucide-react';

export interface MatchingSettingsData {
  pairCount: number;
  timeLimit: number;
  bonusTimePerMatch: number;
  allowPartialMatching: boolean;
  prompt: string;
  debugMode: boolean;
}

interface MatchingSettingsProps {
  onStart: (settings: MatchingSettingsData) => void;
  topic: string;
  onCancel?: () => void;
}

const MatchingSettings: React.FC<MatchingSettingsProps> = ({ onStart, topic, onCancel }) => {
  const [settings, setSettings] = useState<MatchingSettingsData>({
    pairCount: 8,
    timeLimit: 300,
    bonusTimePerMatch: 5,
    allowPartialMatching: false,
    prompt: topic || '',
    debugMode: false
  });

  useEffect(() => {
    if (topic && topic !== settings.prompt) {
      setSettings(prev => ({ ...prev, prompt: topic }));
    }
  }, [topic, settings.prompt]);

  const handleSliderChange = (name: keyof MatchingSettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof MatchingSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof MatchingSettingsData, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (name: keyof MatchingSettingsData, value: string) => {
    if (name === 'prompt') {
      setSettings(prev => ({ ...prev, prompt: value }));
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setSettings(prev => ({ ...prev, [name]: numValue }));
      }
    }
  };

  const handleStart = () => {
    onStart(settings);
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-primary/20 shadow-lg p-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center p-2 rounded-full bg-primary/10">
              <Puzzle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cài Đặt Nối Từ
            </h2>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4 text-primary" /> Nội dung nối từ
                </Label>
                <Textarea
                  id="prompt"
                  value={settings.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Nhập nội dung chi tiết cho trò chơi nối từ"
                  className="border-primary/20 bg-white/50 min-h-[80px] max-h-[120px]"
                />
              </div>
              
              {/* Pair Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="pairCount" className="text-sm font-medium flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" /> Số Cặp Nối
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.pairCount}</span>
                </div>
                <Slider 
                  id="pairCount"
                  min={4} 
                  max={15} 
                  step={1} 
                  value={[settings.pairCount]} 
                  onValueChange={(value) => handleSliderChange('pairCount', value)}
                />
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="timeLimit" className="text-sm font-medium flex items-center gap-2">
                    <Clock4 className="h-4 w-4 text-primary" /> Tổng Thời Gian
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.timeLimit} giây</span>
                </div>
                <Slider 
                  id="timeLimit"
                  min={30} 
                  max={300} 
                  step={10} 
                  value={[settings.timeLimit]} 
                  onValueChange={(value) => handleSliderChange('timeLimit', value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Bonus Time Per Match */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bonusTimePerMatch" className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" /> Thưởng thời gian
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.bonusTimePerMatch} giây</span>
                </div>
                <Slider 
                  id="bonusTimePerMatch"
                  min={0} 
                  max={15} 
                  step={1} 
                  value={[settings.bonusTimePerMatch]} 
                  onValueChange={(value) => handleSliderChange('bonusTimePerMatch', value)}
                />
              </div>

              {/* Matching Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 p-3 bg-primary/5 rounded-lg">
                  <Label htmlFor="allowPartialMatching" className="text-sm font-medium flex items-center gap-2 flex-1">
                    <Link className="h-4 w-4 text-primary" /> Cho phép nối một phần
                  </Label>
                  <Switch 
                    id="allowPartialMatching" 
                    checked={settings.allowPartialMatching}
                    onCheckedChange={(checked) => handleSwitchChange('allowPartialMatching', checked)} 
                  />
                </div>
              </div>


              {/* Debug Mode */}
              <div className="border-t border-border/50 pt-3">
                <div className="flex items-center justify-between gap-3 p-3 bg-orange-50 rounded-lg">
                  <Label htmlFor="debugMode" className="text-sm font-medium flex items-center gap-2 flex-1">
                    <Bug className="h-4 w-4 text-orange-500" /> 
                    <span>Debug Mode</span>
                    <span className="text-xs text-orange-600 bg-orange-200 px-2 py-0.5 rounded-full">DEV</span>
                  </Label>
                  <Switch 
                    id="debugMode" 
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSwitchChange('debugMode', checked)} 
                  />
                </div>
                {settings.debugMode && (
                  <p className="text-sm text-muted-foreground mt-2 ml-7">
                    Sử dụng dữ liệu mẫu để test giao diện ngay lập tức
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 mt-6 border-t border-border/20 flex gap-3">
            {onCancel && (
              <Button 
                variant="outline"
                className="flex-1 border-primary/20 hover:border-primary/30"
                onClick={onCancel}
              >
                Hủy
              </Button>
            )}
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-primary/80"
              onClick={handleStart}
            >
              Bắt Đầu Trò Chơi
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MatchingSettings;
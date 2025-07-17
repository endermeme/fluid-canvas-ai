import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Type, Trophy, Medal, Timer, Clock4, Bug, Eye } from 'lucide-react';

export interface MemorySettingsData {
  gridSize: number;
  timeLimit: number;
  allowHints: boolean;
  hintPenalty: number;
  prompt: string;
  debugMode: boolean;
}

interface MemorySettingsProps {
  onStart: (settings: MemorySettingsData) => void;
  topic: string;
  onCancel?: () => void;
}

const MemorySettings: React.FC<MemorySettingsProps> = ({ onStart, topic, onCancel }) => {
  const [settings, setSettings] = useState<MemorySettingsData>({
    gridSize: 4,
    timeLimit: 120,
    allowHints: true,
    hintPenalty: 5,
    prompt: topic || '',
    debugMode: false
  });

  useEffect(() => {
    if (topic && topic !== settings.prompt) {
      setSettings(prev => ({ ...prev, prompt: topic }));
    }
  }, [topic, settings.prompt]);

  const handleSliderChange = (name: keyof MemorySettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof MemorySettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof MemorySettingsData, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (name: keyof MemorySettingsData, value: string) => {
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
              <BrainCircuit className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cài Đặt Trò Chơi Ghi Nhớ
            </h2>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4 text-primary" /> Nội dung thẻ ghép
                </Label>
                <Textarea
                  id="prompt"
                  value={settings.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Nhập nội dung chi tiết cho trò chơi ghi nhớ"
                  className="border-primary/20 bg-white/50 min-h-[80px] max-h-[120px]"
                />
              </div>
              
              {/* Grid Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="gridSize" className="text-sm font-medium flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" /> Kích Thước Lưới (số ô)
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.gridSize}x{settings.gridSize} = {settings.gridSize * settings.gridSize} ô</span>
                </div>
                <Slider 
                  id="gridSize"
                  min={2} 
                  max={10} 
                  step={1} 
                  value={[settings.gridSize]} 
                  onValueChange={(value) => handleSliderChange('gridSize', value)}
                />
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="timeLimit" className="text-sm font-medium flex items-center gap-2">
                    <Clock4 className="h-4 w-4 text-primary" /> Thời Gian Tối Đa
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.timeLimit} giây</span>
                </div>
                <Slider 
                  id="timeLimit"
                  min={60} 
                  max={300} 
                  step={30} 
                  value={[settings.timeLimit]} 
                  onValueChange={(value) => handleSliderChange('timeLimit', value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Memory Game Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                  <Switch 
                    id="allowHints" 
                    checked={settings.allowHints}
                    onCheckedChange={(checked) => handleSwitchChange('allowHints', checked)} 
                  />
                  <Label htmlFor="allowHints" className="text-sm font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" /> Cho phép gợi ý
                  </Label>
                </div>

              </div>

              {/* Hint Penalty */}
              {settings.allowHints && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="hintPenalty" className="text-sm font-medium flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" /> Phạt Thời Gian Gợi Ý
                    </Label>
                    <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.hintPenalty} giây</span>
                  </div>
                  <Slider 
                    id="hintPenalty"
                    min={0} 
                    max={20} 
                    step={1} 
                    value={[settings.hintPenalty]} 
                    onValueChange={(value) => handleSliderChange('hintPenalty', value)}
                  />
                </div>
              )}

              {/* Debug Mode */}
              <div className="border-t border-border/50 pt-3">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Switch 
                    id="debugMode" 
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSwitchChange('debugMode', checked)} 
                  />
                  <Label htmlFor="debugMode" className="text-sm font-medium flex items-center gap-2">
                    <Bug className="h-4 w-4 text-orange-500" /> 
                    <span>Debug Mode</span>
                    <span className="text-xs text-orange-600 bg-orange-200 px-2 py-0.5 rounded-full">DEV</span>
                  </Label>
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

export default MemorySettings;
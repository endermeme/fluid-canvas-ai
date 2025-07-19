import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpDown, Type, Trophy, Medal, Timer, Clock4, Bug, Eye, ChevronDown, ChevronRight } from 'lucide-react';

export interface OrderingSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  sentenceCount: number;
  timeLimit: number;
  bonusTimePerCorrect: number;
  showHints: boolean;
  showProgress: boolean;
  prompt: string;
  debugMode: boolean;
}

interface OrderingSettingsProps {
  onStart: (settings: OrderingSettingsData) => void;
  topic: string;
  onCancel?: () => void;
}

const OrderingSettings: React.FC<OrderingSettingsProps> = ({ onStart, topic, onCancel }) => {
  const [settings, setSettings] = useState<OrderingSettingsData>({
    difficulty: 'medium',
    sentenceCount: 5,
    timeLimit: 300,
    bonusTimePerCorrect: 15,
    showHints: true,
    showProgress: true,
    prompt: topic || '',
    debugMode: false
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    if (topic && topic !== settings.prompt) {
      setSettings(prev => ({ ...prev, prompt: topic }));
    }
  }, [topic, settings.prompt]);

  const handleSliderChange = (name: keyof OrderingSettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof OrderingSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof OrderingSettingsData, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (name: keyof OrderingSettingsData, value: string) => {
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
              <ArrowUpDown className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cài Đặt Sắp Xếp Câu
            </h2>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4 text-primary" /> Nội dung câu sắp xếp
                </Label>
                <Textarea
                  id="prompt"
                  value={settings.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Nhập nội dung chi tiết cho trò chơi sắp xếp câu"
                  className="border-primary/20 bg-white/50 min-h-[80px] max-h-[120px]"
                />
              </div>
              
              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="flex items-center gap-2 text-sm font-medium">
                  <Trophy className="h-4 w-4 text-primary" /> Độ Khó
                </Label>
                <Select 
                  value={settings.difficulty} 
                  onValueChange={(value) => handleSelectChange('difficulty', value)}
                >
                  <SelectTrigger className="border-primary/20 bg-white/50">
                    <SelectValue placeholder="Chọn độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Settings */}
              <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-0 h-auto border-t border-border/50 pt-4"
                  >
                    <h3 className="text-sm font-medium text-primary">Cài đặt nâng cao</h3>
                    {isAdvancedOpen ? (
                      <ChevronDown className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-3 mt-3">
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Switch 
                      id="showHints" 
                      checked={settings.showHints}
                      onCheckedChange={(checked) => handleSwitchChange('showHints', checked)} 
                    />
                    <Label htmlFor="showHints" className="text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" /> Hiển thị gợi ý
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Switch 
                      id="showProgress" 
                      checked={settings.showProgress}
                      onCheckedChange={(checked) => handleSwitchChange('showProgress', checked)} 
                    />
                    <Label htmlFor="showProgress" className="text-sm font-medium">
                      Hiển thị tiến độ
                    </Label>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Right Column - Sliders */}
            <div className="space-y-4">
              {/* Sentence Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="sentenceCount" className="text-sm font-medium flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" /> Số Câu
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.sentenceCount}</span>
                </div>
                <Slider 
                  id="sentenceCount"
                  min={3} 
                  max={15} 
                  step={1} 
                  value={[settings.sentenceCount]} 
                  onValueChange={(value) => handleSliderChange('sentenceCount', value)}
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
                  min={120} 
                  max={600} 
                  step={30} 
                  value={[settings.timeLimit]} 
                  onValueChange={(value) => handleSliderChange('timeLimit', value)}
                />
              </div>

              {/* Bonus Time Per Correct */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bonusTimePerCorrect" className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" /> Thưởng Thời Gian
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.bonusTimePerCorrect} giây</span>
                </div>
                <Slider 
                  id="bonusTimePerCorrect"
                  min={0} 
                  max={30} 
                  step={5} 
                  value={[settings.bonusTimePerCorrect]} 
                  onValueChange={(value) => handleSliderChange('bonusTimePerCorrect', value)}
                />
              </div>
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

export default OrderingSettings;
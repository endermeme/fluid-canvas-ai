import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Search, Type, Medal, Timer, Clock4, Bug, List, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface WordSearchSettingsData {
  wordCount: number;
  timeLimit: number;
  bonusTimePerWord: number;
  allowDiagonalWords: boolean;
  showWordList: boolean;
  showProgress: boolean;
  prompt: string;
  debugMode: boolean;
}

interface WordSearchSettingsProps {
  onStart: (settings: WordSearchSettingsData) => void;
  topic: string;
  onCancel?: () => void;
}

const WordSearchSettings: React.FC<WordSearchSettingsProps> = ({ onStart, topic, onCancel }) => {
  const [settings, setSettings] = useState<WordSearchSettingsData>({
    wordCount: 10,
    timeLimit: 300,
    bonusTimePerWord: 15,
    allowDiagonalWords: true,
    showWordList: true,
    showProgress: true,
    prompt: topic || '',
    debugMode: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (topic && topic !== settings.prompt) {
      setSettings(prev => ({ ...prev, prompt: topic }));
    }
  }, [topic, settings.prompt]);

  const handleSliderChange = (name: keyof WordSearchSettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof WordSearchSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof WordSearchSettingsData, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (name: keyof WordSearchSettingsData, value: string) => {
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
        <Card className="border-primary/20 shadow-lg p-6 min-h-[50vh]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center p-2 rounded-full bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cài Đặt Tìm Từ
            </h2>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4 text-primary" /> Chủ đề từ cần tìm
                </Label>
                <Textarea
                  id="prompt"
                  value={settings.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Nhập chủ đề chi tiết cho trò chơi tìm từ"
                  className="border-primary/20 bg-white/50 min-h-[80px] max-h-[120px]"
                />
              </div>

              {/* Advanced Settings */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-primary/20">
                    Cài đặt nâng cao
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Switch 
                      id="allowDiagonalWords" 
                      checked={settings.allowDiagonalWords}
                      onCheckedChange={(checked) => handleSwitchChange('allowDiagonalWords', checked)} 
                    />
                    <Label htmlFor="allowDiagonalWords" className="text-sm font-medium">
                      Cho phép từ chéo
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Switch 
                      id="showWordList" 
                      checked={settings.showWordList}
                      onCheckedChange={(checked) => handleSwitchChange('showWordList', checked)} 
                    />
                    <Label htmlFor="showWordList" className="text-sm font-medium flex items-center gap-2">
                      <List className="h-4 w-4 text-primary" /> Hiển thị danh sách từ
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

            {/* Right Column */}
            <div className="space-y-4">
              {/* Word Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="wordCount" className="text-sm font-medium flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" /> Số Từ Cần Tìm
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.wordCount}</span>
                </div>
                <Slider 
                  id="wordCount"
                  min={5} 
                  max={20} 
                  step={1} 
                  value={[settings.wordCount]} 
                  onValueChange={(value) => handleSliderChange('wordCount', value)}
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

              {/* Bonus Time Per Word */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bonusTimePerWord" className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" /> Thưởng Thời Gian
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.bonusTimePerWord} giây</span>
                </div>
                <Slider 
                  id="bonusTimePerWord"
                  min={5} 
                  max={30} 
                  step={5} 
                  value={[settings.bonusTimePerWord]} 
                  onValueChange={(value) => handleSliderChange('bonusTimePerWord', value)}
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

export default WordSearchSettings;
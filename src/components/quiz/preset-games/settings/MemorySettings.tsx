import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Type, Trophy, Medal, Timer, Clock4, Bug, Eye, Settings, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface MemorySettingsData {
  gridSize: number;
  totalTime: number;  // renamed from timeLimit
  allowHints: boolean;
  hintPenalty: number;
  prompt: string;
  debugMode: boolean;
  // Advanced settings
  bonusTime: number;
  wrongPenalty: number;
  comboBonus: boolean;
  mistakePenalty: number;
  timeBonus: boolean;
}

interface MemorySettingsProps {
  onStart: (settings: MemorySettingsData) => void;
  topic: string;
  onCancel?: () => void;
}

const MemorySettings: React.FC<MemorySettingsProps> = ({ onStart, topic, onCancel }) => {
  const [settings, setSettings] = useState<MemorySettingsData>({
    gridSize: 4,
    totalTime: 300,
    allowHints: true,
    hintPenalty: 5,
    prompt: topic || '',
    debugMode: false,
    // Advanced settings defaults
    bonusTime: 3,
    wrongPenalty: 0.2,
    comboBonus: true,
    mistakePenalty: 2,
    timeBonus: true
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

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
                  max={8} 
                  step={1} 
                  value={[settings.gridSize]} 
                  onValueChange={(value) => handleSliderChange('gridSize', value)}
                />
                {settings.debugMode && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                    <strong>Debug:</strong> Grid {settings.gridSize}x{settings.gridSize} = {settings.gridSize * settings.gridSize} thẻ ({settings.gridSize * settings.gridSize / 2} cặp)
                  </div>
                )}
              </div>

               {/* Total Time */}
               <div className="space-y-2">
                 <div className="flex justify-between items-center">
                   <Label htmlFor="totalTime" className="text-sm font-medium flex items-center gap-2">
                     <Clock4 className="h-4 w-4 text-primary" /> Tổng Thời Gian
                   </Label>
                   <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.totalTime} giây</span>
                 </div>
                 <Slider 
                   id="totalTime"
                   min={30} 
                   max={300} 
                   step={10} 
                   value={[settings.totalTime]} 
                   onValueChange={(value) => handleSliderChange('totalTime', value)}
                 />
               </div>

               {/* Advanced Settings */}
               <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                 <CollapsibleTrigger asChild>
                   <Button variant="outline" className="w-full justify-between border-primary/20">
                     <span className="flex items-center gap-2">
                       <Settings className="h-4 w-4" />
                       Cài đặt nâng cao
                     </span>
                     <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                   </Button>
                 </CollapsibleTrigger>
                 <CollapsibleContent className="mt-3 space-y-3">
                   {/* Bonus Time */}
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <Label className="text-sm font-medium">Thưởng thời gian (giây/cặp)</Label>
                       <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.bonusTime}s</span>
                     </div>
                     <Slider 
                       min={1} 
                       max={10} 
                       step={1} 
                       value={[settings.bonusTime]} 
                       onValueChange={(value) => handleSliderChange('bonusTime', value)}
                     />
                   </div>

                   {/* Wrong Penalty */}
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <Label className="text-sm font-medium">Phạt lật sai (điểm)</Label>
                       <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.wrongPenalty}</span>
                     </div>
                     <Slider 
                       min={0} 
                       max={0.5} 
                       step={0.1} 
                       value={[settings.wrongPenalty]} 
                       onValueChange={(value) => handleSliderChange('wrongPenalty', value)}
                     />
                   </div>

                   {/* Mistake Penalty */}
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <Label className="text-sm font-medium">Phạt thời gian sai lầm (giây)</Label>
                       <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.mistakePenalty}s</span>
                     </div>
                     <Slider 
                       min={0} 
                       max={10} 
                       step={1} 
                       value={[settings.mistakePenalty]} 
                       onValueChange={(value) => handleSliderChange('mistakePenalty', value)}
                     />
                   </div>

                   {/* Advanced Options */}
                   <div className="space-y-3">
                     <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                       <Switch 
                         checked={settings.comboBonus}
                         onCheckedChange={(checked) => handleSwitchChange('comboBonus', checked)} 
                       />
                       <Label className="text-sm font-medium">
                         Thưởng combo
                       </Label>
                     </div>

                     <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                       <Switch 
                         checked={settings.timeBonus}
                         onCheckedChange={(checked) => handleSwitchChange('timeBonus', checked)} 
                       />
                       <Label className="text-sm font-medium">
                         Thưởng thời gian
                       </Label>
                     </div>
                   </div>
                 </CollapsibleContent>
               </Collapsible>
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
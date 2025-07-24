import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Type, Trophy, Medal, Timer, Clock, Clock4, Bug, RotateCcw, Settings, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface FlashcardsSettingsData {
  cardCount: number;
  autoFlip: boolean;
  showHints: boolean;
  allowSkip: boolean;
  prompt: string;
  debugMode: boolean;
  // Advanced settings
  repetitionMode: 'normal' | 'spaced' | 'adaptive';
  confidenceLevel: boolean;
  autoFlipTime: number;
  wrongPenalty: number;
  timeBonus: boolean;
}

interface FlashcardsSettingsProps {
  onStart: (settings: FlashcardsSettingsData) => void;
  topic: string;
  onCancel?: () => void;
}

const FlashcardsSettings: React.FC<FlashcardsSettingsProps> = ({ onStart, topic, onCancel }) => {
  const [settings, setSettings] = useState<FlashcardsSettingsData>({
    cardCount: 10,
    autoFlip: true,
    showHints: true,
    allowSkip: true,
    prompt: topic || '',
    debugMode: false,
    // Advanced settings defaults
    repetitionMode: 'normal',
    confidenceLevel: false,
    autoFlipTime: 3,
    wrongPenalty: 0.1,
    timeBonus: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (topic && topic !== settings.prompt) {
      setSettings(prev => ({ ...prev, prompt: topic }));
    }
  }, [topic, settings.prompt]);

  const handleSliderChange = (name: keyof FlashcardsSettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof FlashcardsSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof FlashcardsSettingsData, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (name: keyof FlashcardsSettingsData, value: string) => {
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
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cài Đặt Thẻ Ghi Nhớ
            </h2>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4 text-primary" /> Nội dung thẻ học
                </Label>
                <Textarea
                  id="prompt"
                  value={settings.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Nhập nội dung chi tiết cho thẻ học"
                  className="border-primary/20 bg-white/50 min-h-[80px] max-h-[120px]"
                />
              </div>
              
              {/* Card Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="cardCount" className="text-sm font-medium flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" /> Số Thẻ
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.cardCount}</span>
                </div>
                <Slider 
                  id="cardCount"
                  min={5} 
                  max={25} 
                  step={1} 
                  value={[settings.cardCount]} 
                  onValueChange={(value) => handleSliderChange('cardCount', value)}
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
                   {/* Repetition Mode */}
                   <div className="space-y-2">
                     <Label className="text-sm font-medium">Chế độ lặp lại</Label>
                     <Select value={settings.repetitionMode} onValueChange={(value: 'normal' | 'spaced' | 'adaptive') => setSettings(prev => ({ ...prev, repetitionMode: value }))}>
                       <SelectTrigger className="border-primary/20">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="normal">Bình thường</SelectItem>
                         <SelectItem value="spaced">Lặp cách quãng</SelectItem>
                         <SelectItem value="adaptive">Thích ứng</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   {/* Auto Flip Time */}
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <Label className="text-sm font-medium">Thời gian tự động lật (giây)</Label>
                       <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.autoFlipTime}s</span>
                     </div>
                     <Slider 
                       min={1} 
                       max={10} 
                       step={1} 
                       value={[settings.autoFlipTime]} 
                       onValueChange={(value) => handleSliderChange('autoFlipTime', value)}
                     />
                   </div>

                   {/* Advanced Options */}
                   <div className="space-y-3">
                     <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                       <Switch 
                         checked={settings.confidenceLevel}
                         onCheckedChange={(checked) => handleSwitchChange('confidenceLevel', checked)} 
                       />
                       <Label className="text-sm font-medium">
                         Đánh giá độ tự tin
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

                   {/* Wrong Penalty */}
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <Label className="text-sm font-medium">Phạt sai (điểm)</Label>
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
                 </CollapsibleContent>
               </Collapsible>
             </div>

             {/* Right Column */}
            <div className="space-y-4">
              {/* Flashcard Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                  <Switch 
                    id="autoFlip" 
                    checked={settings.autoFlip}
                    onCheckedChange={(checked) => handleSwitchChange('autoFlip', checked)} 
                  />
                  <Label htmlFor="autoFlip" className="text-sm font-medium">
                    Tự động lật thẻ
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                  <Switch 
                    id="showHints" 
                    checked={settings.showHints}
                    onCheckedChange={(checked) => handleSwitchChange('showHints', checked)} 
                  />
                  <Label htmlFor="showHints" className="text-sm font-medium">
                    Hiển thị gợi ý
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                  <Switch 
                    id="allowSkip" 
                    checked={settings.allowSkip}
                    onCheckedChange={(checked) => handleSwitchChange('allowSkip', checked)} 
                  />
                  <Label htmlFor="allowSkip" className="text-sm font-medium">
                    Cho phép bỏ qua
                  </Label>
                </div>
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

export default FlashcardsSettings;
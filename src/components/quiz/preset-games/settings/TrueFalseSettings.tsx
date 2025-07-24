import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, Type, Trophy, Medal, Timer, Clock, Clock4, Bug, Settings } from 'lucide-react';

export interface TrueFalseSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  totalTime: number;
  bonusTimePerCorrect: number;
  showExplanation: boolean;
  shuffleQuestions: boolean;
  allowSkip: boolean;
  prompt: string;
  debugMode: boolean;
  // Advanced settings
  negativeMarking: boolean;
  timeBonus: boolean;
  wrongPenalty: number;
  timePerQuestionAdvanced: number;
}

interface TrueFalseSettingsProps {
  onStart: (settings: TrueFalseSettingsData) => void;
  topic: string;
  onCancel?: () => void;
}

const TrueFalseSettings: React.FC<TrueFalseSettingsProps> = ({ onStart, topic, onCancel }) => {
  const [settings, setSettings] = useState<TrueFalseSettingsData>({
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    totalTime: 30,
    bonusTimePerCorrect: 30,
    showExplanation: true,
    shuffleQuestions: true,
    allowSkip: false,
    prompt: topic || '',
    debugMode: false,
    // Advanced settings defaults
    negativeMarking: false,
    timeBonus: true,
    wrongPenalty: 0.25,
    timePerQuestionAdvanced: 20
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    if (topic && topic !== settings.prompt) {
      setSettings(prev => ({ ...prev, prompt: topic }));
    }
  }, [topic, settings.prompt]);

  const handleSliderChange = (name: keyof TrueFalseSettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof TrueFalseSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof TrueFalseSettingsData, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (name: keyof TrueFalseSettingsData, value: string) => {
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
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cài Đặt Đúng hay Sai
            </h2>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4 text-primary" /> Nội dung câu hỏi
                </Label>
                <Textarea
                  id="prompt"
                  value={settings.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Nhập nội dung chi tiết cho trò chơi đúng/sai"
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
                    variant="outline" 
                    className="w-full justify-between border-primary/20 bg-white/50 hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      Cài đặt nâng cao
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isAdvancedOpen ? 'Thu gọn' : 'Mở rộng'}
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <Switch 
                        id="showExplanation" 
                        checked={settings.showExplanation}
                        onCheckedChange={(checked) => handleSwitchChange('showExplanation', checked)} 
                      />
                      <Label htmlFor="showExplanation" className="text-sm font-medium">
                        Hiển thị giải thích
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <Switch 
                        id="shuffleQuestions" 
                        checked={settings.shuffleQuestions}
                        onCheckedChange={(checked) => handleSwitchChange('shuffleQuestions', checked)} 
                      />
                      <Label htmlFor="shuffleQuestions" className="text-sm font-medium">
                        Xáo trộn câu hỏi
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

                     <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                       <Switch 
                         id="negativeMarking" 
                         checked={settings.negativeMarking}
                         onCheckedChange={(checked) => handleSwitchChange('negativeMarking', checked)} 
                       />
                       <Label htmlFor="negativeMarking" className="text-sm font-medium">
                         Trừ điểm khi sai
                       </Label>
                     </div>

                     <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                       <Switch 
                         id="timeBonus" 
                         checked={settings.timeBonus}
                         onCheckedChange={(checked) => handleSwitchChange('timeBonus', checked)} 
                       />
                       <Label htmlFor="timeBonus" className="text-sm font-medium">
                         Thưởng thời gian
                       </Label>
                     </div>

                     {/* Wrong Penalty */}
                     {settings.negativeMarking && (
                       <div className="space-y-2">
                         <div className="flex justify-between items-center">
                           <Label className="text-sm font-medium">Phạt sai (điểm)</Label>
                           <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.wrongPenalty}</span>
                         </div>
                         <Slider 
                           min={0.1} 
                           max={1.0} 
                           step={0.05} 
                           value={[settings.wrongPenalty]} 
                           onValueChange={(value) => handleSliderChange('wrongPenalty', value)}
                         />
                       </div>
                     )}

                     {/* Time Per Question Advanced */}
                     <div className="space-y-2">
                       <div className="flex justify-between items-center">
                         <Label className="text-sm font-medium">Thời gian nâng cao (giây/câu)</Label>
                         <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.timePerQuestionAdvanced}s</span>
                       </div>
                       <Slider 
                         min={10} 
                         max={60} 
                         step={5} 
                         value={[settings.timePerQuestionAdvanced]} 
                         onValueChange={(value) => handleSliderChange('timePerQuestionAdvanced', value)}
                       />
                     </div>
                   </div>
                 </CollapsibleContent>
               </Collapsible>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Question Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="questionCount" className="text-sm font-medium flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" /> Số Câu Hỏi
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.questionCount}</span>
                </div>
                <Slider 
                  id="questionCount"
                  min={5} 
                  max={25} 
                  step={1} 
                  value={[settings.questionCount]} 
                  onValueChange={(value) => handleSliderChange('questionCount', value)}
                />
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

              {/* Time Per Question */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="timePerQuestion" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Thời Gian Mỗi Câu
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.timePerQuestion} giây</span>
                </div>
                <Slider 
                  id="timePerQuestion"
                  min={30} 
                  max={300} 
                  step={10} 
                  value={[settings.timePerQuestion]} 
                  onValueChange={(value) => handleSliderChange('timePerQuestion', value)}
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
                  min={30} 
                  max={300} 
                  step={10} 
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

export default TrueFalseSettings;
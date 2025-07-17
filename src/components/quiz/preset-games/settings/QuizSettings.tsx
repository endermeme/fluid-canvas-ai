import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Type, Trophy, Medal, Timer, Clock, Clock4, Bug } from 'lucide-react';

export interface QuizSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  totalTime: number;
  bonusTime: number;
  useTimer: boolean;
  showExplanation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  prompt: string;
  debugMode: boolean;
}

interface QuizSettingsProps {
  onStart: (settings: QuizSettingsData) => void;
  topic: string;
  onCancel?: () => void;
}

const QuizSettings: React.FC<QuizSettingsProps> = ({ onStart, topic, onCancel }) => {
  const [settings, setSettings] = useState<QuizSettingsData>({
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    totalTime: 0,
    bonusTime: 5,
    useTimer: true,
    showExplanation: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    prompt: topic || '',
    debugMode: false
  });

  useEffect(() => {
    if (topic && topic !== settings.prompt) {
      setSettings(prev => ({ ...prev, prompt: topic }));
    }
  }, [topic, settings.prompt]);

  const handleSliderChange = (name: keyof QuizSettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof QuizSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof QuizSettingsData, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (name: keyof QuizSettingsData, value: string) => {
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
              Cài Đặt Trắc Nghiệm
            </h2>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4 text-primary" /> Nội dung trò chơi
                </Label>
                <Textarea
                  id="prompt"
                  value={settings.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Nhập nội dung chi tiết cho trò chơi trắc nghiệm"
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
                  max={30} 
                  step={1} 
                  value={[settings.questionCount]} 
                  onValueChange={(value) => handleSliderChange('questionCount', value)}
                />
              </div>

              {/* Quiz Options */}
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
                    id="shuffleOptions" 
                    checked={settings.shuffleOptions}
                    onCheckedChange={(checked) => handleSwitchChange('shuffleOptions', checked)} 
                  />
                  <Label htmlFor="shuffleOptions" className="text-sm font-medium">
                    Xáo trộn đáp án
                  </Label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Timer Toggle */}
              <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                <Switch 
                  id="useTimer" 
                  checked={settings.useTimer}
                  onCheckedChange={(checked) => handleSwitchChange('useTimer', checked)} 
                />
                <Label htmlFor="useTimer" className="text-sm font-medium flex items-center gap-2">
                  <Timer className="h-4 w-4 text-primary" /> Sử dụng bộ đếm thời gian
                </Label>
              </div>

              {settings.useTimer && (
                <>
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
                      min={10} 
                      max={120} 
                      step={5} 
                      value={[settings.timePerQuestion]} 
                      onValueChange={(value) => handleSliderChange('timePerQuestion', value)}
                    />
                  </div>

                  {/* Time Settings Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="totalTime" className="text-sm font-medium flex items-center gap-2">
                        <Clock4 className="h-4 w-4 text-primary" /> Tổng thời gian
                      </Label>
                      <Input
                        id="totalTime"
                        type="number"
                        min="0"
                        placeholder="0 = tự động"
                        value={settings.totalTime || 0}
                        onChange={(e) => handleInputChange('totalTime', e.target.value)}
                        className="border-primary/20 bg-white/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bonusTime" className="text-sm font-medium flex items-center gap-2">
                        <Timer className="h-4 w-4 text-primary" /> Thời gian thưởng
                      </Label>
                      <Input
                        id="bonusTime"
                        type="number"
                        min="0"
                        placeholder="Thưởng"
                        value={settings.bonusTime || 0}
                        onChange={(e) => handleInputChange('bonusTime', e.target.value)}
                        className="border-primary/20 bg-white/50"
                      />
                    </div>
                  </div>
                </>
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

export default QuizSettings;
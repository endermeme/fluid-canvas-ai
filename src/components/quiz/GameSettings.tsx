
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GameSettingsData, AIModelType } from './types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, SparklesIcon, Layers, Brain, Settings, Shield } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface GameSettingsProps {
  initialSettings: GameSettingsData;
  onStart: (settings: GameSettingsData) => void;
  onCancel: () => void;
  topic: string;
}

const GameSettings: React.FC<GameSettingsProps> = ({ 
  initialSettings, 
  onStart, 
  onCancel, 
  topic 
}) => {
  const [settings, setSettings] = useState<GameSettingsData>(initialSettings);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Admin settings
  const [adminPassword, setAdminPassword] = useState('1234');
  const [expiryDays, setExpiryDays] = useState(30);
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [requestPlayerInfo, setRequestPlayerInfo] = useState(true);

  const handleStart = () => {
    // Lưu cài đặt admin vào localStorage tạm thời
    localStorage.setItem('temp_admin_settings', JSON.stringify({
      adminPassword,
      expiryDays,
      maxParticipants,
      requestPlayerInfo
    }));
    
    onStart(settings);
  };

  const updateSetting = (key: keyof GameSettingsData, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt trò chơi</CardTitle>
          <CardDescription>
            Tùy chỉnh các thông số cho trò chơi của bạn
            {topic && <span className="block mt-1 font-medium">Chủ đề: {topic}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chế độ AI cho preset games */}
          <div>
            <Label className="flex items-center gap-2.5 text-base font-medium mb-4">
              <Brain className="h-5 w-5 text-primary" /> 
              Chế độ AI
            </Label>
            
            <TooltipProvider>
              <RadioGroup 
                value={settings.aiModelType || 'pro'} 
                onValueChange={(value) => updateSetting('aiModelType', value as AIModelType)}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="flash" 
                    id="flash-preset" 
                    className="border-2 border-orange-400"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="flash-preset" 
                        className="flex items-center cursor-pointer text-sm font-medium"
                      >
                        <Zap className="h-4 w-4 text-orange-500 mr-2" />
                        Chế độ nhanh
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p className="max-w-xs">Dùng mô hình Gemini Flash - nhanh nhưng đơn giản hơn</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="pro" 
                    id="pro-preset" 
                    className="border-2 border-primary"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="pro-preset" 
                        className="flex items-center cursor-pointer text-sm font-medium"
                      >
                        <SparklesIcon className="h-4 w-4 text-primary mr-2" />
                        Bình thường
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p className="max-w-xs">Dùng mô hình Gemini Pro - cân bằng giữa tốc độ và chất lượng</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="super-thinking" 
                    id="super-preset" 
                    className="border-2 border-violet-500"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="super-preset" 
                        className="flex items-center cursor-pointer text-sm font-medium"
                      >
                        <Layers className="h-4 w-4 text-violet-500 mr-2" />
                        Super Thinking
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p className="max-w-xs">Kết hợp hai mô hình: Flash phân tích logic, Pro viết code - độ chính xác cao nhưng chậm hơn</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </RadioGroup>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select value={settings.difficulty} onValueChange={(value) => updateSetting('difficulty', value)}>
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

            <div>
              <Label htmlFor="questionCount">Số lượng câu hỏi</Label>
              <Input
                id="questionCount"
                type="number"
                min="5"
                max="50"
                value={settings.questionCount}
                onChange={(e) => updateSetting('questionCount', parseInt(e.target.value) || 10)}
              />
            </div>

            <div>
              <Label htmlFor="timePerQuestion">Thời gian mỗi câu (giây)</Label>
              <Input
                id="timePerQuestion"
                type="number"
                min="10"
                max="120"
                value={settings.timePerQuestion}
                onChange={(e) => updateSetting('timePerQuestion', parseInt(e.target.value) || 30)}
              />
            </div>

            <div>
              <Label htmlFor="totalTime">Tổng thời gian (giây)</Label>
              <Input
                id="totalTime"
                type="number"
                min="60"
                max="3600"
                value={settings.totalTime}
                onChange={(e) => updateSetting('totalTime', parseInt(e.target.value) || 0)}
                placeholder="0 = không giới hạn"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="prompt">Chủ đề/Nội dung cụ thể</Label>
            <Textarea
              id="prompt"
              value={settings.prompt || topic}
              onChange={(e) => updateSetting('prompt', e.target.value)}
              placeholder="Mô tả chi tiết nội dung bạn muốn tạo..."
              rows={3}
            />
          </div>

          {/* Cài đặt nâng cao */}
          <Collapsible open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 transition-all">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span className="font-medium">Cài đặt quản trị game</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Cài đặt quản trị</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminPasswordPreset" className="text-sm font-medium mb-2 block">
                      Mật khẩu quản trị
                    </Label>
                    <Input
                      id="adminPasswordPreset"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Nhập mật khẩu quản trị"
                      className="bg-white/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expiryDaysPreset" className="text-sm font-medium mb-2 block">
                      Thời gian hết hạn (ngày)
                    </Label>
                    <Input
                      id="expiryDaysPreset"
                      type="number"
                      min="1"
                      max="365"
                      value={expiryDays}
                      onChange={(e) => setExpiryDays(parseInt(e.target.value) || 30)}
                      className="bg-white/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxParticipantsPreset" className="text-sm font-medium mb-2 block">
                      Số người tham gia tối đa
                    </Label>
                    <Input
                      id="maxParticipantsPreset"
                      type="number"
                      min="1"
                      max="1000"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 50)}
                      className="bg-white/50"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requestPlayerInfoPreset"
                      checked={requestPlayerInfo}
                      onChange={(e) => setRequestPlayerInfo(e.target.checked)}
                      className="rounded border-primary/30"
                    />
                    <Label htmlFor="requestPlayerInfoPreset" className="text-sm font-medium">
                      Yêu cầu thông tin người chơi
                    </Label>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button onClick={handleStart}>
              Bắt đầu tạo game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSettings;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GameSettingsData, GameType } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Gamepad, BrainCircuit, Puzzle, Lightbulb, Clock4, Dices, 
  HeartHandshake, PenTool, Timer, Trophy, Clock, Medal, Type, Bug
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { animateToolbarAppear } from '@/lib/animations';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GameSettingsProps {
  onStart: (settings: GameSettingsData) => void;
  topic: string;
  initialSettings?: GameSettingsData;
  inDrawer?: boolean;
  inModal?: boolean;
  onCancel?: () => void;
  gameType?: GameType | null;
}

const GameSettings = ({ 
  onStart, 
  topic, 
  initialSettings, 
  inDrawer = false, 
  inModal = false, 
  onCancel,
  gameType
}: GameSettingsProps) => {
  const isMobile = useIsMobile();
  const [settings, setSettings] = useState<GameSettingsData>({
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
    totalTime: 0,
    bonusTime: 0,
    useTimer: true,
    prompt: topic || '',
    debugMode: false
  });
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    if (topic && topic !== settings.prompt) {
      setSettings(prev => ({ ...prev, prompt: topic }));
    }
  }, [topic, settings.prompt]);

  useEffect(() => {
    if (containerRef.current) {
      animateToolbarAppear(containerRef.current);
    }
  }, []);

  const handleSliderChange = (name: keyof GameSettingsData, value: number[]) => {
    setSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: keyof GameSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof GameSettingsData, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (name: keyof GameSettingsData, value: string) => {
    if (name === 'prompt') {
      setSettings(prev => ({ ...prev, prompt: value }));
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setSettings(prev => ({ ...prev, [name]: numValue }));
      }
    }
  };

  useEffect(() => {
    if (topic) {
      if (topic.includes("Lịch Sử")) {
        handleSelectChange('category', 'history');
      } else if (topic.includes("Địa Lý")) {
        handleSelectChange('category', 'geography');
      } else if (topic.includes("Toán")) {
        handleSelectChange('category', 'math');
      } else if (topic.includes("Từ Vựng")) {
        handleSelectChange('category', 'arts');
      } else if (topic.includes("Khoa Học")) {
        handleSelectChange('category', 'science');
      }
    }
  }, [topic]);

  const handleStart = () => {
    console.log("Starting game with settings:", settings);
    onStart(settings);
  };

  useEffect(() => {
    if (gameType) {
      const sliderConfig = document.getElementById('questionCount') as HTMLInputElement;
      const timeSlider = document.getElementById('timePerQuestion') as HTMLInputElement;
      
      if (gameType.id === 'memory') {
        if (sliderConfig) sliderConfig.max = '12';
        if (timeSlider) timeSlider.min = '1';
      } else if (gameType.id === 'puzzle') {
        if (sliderConfig) sliderConfig.max = '6';
        if (timeSlider) timeSlider.min = '30';
      } else if (gameType.id === 'reflex') {
        if (sliderConfig) sliderConfig.max = '30';
        if (timeSlider) timeSlider.min = '1';
        if (timeSlider) timeSlider.max = '10';
      }
    }
  }, [gameType]);

  const getGameIcon = () => {
    if (!gameType) return <Gamepad className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
    
    switch (gameType.icon) {
      case 'brain-circuit': return <BrainCircuit className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case 'puzzle-piece': return <Puzzle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case 'light-bulb': return <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case 'clock': return <Clock4 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case 'dices': return <Dices className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case 'heart-handshake': return <HeartHandshake className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case 'pen-tool': return <PenTool className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      default: return <Gamepad className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
    }
  };

  const getTimeLabel = () => {
    if (gameType?.id === 'memory') return 'Thời Gian Hiển Thị:';
    if (gameType?.id === 'reflex') return 'Thời Gian Phản Xạ:';
    if (gameType?.id === 'drawing') return 'Thời Gian Vẽ:';
    return 'Thời Gian Mỗi Câu:';
  };

  const getCountLabel = () => {
    if (gameType?.id === 'memory') return 'Số Cặp Thẻ:';
    if (gameType?.id === 'puzzle') return 'Số Mảnh Ghép:';
    if (gameType?.id === 'reflex') return 'Số Lượt:';
    if (gameType?.id === 'drawing') return 'Số Bản Vẽ:';
    return 'Số Câu Hỏi:';
  };

  return (
    <div 
      ref={containerRef} 
      className={`
        w-full h-full flex items-center justify-center 
        ${inModal ? 'p-1' : 'p-2 sm:p-4'} 
        ${inDrawer ? 'py-2' : 'py-2 sm:py-4'}
      `}
    >
      <ScrollArea className="w-full h-full">
        <div className="flex items-center justify-center min-h-full">
          <Card className={`
            w-full border-primary/20 shadow-lg
            ${isMobile || inModal ? 'max-w-full p-3' : 'max-w-4xl p-4 lg:p-6'}
          `}>
            {/* Header - Compact cho màn hình ngang */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 relative">
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <div className="flex items-center justify-center p-1.5 sm:p-2 rounded-full bg-primary/10 backdrop-blur-sm">
                  {getGameIcon()}
                </div>
                <h2 className={`
                  font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent
                  ${isMobile || inModal ? 'text-lg' : 'text-xl lg:text-2xl'}
                `}>
                  Cài Đặt Minigame
                </h2>
              </div>
            </div>

            {/* Main Settings Grid - Responsive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              
              {/* Left Column */}
              <div className="space-y-4">
                {/* Content Input */}
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                    <Type className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> Nội dung trò chơi
                  </Label>
                  <Textarea
                    id="prompt"
                    value={settings.prompt || ''}
                    onChange={(e) => handleInputChange('prompt', e.target.value)}
                    placeholder="Nhập nội dung chi tiết cho trò chơi"
                    className="border-primary/20 bg-white/50 backdrop-blur-sm transition-all shadow-sm hover:border-primary/30 focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                  />
                </div>
                
                {/* Difficulty */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="flex items-center gap-2 text-sm font-medium">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> Độ Khó
                  </Label>
                  <Select 
                    value={settings.difficulty} 
                    onValueChange={(value) => handleSelectChange('difficulty', value)}
                  >
                    <SelectTrigger className="rounded-lg border-primary/20 bg-white/50 backdrop-blur-sm transition-all shadow-sm hover:border-primary/30 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-primary/20 bg-white/95 backdrop-blur-lg shadow-lg">
                      <SelectItem value="easy" className="cursor-pointer focus:bg-primary/10">Dễ</SelectItem>
                      <SelectItem value="medium" className="cursor-pointer focus:bg-primary/10">Trung bình</SelectItem>
                      <SelectItem value="hard" className="cursor-pointer focus:bg-primary/10">Khó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Count */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="questionCount" className="text-sm font-medium flex items-center gap-2">
                      <Medal className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> {getCountLabel()}
                    </Label>
                    <span className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium">{settings.questionCount}</span>
                  </div>
                  <Slider 
                    id="questionCount"
                    min={gameType?.id === 'drawing' ? 1 : (gameType?.id === 'puzzle' ? 2 : 3)} 
                    max={gameType?.id === 'memory' ? 12 : (gameType?.id === 'puzzle' ? 6 : 20)} 
                    step={1} 
                    value={[settings.questionCount]} 
                    onValueChange={(value) => handleSliderChange('questionCount', value)}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Timer Toggle */}
                <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                  <Switch 
                    id="useTimer" 
                    checked={settings.useTimer !== false}
                    onCheckedChange={(checked) => handleSwitchChange('useTimer', checked)} 
                  />
                  <Label htmlFor="useTimer" className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> Sử dụng bộ đếm thời gian
                  </Label>
                </div>

                {settings.useTimer !== false && (
                  <>
                    {/* Time Per Question */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="timePerQuestion" className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> {getTimeLabel()}
                        </Label>
                        <span className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium">{settings.timePerQuestion} giây</span>
                      </div>
                      <Slider 
                        id="timePerQuestion"
                        min={gameType?.id === 'reflex' || gameType?.id === 'memory' ? 1 : 10} 
                        max={gameType?.id === 'reflex' ? 10 : (gameType?.id === 'drawing' ? 120 : 60)} 
                        step={gameType?.id === 'reflex' || gameType?.id === 'memory' ? 1 : 5} 
                        value={[settings.timePerQuestion]} 
                        onValueChange={(value) => handleSliderChange('timePerQuestion', value)}
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Time Settings Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="totalTime" className="text-xs font-medium flex items-center gap-1">
                          <Clock4 className="h-3 w-3 text-primary" /> Tổng thời gian
                        </Label>
                        <Input
                          id="totalTime"
                          type="number"
                          min="0"
                          placeholder="0 = không giới hạn"
                          value={settings.totalTime || 0}
                          onChange={(e) => handleInputChange('totalTime', e.target.value)}
                          className="border-primary/20 bg-white/50 focus-visible:ring-primary/30 text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bonusTime" className="text-xs font-medium flex items-center gap-1">
                          <Timer className="h-3 w-3 text-primary" /> Thời gian thưởng
                        </Label>
                        <Input
                          id="bonusTime"
                          type="number"
                          min="0"
                          placeholder="Thưởng mỗi câu"
                          value={settings.bonusTime || 0}
                          onChange={(e) => handleInputChange('bonusTime', e.target.value)}
                          className="border-primary/20 bg-white/50 focus-visible:ring-primary/30 text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Debug Mode */}
                <div className="border-t border-border/50 pt-3">
                  <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                    <Switch 
                      id="debugMode" 
                      checked={settings.debugMode || false}
                      onCheckedChange={(checked) => handleSwitchChange('debugMode', checked)} 
                    />
                    <Label htmlFor="debugMode" className="text-sm font-medium flex items-center gap-2">
                      <Bug className="h-3 w-3 text-orange-500" /> 
                      <span>Debug Mode</span>
                      <span className="text-xs text-orange-600 bg-orange-200 px-1.5 py-0.5 rounded-full">DEV</span>
                    </Label>
                  </div>
                  {settings.debugMode && (
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      Sử dụng dữ liệu mẫu để test giao diện ngay lập tức
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Full width bottom */}
            <div className="pt-4 mt-6 border-t border-border/20 flex gap-3">
              {onCancel && (
                <Button 
                  variant="outline"
                  className="flex-1 transition-all border-primary/20 hover:border-primary/30 hover:bg-primary/5 active:scale-95 rounded-lg"
                  onClick={onCancel}
                >
                  Hủy
                </Button>
              )}
              <Button 
                className="flex-1 transition-all active:scale-95 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 rounded-lg shadow-md shadow-primary/20"
                onClick={handleStart}
              >
                Bắt Đầu Trò Chơi
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default GameSettings;

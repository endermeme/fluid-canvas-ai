
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GameSettingsData, GameType } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Gamepad, BrainCircuit, Puzzle, Lightbulb, Clock4, Dices, 
  HeartHandshake, PenTool, Timer, Trophy, Clock, Medal
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { animateToolbarAppear } from '@/lib/animations';
import { Input } from '@/components/ui/input';

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
  });
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

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
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setSettings(prev => ({ ...prev, [name]: numValue }));
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
    if (!gameType) return <Gamepad className="h-10 w-10 text-primary" />;
    
    switch (gameType.icon) {
      case 'brain-circuit': return <BrainCircuit className="h-10 w-10 text-primary" />;
      case 'puzzle-piece': return <Puzzle className="h-10 w-10 text-primary" />;
      case 'light-bulb': return <Lightbulb className="h-10 w-10 text-primary" />;
      case 'clock': return <Clock4 className="h-10 w-10 text-primary" />;
      case 'dices': return <Dices className="h-10 w-10 text-primary" />;
      case 'heart-handshake': return <HeartHandshake className="h-10 w-10 text-primary" />;
      case 'pen-tool': return <PenTool className="h-10 w-10 text-primary" />;
      default: return <Gamepad className="h-10 w-10 text-primary" />;
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
      className={`${inDrawer || inModal ? '' : 'h-full w-full'} flex flex-col items-center justify-center py-4 ${inModal ? 'px-1' : 'px-4'}`}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 relative">
          <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full opacity-70"></div>
          <div className="z-10 flex flex-col items-center">
            <div className="flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 backdrop-blur-sm">
              {getGameIcon()}
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cài Đặt Minigame
            </h2>
          </div>
        </div>

        {topic && (
          <div className="mb-6 text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 backdrop-blur-sm">
              <h3 className="text-lg font-medium">{topic}</h3>
            </div>
            {gameType?.description && (
              <p className="text-sm text-muted-foreground mt-2">{gameType.description}</p>
            )}
          </div>
        )}

        <div className="space-y-6 backdrop-blur-sm bg-card/30 rounded-xl p-5 border border-primary/10">
          <div className="space-y-3">
            <Label htmlFor="difficulty" className="flex items-center gap-2 text-base font-medium">
              <Trophy className="h-4 w-4 text-primary" /> Độ Khó
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

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="questionCount" className="text-base font-medium flex items-center gap-2">
                <Medal className="h-4 w-4 text-primary" /> {getCountLabel()}
              </Label>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">{settings.questionCount}</span>
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

          <div className="flex items-center space-x-2 pb-2">
            <Switch 
              id="useTimer" 
              checked={settings.useTimer !== false}
              onCheckedChange={(checked) => handleSwitchChange('useTimer', checked)} 
            />
            <Label htmlFor="useTimer" className="text-base font-medium flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" /> Sử dụng bộ đếm thời gian
            </Label>
          </div>

          {settings.useTimer !== false && (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="timePerQuestion" className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> {getTimeLabel()}
                  </Label>
                  <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">{settings.timePerQuestion} giây</span>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalTime" className="text-sm font-medium flex items-center gap-2">
                    <Clock4 className="h-4 w-4 text-primary" /> Tổng thời gian (giây)
                  </Label>
                  <Input
                    id="totalTime"
                    type="number"
                    min="0"
                    placeholder="0 = không giới hạn"
                    value={settings.totalTime || 0}
                    onChange={(e) => handleInputChange('totalTime', e.target.value)}
                    className="border-primary/20 bg-white/50 focus-visible:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bonusTime" className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" /> Thời gian thưởng (giây)
                  </Label>
                  <Input
                    id="bonusTime"
                    type="number"
                    min="0"
                    placeholder="Thời gian thưởng mỗi câu"
                    value={settings.bonusTime || 0}
                    onChange={(e) => handleInputChange('bonusTime', e.target.value)}
                    className="border-primary/20 bg-white/50 focus-visible:ring-primary/30"
                  />
                </div>
              </div>
            </>
          )}

          {(!gameType || !(gameType.id === 'memory' || gameType.id === 'drawing' || gameType.id === 'reflex')) && (
            <div className="space-y-3">
              <Label htmlFor="category" className="flex items-center gap-2 text-base font-medium">
                <BrainCircuit className="h-4 w-4 text-primary" /> Thể Loại
              </Label>
              <Select 
                value={settings.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="rounded-lg border-primary/20 bg-white/50 backdrop-blur-sm transition-all shadow-sm hover:border-primary/30 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Chọn thể loại" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-primary/20 bg-white/95 backdrop-blur-lg shadow-lg">
                  <SelectItem value="general" className="cursor-pointer focus:bg-primary/10">Kiến thức chung</SelectItem>
                  <SelectItem value="history" className="cursor-pointer focus:bg-primary/10">Lịch sử</SelectItem>
                  <SelectItem value="science" className="cursor-pointer focus:bg-primary/10">Khoa học</SelectItem>
                  <SelectItem value="geography" className="cursor-pointer focus:bg-primary/10">Địa lý</SelectItem>
                  <SelectItem value="arts" className="cursor-pointer focus:bg-primary/10">Nghệ thuật</SelectItem>
                  <SelectItem value="sports" className="cursor-pointer focus:bg-primary/10">Thể thao</SelectItem>
                  <SelectItem value="math" className="cursor-pointer focus:bg-primary/10">Toán học</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            {onCancel && (
              <Button 
                variant="outline"
                className="w-full transition-all border-primary/20 hover:border-primary/30 hover:bg-primary/5 active:scale-95 rounded-lg"
                onClick={onCancel}
              >
                Hủy
              </Button>
            )}
            <Button 
              className="w-full transition-all active:scale-95 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 rounded-lg shadow-md shadow-primary/20"
              onClick={handleStart}
            >
              Bắt Đầu Trò Chơi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettings;

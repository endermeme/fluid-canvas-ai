import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GameSettingsData, GameType } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gamepad, X, BrainCircuit, Puzzle, Lightbulb, Clock4, Dices, HeartHandshake, PenTool } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { animateToolbarAppear } from '@/lib/animations';

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
    if (!gameType) return <Gamepad className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
    
    switch (gameType.icon) {
      case 'brain-circuit': return <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
      case 'puzzle-piece': return <Puzzle className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
      case 'light-bulb': return <Lightbulb className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
      case 'clock': return <Clock4 className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
      case 'dices': return <Dices className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
      case 'heart-handshake': return <HeartHandshake className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
      case 'pen-tool': return <PenTool className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
      default: return <Gamepad className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2" />;
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
    <div ref={containerRef} className={`${inDrawer || inModal ? '' : 'h-full w-full'} flex flex-col items-center justify-center ${inModal ? 'p-0' : 'p-6'} bg-background`}>
      <div className={`w-full max-w-md bg-card rounded-lg ${inModal ? '' : 'shadow-lg'} ${inModal ? 'p-0' : 'p-6'} ${inDrawer || inModal ? '' : 'border'}`}>
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          {getGameIcon()}
          <h2 className="text-xl sm:text-2xl font-bold">Cài Đặt Minigame</h2>
        </div>

        {topic && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Chủ đề: <span className="text-primary">{topic}</span></h3>
            {gameType?.description && (
              <p className="text-sm text-muted-foreground">{gameType.description}</p>
            )}
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="difficulty">Độ Khó</Label>
            <Select 
              value={settings.difficulty} 
              onValueChange={(value) => handleSelectChange('difficulty', value)}
            >
              <SelectTrigger className="transition-colors focus:ring-2 focus:ring-primary/20 active:scale-[0.98]">
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent className="min-w-[180px]">
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="questionCount">{getCountLabel()} {settings.questionCount}</Label>
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

          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="timePerQuestion">{getTimeLabel()} {settings.timePerQuestion} giây</Label>
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

          {(!gameType || !(gameType.id === 'memory' || gameType.id === 'drawing' || gameType.id === 'reflex')) && (
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="category">Thể Loại</Label>
              <Select 
                value={settings.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="transition-colors focus:ring-2 focus:ring-primary/20 active:scale-[0.98]">
                  <SelectValue placeholder="Chọn thể loại" />
                </SelectTrigger>
                <SelectContent className="min-w-[180px]">
                  <SelectItem value="general">Kiến thức chung</SelectItem>
                  <SelectItem value="history">Lịch sử</SelectItem>
                  <SelectItem value="science">Khoa học</SelectItem>
                  <SelectItem value="geography">Địa lý</SelectItem>
                  <SelectItem value="arts">Nghệ thuật</SelectItem>
                  <SelectItem value="sports">Thể thao</SelectItem>
                  <SelectItem value="math">Toán học</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="pt-3 sm:pt-4 flex gap-3">
            {onCancel && (
              <Button 
                variant="outline"
                className="w-full transition-transform active:scale-95"
                onClick={onCancel}
              >
                Hủy
              </Button>
            )}
            <Button 
              className="w-full transition-transform active:scale-95"
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

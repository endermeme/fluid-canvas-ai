import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GameSettingsData, GameType } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Gamepad, BrainCircuit, Puzzle, Lightbulb, Clock4, Dices, 
  HeartHandshake, PenTool, Timer, Trophy, Clock, Medal, Type
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { animateToolbarAppear } from '@/lib/animations';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

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
    prompt: topic || ''
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
    if (!gameType) return <Gamepad className="h-8 w-8 text-primary" />;
    
    switch (gameType.icon) {
      case 'brain-circuit': return <BrainCircuit className="h-8 w-8 text-primary" />;
      case 'puzzle-piece': return <Puzzle className="h-8 w-8 text-primary" />;
      case 'light-bulb': return <Lightbulb className="h-8 w-8 text-primary" />;
      case 'clock': return <Clock4 className="h-8 w-8 text-primary" />;
      case 'dices': return <Dices className="h-8 w-8 text-primary" />;
      case 'heart-handshake': return <HeartHandshake className="h-8 w-8 text-primary" />;
      case 'pen-tool': return <PenTool className="h-8 w-8 text-primary" />;
      default: return <Gamepad className="h-8 w-8 text-primary" />;
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

  const getPromptPlaceholder = () => {
    switch (gameType?.id) {
      case 'quiz': 
        return 'Ví dụ: Lịch sử Việt Nam thời kỳ đấu tranh chống Pháp';
      case 'flashcards': 
        return 'Ví dụ: Từ vựng tiếng Anh về động vật và môi trường';
      case 'matching': 
        return 'Ví dụ: Nối tên các quốc gia với thủ đô tương ứng';
      case 'memory': 
        return 'Ví dụ: Ghi nhớ các loài hoa và đặc điểm của chúng';
      case 'ordering': 
        return 'Ví dụ: Sắp xếp các sự kiện lịch sử theo thứ tự thời gian';
      case 'wordsearch': 
        return 'Ví dụ: Tìm các từ về khoa học và công nghệ';
      case 'truefalse': 
        return 'Ví dụ: Kiến thức cơ bản về địa lý Việt Nam';
      default: 
        return 'Nhập chủ đề chi tiết cho trò chơi';
    }
  };

  const getGameTitle = () => {
    switch (gameType?.id) {
      case 'quiz': return 'Trắc Nghiệm';
      case 'flashcards': return 'Thẻ Ghi Nhớ';
      case 'matching': return 'Nối Từ';
      case 'memory': return 'Trò Chơi Ghi Nhớ';
      case 'ordering': return 'Sắp Xếp Câu';
      case 'wordsearch': return 'Tìm Từ Ẩn';
      case 'truefalse': return 'Đúng hay Sai';
      default: return 'Cài Đặt Game';
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`${inDrawer || inModal ? 'h-full' : 'min-h-screen'} flex flex-col items-center justify-start py-2 ${inModal ? 'px-2' : 'px-3'} overflow-hidden`}
    >
      <Card className="w-full max-w-xl bg-white/80 backdrop-blur-md border-0 shadow-2xl mx-auto rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 p-4 text-white">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
              {getGameIcon()}
            </div>
            <h2 className="text-xl font-bold mb-1">
              Cài Đặt {getGameTitle()}
            </h2>
            <p className="text-blue-100 text-sm">
              Tùy chỉnh trò chơi theo ý muốn của bạn
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Type className="h-4 w-4 text-sky-600" /> 
              Nội dung trò chơi
            </Label>
            <Textarea
              id="prompt"
              value={settings.prompt || ''}
              onChange={(e) => handleInputChange('prompt', e.target.value)}
              placeholder={getPromptPlaceholder()}
              className="min-h-[80px] border-2 border-gray-200 bg-gray-50/50 backdrop-blur-sm transition-all shadow-sm hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-xl resize-none text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Trophy className="h-4 w-4 text-sky-600" /> 
              Độ Khó
            </Label>
            <Select 
              value={settings.difficulty} 
              onValueChange={(value) => handleSelectChange('difficulty', value)}
            >
              <SelectTrigger className="h-10 rounded-xl border-2 border-gray-200 bg-gray-50/50 backdrop-blur-sm transition-all shadow-sm hover:border-sky-300 focus:ring-2 focus:ring-sky-200">
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 bg-white/95 backdrop-blur-lg shadow-xl">
                <SelectItem value="easy" className="cursor-pointer focus:bg-sky-50 py-1.5">🟢 Dễ</SelectItem>
                <SelectItem value="medium" className="cursor-pointer focus:bg-sky-50 py-1.5">🟡 Trung bình</SelectItem>
                <SelectItem value="hard" className="cursor-pointer focus:bg-sky-50 py-1.5">🔴 Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="questionCount" className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                <Medal className="h-4 w-4 text-sky-600" /> 
                {getCountLabel()}
              </Label>
              <span className="px-2 py-1 bg-sky-100 rounded-full text-xs font-bold text-sky-700">
                {settings.questionCount}
              </span>
            </div>
            <Slider 
              id="questionCount"
              min={gameType?.id === 'drawing' ? 1 : (gameType?.id === 'puzzle' ? 2 : 3)} 
              max={gameType?.id === 'memory' ? 12 : (gameType?.id === 'puzzle' ? 6 : 20)} 
              step={1} 
              value={[settings.questionCount]} 
              onValueChange={(value) => handleSliderChange('questionCount', value)}
              className="cursor-pointer h-2"
            />
          </div>

          <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-xl">
            <Switch 
              id="useTimer" 
              checked={settings.useTimer !== false}
              onCheckedChange={(checked) => handleSwitchChange('useTimer', checked)} 
              className="scale-100"
            />
            <Label htmlFor="useTimer" className="text-sm font-semibold flex items-center gap-2 text-gray-800">
              <Timer className="h-4 w-4 text-sky-600" /> 
              Sử dụng bộ đếm thời gian
            </Label>
          </div>

          {settings.useTimer !== false && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="timePerQuestion" className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                    <Clock className="h-4 w-4 text-sky-600" /> 
                    {getTimeLabel()}
                  </Label>
                  <span className="px-2 py-1 bg-sky-100 rounded-full text-xs font-bold text-sky-700">
                    {settings.timePerQuestion} giây
                  </span>
                </div>
                <Slider 
                  id="timePerQuestion"
                  min={gameType?.id === 'reflex' || gameType?.id === 'memory' ? 1 : 10} 
                  max={gameType?.id === 'reflex' ? 10 : (gameType?.id === 'drawing' ? 120 : 60)} 
                  step={gameType?.id === 'reflex' || gameType?.id === 'memory' ? 1 : 5} 
                  value={[settings.timePerQuestion]} 
                  onValueChange={(value) => handleSliderChange('timePerQuestion', value)}
                  className="cursor-pointer h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="totalTime" className="text-xs font-semibold flex items-center gap-1.5 text-gray-800">
                    <Clock4 className="h-3 w-3 text-sky-600" /> 
                    Tổng thời gian (giây)
                  </Label>
                  <Input
                    id="totalTime"
                    type="number"
                    min="0"
                    placeholder="0 = không giới hạn"
                    value={settings.totalTime || 0}
                    onChange={(e) => handleInputChange('totalTime', e.target.value)}
                    className="h-8 border-2 border-gray-200 bg-gray-50/50 focus-visible:ring-sky-200 focus-visible:border-sky-500 rounded-xl text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="bonusTime" className="text-xs font-semibold flex items-center gap-1.5 text-gray-800">
                    <Timer className="h-3 w-3 text-sky-600" /> 
                    Thời gian thưởng (giây)
                  </Label>
                  <Input
                    id="bonusTime"
                    type="number"
                    min="0"
                    placeholder="Thời gian thưởng mỗi câu"
                    value={settings.bonusTime || 0}
                    onChange={(e) => handleInputChange('bonusTime', e.target.value)}
                    className="h-8 border-2 border-gray-200 bg-gray-50/50 focus-visible:ring-sky-200 focus-visible:border-sky-500 rounded-xl text-sm"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-2 flex gap-3">
            {onCancel && (
              <Button 
                variant="outline"
                className="w-full h-10 transition-all border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 rounded-xl font-semibold text-sm"
                onClick={onCancel}
              >
                Hủy
              </Button>
            )}
            <Button 
              className="w-full h-10 transition-all active:scale-95 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 rounded-xl shadow-lg shadow-sky-200 font-bold text-sm"
              onClick={handleStart}
            >
              Bắt Đầu Trò Chơi 🎮
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameSettings;

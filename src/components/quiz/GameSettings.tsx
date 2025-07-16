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
    if (!gameType) return <Gamepad className="h-5 w-5 text-primary" />;
    
    switch (gameType.icon) {
      case 'brain-circuit': return <BrainCircuit className="h-5 w-5 text-primary" />;
      case 'puzzle-piece': return <Puzzle className="h-5 w-5 text-primary" />;
      case 'light-bulb': return <Lightbulb className="h-5 w-5 text-primary" />;
      case 'clock': return <Clock4 className="h-5 w-5 text-primary" />;
      case 'dices': return <Dices className="h-5 w-5 text-primary" />;
      case 'heart-handshake': return <HeartHandshake className="h-5 w-5 text-primary" />;
      case 'pen-tool': return <PenTool className="h-5 w-5 text-primary" />;
      default: return <Gamepad className="h-5 w-5 text-primary" />;
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
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div 
        ref={containerRef} 
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="border-primary/20 shadow-lg p-6 max-h-[85vh] overflow-y-auto">
          {/* Header - Compact */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center p-2 rounded-full bg-primary/10">
              {getGameIcon()}
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cài Đặt Minigame
            </h2>
          </div>

          {/* Settings Grid - Single column on mobile, 2 columns on larger screens */}
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
                  placeholder="Nhập nội dung chi tiết cho trò chơi"
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
                    <Medal className="h-4 w-4 text-primary" /> {getCountLabel()}
                  </Label>
                  <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.questionCount}</span>
                </div>
                <Slider 
                  id="questionCount"
                  min={gameType?.id === 'drawing' ? 1 : (gameType?.id === 'puzzle' ? 2 : 3)} 
                  max={gameType?.id === 'memory' ? 12 : (gameType?.id === 'puzzle' ? 6 : 20)} 
                  step={1} 
                  value={[settings.questionCount]} 
                  onValueChange={(value) => handleSliderChange('questionCount', value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Timer Toggle */}
              <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                <Switch 
                  id="useTimer" 
                  checked={settings.useTimer !== false}
                  onCheckedChange={(checked) => handleSwitchChange('useTimer', checked)} 
                />
                <Label htmlFor="useTimer" className="text-sm font-medium flex items-center gap-2">
                  <Timer className="h-4 w-4 text-primary" /> Sử dụng bộ đếm thời gian
                </Label>
              </div>

              {settings.useTimer !== false && (
                <>
                  {/* Time Per Question */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="timePerQuestion" className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" /> {getTimeLabel()}
                      </Label>
                      <span className="px-2 py-1 bg-primary/10 rounded text-sm">{settings.timePerQuestion} giây</span>
                    </div>
                    <Slider 
                      id="timePerQuestion"
                      min={gameType?.id === 'reflex' || gameType?.id === 'memory' ? 1 : 10} 
                      max={gameType?.id === 'reflex' ? 10 : (gameType?.id === 'drawing' ? 120 : 60)} 
                      step={gameType?.id === 'reflex' || gameType?.id === 'memory' ? 1 : 5} 
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
                        placeholder="0 = vô hạn"
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

              {/* Game-Specific Settings */}
              {(gameType?.id === 'quiz' || gameType?.id === 'flashcards' || gameType?.id === 'memory' || 
                gameType?.id === 'matching' || gameType?.id === 'ordering' || gameType?.id === 'wordsearch' || 
                gameType?.id === 'truefalse') && (
                <div className="border-t border-border/50 pt-3">
                  <h4 className="text-sm font-medium mb-3 text-primary">Tùy chọn đặc biệt</h4>
                  <div className="space-y-3">
                    
                    {/* Quiz-specific settings */}
                    {gameType?.id === 'quiz' && (
                      <>
                        <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                          <Switch 
                            id="shuffleQuestions" 
                            checked={settings.shuffleQuestions || false}
                            onCheckedChange={(checked) => handleSwitchChange('shuffleQuestions', checked)} 
                          />
                          <Label htmlFor="shuffleQuestions" className="text-sm">Trộn câu hỏi</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                          <Switch 
                            id="allowSkip" 
                            checked={settings.allowSkip || false}
                            onCheckedChange={(checked) => handleSwitchChange('allowSkip', checked)} 
                          />
                          <Label htmlFor="allowSkip" className="text-sm">Cho phép bỏ qua</Label>
                        </div>
                      </>
                    )}

                    {/* Flashcards-specific settings */}
                    {gameType?.id === 'flashcards' && (
                      <>
                        <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                          <Switch 
                            id="autoFlip" 
                            checked={settings.autoFlip !== false}
                            onCheckedChange={(checked) => handleSwitchChange('autoFlip', checked)} 
                          />
                          <Label htmlFor="autoFlip" className="text-sm">Lật tự động</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                          <Switch 
                            id="shuffleCards" 
                            checked={settings.shuffleCards || false}
                            onCheckedChange={(checked) => handleSwitchChange('shuffleCards', checked)} 
                          />
                          <Label htmlFor="shuffleCards" className="text-sm">Trộn thẻ</Label>
                        </div>
                      </>
                    )}

                    {/* Memory-specific settings */}
                    {gameType?.id === 'memory' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="gridSize" className="text-sm">Kích thước lưới: {settings.gridSize || 4}x{settings.gridSize || 4}</Label>
                          <Slider 
                            id="gridSize"
                            min={3} 
                            max={6} 
                            step={1} 
                            value={[settings.gridSize || 4]} 
                            onValueChange={(value) => handleSliderChange('gridSize', value)}
                          />
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded-lg">
                          <Switch 
                            id="progressiveHints" 
                            checked={settings.progressiveHints || false}
                            onCheckedChange={(checked) => handleSwitchChange('progressiveHints', checked)} 
                          />
                          <Label htmlFor="progressiveHints" className="text-sm">Gợi ý tiến bộ</Label>
                        </div>
                      </>
                    )}

                    {/* Matching-specific settings */}
                    {gameType?.id === 'matching' && (
                      <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                        <Switch 
                          id="allowPartialMatching" 
                          checked={settings.allowPartialMatching !== false}
                          onCheckedChange={(checked) => handleSwitchChange('allowPartialMatching', checked)} 
                        />
                        <Label htmlFor="allowPartialMatching" className="text-sm">Cho phép ghép một phần</Label>
                      </div>
                    )}

                    {/* Ordering-specific settings */}
                    {gameType?.id === 'ordering' && (
                      <>
                        <div className="flex items-center space-x-3 p-2 bg-indigo-50 rounded-lg">
                          <Switch 
                            id="allowMultipleAttempts" 
                            checked={settings.allowMultipleAttempts !== false}
                            onCheckedChange={(checked) => handleSwitchChange('allowMultipleAttempts', checked)} 
                          />
                          <Label htmlFor="allowMultipleAttempts" className="text-sm">Cho phép thử nhiều lần</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-indigo-50 rounded-lg">
                          <Switch 
                            id="caseSensitive" 
                            checked={settings.caseSensitive || false}
                            onCheckedChange={(checked) => handleSwitchChange('caseSensitive', checked)} 
                          />
                          <Label htmlFor="caseSensitive" className="text-sm">Phân biệt chữ hoa/thường</Label>
                        </div>
                      </>
                    )}

                    {/* WordSearch-specific settings */}
                    {gameType?.id === 'wordsearch' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="gridSizeWS" className="text-sm">Kích thước lưới: {settings.gridSize || 15}x{settings.gridSize || 15}</Label>
                          <Slider 
                            id="gridSizeWS"
                            min={10} 
                            max={20} 
                            step={1} 
                            value={[settings.gridSize || 15]} 
                            onValueChange={(value) => handleSliderChange('gridSize', value)}
                          />
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-teal-50 rounded-lg">
                          <Switch 
                            id="allowDiagonalWords" 
                            checked={settings.allowDiagonalWords !== false}
                            onCheckedChange={(checked) => handleSwitchChange('allowDiagonalWords', checked)} 
                          />
                          <Label htmlFor="allowDiagonalWords" className="text-sm">Cho phép từ chéo</Label>
                        </div>
                      </>
                    )}

                    {/* TrueFalse-specific settings */}
                    {gameType?.id === 'truefalse' && (
                      <div className="flex items-center space-x-3 p-2 bg-red-50 rounded-lg">
                        <Switch 
                          id="progressiveScoring" 
                          checked={settings.progressiveScoring || false}
                          onCheckedChange={(checked) => handleSwitchChange('progressiveScoring', checked)} 
                        />
                        <Label htmlFor="progressiveScoring" className="text-sm">Điểm số tiến bộ</Label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Debug Mode */}
              <div className="border-t border-border/50 pt-3">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Switch 
                    id="debugMode" 
                    checked={settings.debugMode || false}
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

export default GameSettings;

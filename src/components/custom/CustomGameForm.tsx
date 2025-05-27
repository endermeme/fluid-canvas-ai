
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Sparkles, Gamepad2, ArrowLeft, Settings, Lightbulb } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomGameFormProps {
  onGenerate: (prompt: string, game?: any) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('general');
  const [gameType, setGameType] = useState('action');
  const [playerCount, setPlayerCount] = useState('single');
  const [timeLimit, setTimeLimit] = useState([30]);
  const [complexity, setComplexity] = useState([5]);
  const [useCanvas, setUseCanvas] = useState(true);
  const [includeSound, setIncludeSound] = useState(true);
  const [mobileOptimized, setMobileOptimized] = useState(true);
  const [language, setLanguage] = useState('vi');
  const [customSettings, setCustomSettings] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const gameSettings = {
        difficulty,
        category,
        gameType,
        playerCount,
        timeLimit: timeLimit[0],
        complexity: complexity[0],
        useCanvas,
        includeSound,
        mobileOptimized,
        language,
        customSettings,
        prompt
      };

      console.log('🎮 [FORM] Submitting game creation with settings:', gameSettings);
      await onGenerate(prompt, gameSettings);
    } finally {
      setIsGenerating(false);
    }
  };

  const presetPrompts = [
    "Tạo game đua xe đơn giản với điều khiển bằng phím mũi tên, có chướng ngại vật và hệ thống điểm",
    "Game xếp hình Tetris cơ bản với các khối rơi và xóa hàng khi đầy",
    "Trò chơi bắn súng không gian với phi thuyền và quái vật",
    "Game nhảy platform với nhân vật thu thập coin và tránh kẻ thù",
    "Trò chơi câu đố ghép hình với drag & drop",
    "Game memory với các cặp thẻ lật ngẫu nhiên",
    "Trò chơi snake với thức ăn và tăng độ dài",
    "Game pong với 2 paddle và bóng nảy"
  ];

  const gameCategories = [
    { value: 'action', label: 'Hành động' },
    { value: 'puzzle', label: 'Câu đố' },
    { value: 'arcade', label: 'Arcade' },
    { value: 'strategy', label: 'Chiến thuật' },
    { value: 'adventure', label: 'Phiêu lưu' },
    { value: 'racing', label: 'Đua xe' },
    { value: 'sports', label: 'Thể thao' },
    { value: 'educational', label: 'Giáo dục' }
  ];

  const gameTypes = [
    { value: 'single', label: 'Một người chơi' },
    { value: 'versus', label: 'Đối kháng' },
    { value: 'cooperative', label: 'Hợp tác' },
    { value: 'turn-based', label: 'Lượt chơi' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tạo Game Tùy Chỉnh Chi Tiết
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Mô tả chi tiết game của bạn với đầy đủ tùy chọn nâng cao
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Cơ bản</TabsTrigger>
                  <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
                  <TabsTrigger value="technical">Kỹ thuật</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-base font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Mô tả chi tiết trò chơi
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder="Ví dụ: Tạo game đua xe 2D nhìn từ trên xuống, có 3 làn đường, xe điều khiển bằng phím mũi tên, có chướng ngại vật rơi từ trên xuống, hệ thống điểm tăng theo thời gian sống sót..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Thể loại game</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gameCategories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Độ khó</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Dễ - Phù hợp trẻ em</SelectItem>
                          <SelectItem value="medium">Trung bình - Người chơi thông thường</SelectItem>
                          <SelectItem value="hard">Khó - Thử thách cao</SelectItem>
                          <SelectItem value="expert">Chuyên gia - Cực kỳ khó</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gameType">Kiểu chơi</Label>
                      <Select value={gameType} onValueChange={setGameType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gameTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Ngôn ngữ</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vi">Tiếng Việt</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Thời gian chơi mỗi lượt (giây): {timeLimit[0]}</Label>
                      <Slider
                        value={timeLimit}
                        onValueChange={setTimeLimit}
                        max={300}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Độ phức tạp (1-10): {complexity[0]}</Label>
                      <Slider
                        value={complexity}
                        onValueChange={setComplexity}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customSettings">Yêu cầu đặc biệt</Label>
                      <Textarea
                        id="customSettings"
                        placeholder="Ví dụ: Thêm power-ups, có boss cuối game, multiplayer local, lưu high score..."
                        value={customSettings}
                        onChange={(e) => setCustomSettings(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="useCanvas"
                        checked={useCanvas}
                        onCheckedChange={setUseCanvas}
                      />
                      <Label htmlFor="useCanvas">Sử dụng Canvas (Đồ họa nâng cao)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includeSound"
                        checked={includeSound}
                        onCheckedChange={setIncludeSound}
                      />
                      <Label htmlFor="includeSound">Bao gồm âm thanh</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mobileOptimized"
                        checked={mobileOptimized}
                        onCheckedChange={setMobileOptimized}
                      />
                      <Label htmlFor="mobileOptimized">Tối ưu cho mobile</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Gợi ý nhanh:
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {presetPrompts.map((preset, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(preset)}
                      className="text-xs text-left justify-start h-auto py-2 px-3"
                    >
                      {preset.substring(0, 60)}...
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Đang tạo...
                    </div>
                  ) : (
                    <>
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Tạo Game Chi Tiết
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomGameForm;

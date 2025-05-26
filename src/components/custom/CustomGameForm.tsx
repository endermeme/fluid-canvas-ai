
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Gamepad2, ArrowLeft } from 'lucide-react';

interface CustomGameFormProps {
  onGenerate: (prompt: string, game?: any) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('general');
  const [useCanvas, setUseCanvas] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      await onGenerate(prompt, {
        difficulty,
        category,
        useCanvas,
        prompt
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const presetPrompts = [
    "Tạo game đua xe đơn giản với điều khiển bằng phím mũi tên",
    "Game xếp hình Tetris cơ bản với các khối rơi",
    "Trò chơi bắn súng không gian với phi thuyền",
    "Game nhảy platform với nhân vật thu thập coin",
    "Trò chơi câu đố ghép hình đơn giản"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tạo Game Tùy Chỉnh
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Mô tả ý tưởng game của bạn và AI sẽ tạo ra trò chơi hoàn chỉnh
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base font-medium">
                  Mô tả trò chơi của bạn
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Ví dụ: Tạo game đua xe đơn giản với điều khiển bằng phím mũi tên..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Độ khó</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
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

                <div className="space-y-2">
                  <Label htmlFor="category">Thể loại</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Tổng quát</SelectItem>
                      <SelectItem value="action">Hành động</SelectItem>
                      <SelectItem value="puzzle">Câu đố</SelectItem>
                      <SelectItem value="arcade">Arcade</SelectItem>
                      <SelectItem value="strategy">Chiến thuật</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="useCanvas"
                  checked={useCanvas}
                  onCheckedChange={setUseCanvas}
                />
                <Label htmlFor="useCanvas">Sử dụng Canvas (Đồ họa nâng cao)</Label>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Gợi ý nhanh:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {presetPrompts.map((preset, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(preset)}
                      className="text-xs"
                    >
                      {preset.substring(0, 30)}...
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
                      Tạo Game
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

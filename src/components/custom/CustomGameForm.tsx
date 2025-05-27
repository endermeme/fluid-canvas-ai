
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Gamepad2, Lightbulb } from 'lucide-react';

interface CustomGameFormProps {
  onGenerate: (prompt: string) => void;
  onCancel: () => void;
  isGenerating?: boolean;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ 
  onGenerate, 
  onCancel, 
  isGenerating = false 
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim());
  };

  const presetPrompts = [
    "Tạo game đua xe đơn giản với canvas, xe điều khiển bằng phím mũi tên",
    "Game snake cổ điển với canvas, di chuyển bằng WASD, có điểm số",
    "Trò chơi bắn súng không gian với canvas, bắn bằng phím space",
    "Game nhảy platform đơn giản với canvas, nhảy bằng phím space",
    "Trò chơi Tetris cơ bản với canvas, xoay khối bằng phím mũi tên",
    "Game pong với 2 paddle, điều khiển bằng W/S và mũi tên lên/xuống"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tạo Game Tùy Chỉnh
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Mô tả game bạn muốn tạo, AI sẽ tạo game HTML Canvas cho bạn
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Mô tả chi tiết game bạn muốn
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Ví dụ: Tạo game đua xe 2D nhìn từ trên xuống, có 3 làn đường, xe điều khiển bằng phím mũi tên, có chướng ngại vật rơi từ trên xuống, hệ thống điểm tăng theo thời gian..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                  required
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Gợi ý nhanh:
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {presetPrompts.map((preset, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(preset)}
                      className="text-xs text-left justify-start h-auto py-2 px-3"
                      disabled={isGenerating}
                    >
                      {preset}
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
                  disabled={isGenerating}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Đang tạo...' : 'Tạo Game'}
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

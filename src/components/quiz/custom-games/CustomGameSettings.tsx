
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Code, Terminal, Brackets } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GEMINI_MODELS } from '@/constants/api-constants';

interface CustomGameSettingsProps {
  onGenerate: (prompt: string, useCanvas: boolean) => void;
  initialPrompt?: string;
  isGenerating?: boolean;
}

const CustomGameSettings: React.FC<CustomGameSettingsProps> = ({ 
  onGenerate, 
  initialPrompt = '',
  isGenerating = false
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [useCanvas, setUseCanvas] = useState(true);
  const [codeMode, setCodeMode] = useState<'simple' | 'advanced'>('simple');

  const handleSubmit = () => {
    if (prompt.trim()) {
      console.log('User prompt submitted:', prompt);
      console.log('Using model:', GEMINI_MODELS.CUSTOM_GAME);
      console.log('Canvas mode:', useCanvas ? 'enabled' : 'disabled');
      console.log('Code mode:', codeMode);
      onGenerate(prompt, useCanvas);
    }
  };

  const getPlaceholderText = () => {
    return codeMode === 'simple' 
      ? 'Mô tả chi tiết game bạn muốn tạo (ví dụ: Tạo trò chơi xếp hình với 9 mảnh ghép về hệ mặt trời)'
      : 'Tạo game với yêu cầu kỹ thuật cụ thể (ví dụ: Tạo game sử dụng HTML5 Canvas và JavaScript với thuật toán A* để tìm đường đi ngắn nhất)';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-3xl bg-background/80 backdrop-blur-sm border-primary/20 p-6 shadow-lg">
        <div className="flex flex-col items-center mb-6 relative">
          <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full opacity-70"></div>
          <div className="z-10 flex flex-col items-center">
            <div className="flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 backdrop-blur-sm">
              <Terminal className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Tạo Game Tương Tác Với {GEMINI_MODELS.CUSTOM_GAME}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
              Xây dựng game tương tác bằng HTML, CSS và JavaScript với trí tuệ nhân tạo
            </p>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Cơ bản</TabsTrigger>
            <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={getPlaceholderText()}
              className="min-h-[180px] border-primary/20 bg-white/80 backdrop-blur-sm transition-all shadow-sm hover:border-primary/30 focus:ring-2 focus:ring-primary/20 text-base font-mono"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="canvas-mode"
                  checked={useCanvas}
                  onCheckedChange={setUseCanvas}
                />
                <Label htmlFor="canvas-mode" className="cursor-pointer">
                  <div className="flex items-center">
                    <Brackets className="w-4 h-4 mr-1 text-primary" />
                    <span>Chế độ Canvas</span>
                  </div>
                </Label>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCodeMode('simple')}
                  className={codeMode === 'simple' ? 'bg-primary/10 border-primary/30' : ''}
                >
                  Đơn giản
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCodeMode('advanced')}
                  className={codeMode === 'advanced' ? 'bg-primary/10 border-primary/30' : ''}
                >
                  Kỹ thuật
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="bg-black/80 rounded-md p-4 text-white font-mono text-sm">
              <div className="flex items-center mb-3 text-green-400">
                <Code className="w-5 h-5 mr-2" />
                <span>Mẫu code game</span>
              </div>
              <pre className="overflow-auto text-xs">
{`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Canvas Game</title>
  <style>
    body { margin: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script>
    // Game initialization
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    let score = 0;
    
    // Game loop
    function gameLoop() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update game state
      
      // Render game
      
      // Continue loop
      requestAnimationFrame(gameLoop);
    }
    
    // Start game
    gameLoop();
  </script>
</body>
</html>`}
              </pre>
            </div>
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Nhập yêu cầu kỹ thuật cụ thể cho game của bạn..."
              className="min-h-[150px] border-primary/20 bg-white/80 backdrop-blur-sm transition-all shadow-sm hover:border-primary/30 focus:ring-2 focus:ring-primary/20 text-base font-mono"
            />
            
            <div className="p-3 bg-primary/5 rounded-lg">
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <Terminal className="w-4 h-4 mr-1 text-primary" />
                Tài nguyên kỹ thuật
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Canvas API để vẽ đồ họa động</li>
                <li>• localStorage để lưu dữ liệu người dùng</li>
                <li>• Web Audio API để tạo âm thanh</li>
                <li>• Keyboard/Mouse events để điều khiển</li>
                <li>• JSON để lưu trữ dữ liệu cấu hình</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4">
          <Button 
            onClick={handleSubmit} 
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            disabled={!prompt.trim() || isGenerating}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isGenerating ? 'Đang tạo game...' : 'Tạo game với AI'}
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p className="text-center">
            <span className="font-semibold">Ví dụ:</span> "Tạo memory game với 8 cặp thẻ", "Tạo trò chơi nối ống dẫn nước", "Tạo trò chơi đua xe 2D với Canvas"
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameSettings;

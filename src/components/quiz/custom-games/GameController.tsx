
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { CustomGameState } from '../types/customGame';
import GameContainer from '../components/GameContainer';
import QuizContainer from '../QuizContainer';
import { generateCustomGamePrompt } from '../generator/customGamePrompt';
import { GEMINI_MODELS, getApiEndpoint } from '@/constants/api-constants';

const GameController: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [gameState, setGameState] = useState<CustomGameState>({
    loading: false,
    error: null,
    content: null
  });

  const handleBack = () => {
    navigate('/preset-games');
  };

  const handleGenerateGame = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mô tả chi tiết về game bạn muốn tạo",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    setGameState({
      loading: true,
      error: null,
      content: null
    });

    console.log("Đang gửi yêu cầu tạo game...");
    console.log("Prompt người dùng:", prompt);

    try {
      const gamePrompt = generateCustomGamePrompt(prompt);
      
      console.log("Gửi prompt tới API:", gamePrompt);
      console.log("API endpoint:", getApiEndpoint(GEMINI_MODELS.CUSTOM_GAME));
      
      const response = await fetch(getApiEndpoint(GEMINI_MODELS.CUSTOM_GAME), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{text: gamePrompt}]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192
          }
        })
      });

      if (!response.ok) {
        console.error("Lỗi API:", response.status, response.statusText);
        throw new Error('Lỗi khi tạo game');
      }

      const result = await response.json();
      console.log("Nhận phản hồi từ API:", result);
      
      const gameContent = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!gameContent) {
        console.error("Không nhận được phản hồi từ AI");
        throw new Error('Không nhận được phản hồi từ AI');
      }

      console.log("Nội dung game nhận được:", gameContent);

      const htmlMatch = gameContent.match(/<HTML>([\s\S]*?)<\/HTML>/i);
      const cssMatch = gameContent.match(/<CSS>([\s\S]*?)<\/CSS>/i);
      const jsMatch = gameContent.match(/<JAVASCRIPT>([\s\S]*?)<\/JAVASCRIPT>/i);

      console.log("=== HTML CODE ===");
      console.log(htmlMatch?.[1]?.trim() || 'Không có HTML');
      
      console.log("=== CSS CODE ===");
      console.log(cssMatch?.[1]?.trim() || 'Không có CSS');
      
      console.log("=== JAVASCRIPT CODE ===");
      console.log(jsMatch?.[1]?.trim() || 'Không có JavaScript');

      console.log("Kết quả trích xuất:", {
        html: htmlMatch ? "Có" : "Không",
        css: cssMatch ? "Có" : "Không",
        js: jsMatch ? "Có" : "Không"
      });

      const gameData = {
        html: htmlMatch?.[1]?.trim() || '',
        css: cssMatch?.[1]?.trim() || '',
        javascript: jsMatch?.[1]?.trim() || '',
        title: `Tùy chỉnh: ${prompt.slice(0, 30)}...`
      };

      console.log("Dữ liệu game cuối cùng:", gameData);

      setGameState({
        loading: false,
        error: null,
        content: gameData
      });

      toast({
        title: "Thành công!",
        description: "Game của bạn đã được tạo",
      });

    } catch (error) {
      console.error('Error generating game:', error);
      setGameState({
        loading: false,
        error: error.message || "Không thể tạo game. Vui lòng thử lại.",
        content: null
      });
      
      toast({
        title: "Lỗi",
        description: "Không thể tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <QuizContainer 
      title="Tạo Game Tùy Chỉnh"
      showBackButton 
      onBack={handleBack}
    >
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Mô tả game của bạn</Label>
              <Textarea
                id="prompt"
                placeholder="Mô tả chi tiết game bạn muốn tạo (ví dụ: một game ghép hình với chủ đề động vật...)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <Button
              onClick={handleGenerateGame}
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Đang tạo game...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Tạo Game
                </>
              )}
            </Button>
          </div>
        </Card>

        {gameState.content && (
          <GameContainer
            iframeRef={iframeRef}
            content={gameState.content}
            error={gameState.error}
            onReload={handleGenerateGame}
            title={gameState.content.title}
          />
        )}
      </div>
    </QuizContainer>
  );
};

export default GameController;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, Code, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIGameGenerator, MiniGame } from '../generator/AIGameGenerator';
import GameLoading from '../GameLoading';
import EnhancedGameView from './EnhancedGameView';
import QuizContainer from '../QuizContainer';
import { useNavigate } from 'react-router-dom';
import { createGameSession } from '@/services/gameParticipation';

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

const CustomGameCreator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const gameGenerator = AIGameGenerator.getInstance(API_KEY);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mô tả cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 4 + 1;
      });
    }, 300);
    
    try {
      // Generate the game with the AI
      const game = await gameGenerator.generateMiniGame(prompt);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Short delay to show 100% completion
      setTimeout(() => {
        if (game) {
          setMiniGame(game);
          toast({
            title: "Trò chơi đã sẵn sàng",
            description: "Trò chơi của bạn đã được tạo thành công",
          });
        } else {
          throw new Error("Không thể tạo trò chơi");
        }
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Lỗi khi tạo trò chơi:", error);
      toast({
        title: "Lỗi tạo trò chơi",
        description: "Có lỗi xảy ra khi tạo trò chơi. Vui lòng thử lại.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const handleNewGame = () => {
    setMiniGame(null);
  };

  const handleShareGame = () => {
    if (!miniGame) return;
    
    // Create a shareable game session
    const gameSession = createGameSession(
      miniGame.title || "Trò chơi tùy chỉnh",
      miniGame.content || ""
    );
    
    // Navigate to the share page
    navigate(`/game/${gameSession.id}`);
    
    toast({
      title: "Game đã được chia sẻ",
      description: "Bạn có thể gửi link cho người khác để họ tham gia.",
    });
  };

  const getExamples = () => [
    "Tạo một trò chơi xếp hình với 9 mảnh ghép về vũ trụ",
    "Tạo một trò chơi bắn súng đơn giản, người chơi di chuyển để tránh chướng ngại vật",
    "Tạo một trò chơi vòng quay may mắn với các phần thưởng khác nhau",
    "Tạo một trò chơi ghi nhớ với các con vật hoang dã"
  ];

  const handleUseExample = (example: string) => {
    setPrompt(example);
  };

  if (isGenerating) {
    return (
      <GameLoading 
        topic={prompt} 
        progress={generationProgress} 
      />
    );
  }

  if (miniGame) {
    return (
      <QuizContainer
        title={miniGame.title || "Trò chơi tùy chỉnh"}
        showBackButton={true}
        onBack={handleNewGame}
        footerContent={
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={handleNewGame}
              className="border-primary/20"
            >
              Tạo trò chơi mới
            </Button>
            <Button 
              variant="default" 
              onClick={handleShareGame}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              Chia sẻ trò chơi
            </Button>
          </div>
        }
      >
        <EnhancedGameView 
          miniGame={{
            title: miniGame.title || "Trò chơi tùy chỉnh",
            content: miniGame.content || ""
          }}
        />
      </QuizContainer>
    );
  }

  return (
    <QuizContainer
      title="Tạo Trò Chơi HTML"
      showBackButton={true}
      onBack={() => navigate('/')}
    >
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <Card className="bg-background/70 backdrop-blur-sm border-primary/20 shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code className="h-5 w-5 text-primary" />
              </div>
              Tạo Trò Chơi với AI
            </h2>
            <p className="text-sm text-muted-foreground">
              Mô tả trò chơi bạn muốn tạo và AI sẽ tạo một trò chơi tương tác
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="text-base font-medium">
                Mô tả trò chơi của bạn
              </Label>
              <Textarea
                id="prompt"
                placeholder="Mô tả chi tiết trò chơi bạn muốn tạo. Ví dụ: Tạo một trò chơi xếp hình với 9 mảnh ghép..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="font-mono text-sm mt-2 border-primary/20 focus-visible:ring-primary/30"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Ví dụ:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getExamples().map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-2 px-3 justify-start text-left text-xs border-primary/20 hover:bg-primary/5"
                    onClick={() => handleUseExample(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Tạo Trò Chơi
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </QuizContainer>
  );
};

export default CustomGameCreator;


import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import QuizContainer from '@/components/quiz/QuizContainer';
import { AIGameGenerator } from '@/components/quiz/generator/AIGameGenerator';
import GameLoading from '@/components/quiz/GameLoading';

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

const Quiz = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameContent, setGameContent] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState('Minigame Tương Tác');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize game generator
  const gameGenerator = AIGameGenerator.getInstance(API_KEY);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập yêu cầu cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setGameTitle(`Minigame: ${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}`);
    setIsGenerating(true);
    setGameContent(null);
    
    try {
      const settings = {
        difficulty: 'medium' as 'easy' | 'medium' | 'hard',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general' as 'general' | 'history' | 'science' | 'geography' | 'arts' | 'sports' | 'math'
      };
      
      const game = await gameGenerator.generateMiniGame(prompt, settings);
      
      if (game && game.content) {
        setGameContent(game.content);
        setGameTitle(game.title || `Minigame: ${prompt.substring(0, 40)}...`);
        
        toast({
          title: "Trò chơi đã được tạo",
          description: "Trò chơi đã được tạo thành công với AI",
        });
      } else {
        throw new Error("Không thể tạo trò chơi");
      }
    } catch (error) {
      console.error("Lỗi khi tạo trò chơi:", error);
      toast({
        title: "Lỗi tạo trò chơi",
        description: "Có lỗi xảy ra khi tạo trò chơi. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGameContent(null);
    setGameTitle('Minigame Tương Tác');
  };

  const handleShare = () => {
    // Basic implementation of sharing functionality
    try {
      if (gameContent) {
        const shareUrl = window.location.origin + '/quiz?shared=true';
        navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Đã sao chép liên kết",
          description: "Liên kết đã được sao chép vào clipboard.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
    }
  };

  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={prompt} />;
    }
    
    if (gameContent) {
      return (
        <div className="w-full h-full">
          <iframe
            ref={iframeRef}
            srcDoc={gameContent}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title={gameTitle}
          />
        </div>
      );
    }
    
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="bg-background/50 backdrop-blur-md border border-primary/20 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-primary">Tạo Minigame với AI</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="text-sm font-medium">Nhập yêu cầu cho trò chơi</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ví dụ: Tạo trò chơi vòng quay may mắn với 10 phần thưởng khác nhau"
                className="h-32 mt-1"
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-primary to-primary/80"
              disabled={!prompt.trim() || isGenerating}
            >
              <SparklesIcon className="mr-2 h-4 w-4" />
              Tạo minigame với AI
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-background to-background/95">
      <QuizContainer
        title={gameTitle}
        showBackButton={true}
        showRefreshButton={gameContent !== null}
        showHomeButton={true}
        onBack={() => gameContent ? handleReset() : navigate('/')}
        onRefresh={() => {
          if (iframeRef.current) {
            const iframe = iframeRef.current;
            iframe.srcdoc = '';
            setTimeout(() => {
              if (iframe && gameContent) {
                iframe.srcdoc = gameContent;
              }
            }, 100);
          }
        }}
        footerContent={gameContent ? (
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-primary/20"
            >
              Tạo minigame mới
            </Button>
            
            <Button 
              variant="default" 
              onClick={handleShare}
              className="bg-primary"
            >
              Chia sẻ minigame
            </Button>
          </div>
        ) : null}
      >
        {renderContent()}
      </QuizContainer>
    </div>
  );
};

export default Quiz;

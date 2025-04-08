
import React, { useState, useRef, useEffect } from 'react';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { animateContentHighlight } from '@/lib/animations';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Brain, PenTool, BookOpen, Info, Send } from 'lucide-react';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedGame, setHasGeneratedGame] = useState(false);
  const [canvasMode, setCanvasMode] = useState(true); // Canvas mode always on by default
  
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string) => void }>(null);
  const { addBlock } = useCanvasState();
  const { toast } = useToast();
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Minigame Tương Tác';
    // Always enable canvas mode
    localStorage.setItem('canvas_mode', 'true');
    
    // Parse URL parameters for direct game creation
    const queryParams = new URLSearchParams(location.search);
    const topicParam = queryParams.get('topic');
    const autoStart = queryParams.get('autostart');
    
    if (topicParam) {
      setTopic(topicParam);
      
      // If autostart is set, generate the quiz automatically
      if (autoStart === 'true') {
        setIsGenerating(true);
        setTimeout(() => {
          handleGameGeneration(topicParam);
        }, 100);
      }
    }
  }, [location.search]);

  useEffect(() => {
    // Apply animations on mount
    if (mainContentRef.current) {
      animateContentHighlight(mainContentRef.current);
    }
  }, []);

  const handleCreateFromPrompt = (type: BlockType, content: string) => {
    const canvasElement = document.querySelector('.canvas-grid');
    const canvasRect = canvasElement?.getBoundingClientRect();
    
    const position = {
      x: ((canvasRect?.width || 800) / 2) - 150,
      y: ((canvasRect?.height || 600) / 2) - 100
    };
    
    addBlock(type, position, canvasRect as DOMRect);
  };

  const handleGameGeneration = (gameTopic: string) => {
    if (!gameTopic.trim()) {
      toast({
        title: "Chủ Đề Trống",
        description: "Vui lòng cung cấp chủ đề cho minigame",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    setTimeout(() => {
      if (quizGeneratorRef.current) {
        quizGeneratorRef.current.generateQuiz(gameTopic);
        setHasGeneratedGame(true);
      } else {
        toast({
          title: "Lỗi Hệ Thống",
          description: "Không thể kết nối với trình tạo minigame. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
      setIsGenerating(false);
    }, 100);
  };

  const renderGameCreator = () => {
    return (
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Minigame Tương Tác</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Tạo trò chơi học tập tương tác với AI. Nhập chủ đề và nhận ngay trò chơi của bạn!
          </p>
        </div>
        
        <Card className="bg-background/60 backdrop-blur-sm border-primary/20 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Brain className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Nhập Chủ Đề Của Bạn</h3>
                  <p className="text-sm text-muted-foreground">
                    Mô tả chi tiết chủ đề hoặc loại trò chơi bạn muốn tạo
                  </p>
                </div>
              </div>
              
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Tạo một trò chơi trắc nghiệm về lịch sử Việt Nam với 10 câu hỏi..."
                className="min-h-[120px] text-base border-primary/20 focus:border-primary/40"
              />
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-1" />
                  <p className="text-sm text-muted-foreground">
                    Chế độ Canvas <span className="text-primary font-medium">đã được bật</span> để tạo giao diện trò chơi đẹp mắt hơn.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                    <PenTool className="w-6 h-6 text-primary mb-2" />
                    <h4 className="text-sm font-medium">Tùy chỉnh chi tiết</h4>
                    <p className="text-xs text-muted-foreground">Càng chi tiết càng tốt</p>
                  </div>
                  
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                    <BookOpen className="w-6 h-6 text-primary mb-2" />
                    <h4 className="text-sm font-medium">Nêu chủ đề học tập</h4>
                    <p className="text-xs text-muted-foreground">Lịch sử, toán học, ngôn ngữ...</p>
                  </div>
                  
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                    <Sparkles className="w-6 h-6 text-primary mb-2" />
                    <h4 className="text-sm font-medium">Trò chơi tương tác</h4>
                    <p className="text-xs text-muted-foreground">Quiz, ghép cặp, sắp xếp...</p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => handleGameGeneration(topic)}
                disabled={!topic.trim() || isGenerating}
                className="w-full mt-2 bg-gradient-to-r from-primary to-primary/80 text-white py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang tạo trò chơi...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Tạo Trò Chơi Ngay
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 flex justify-center">
          <p className="text-xs text-muted-foreground italic">
            Powered by AI • Mọi trò chơi được tạo hoàn toàn với trí tuệ nhân tạo
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-background to-background/95 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden p-0 relative">
          <div ref={mainContentRef} className="h-full relative">
            {hasGeneratedGame ? (
              <QuizGenerator 
                ref={quizGeneratorRef} 
                topic={topic}
              />
            ) : (
              renderGameCreator()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

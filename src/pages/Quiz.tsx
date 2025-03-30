
import React, { useState, useRef, useEffect } from 'react';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import GameSettings from '@/components/quiz/GameSettings';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the game settings interface
export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  category: string;
}

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettingsData>({
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
  });
  
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string, settings?: GameSettingsData) => void }>(null);
  const { addBlock } = useCanvasState();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = 'Minigame Tương Tác';
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

  const handleGameRequest = (requestedTopic: string) => {
    if (!requestedTopic.trim()) {
      toast({
        title: "Chủ Đề Trống",
        description: "Vui lòng cung cấp chủ đề cho minigame",
        variant: "destructive",
      });
      return;
    }
    
    setTopic(requestedTopic);
    setShowSettings(true);
  };
  
  const handleStartGame = (settings: GameSettingsData) => {
    setGameSettings(settings);
    setShowSettings(false);
    setIsGenerating(true);
    
    setTimeout(() => {
      if (quizGeneratorRef.current) {
        quizGeneratorRef.current.generateQuiz(topic, settings);
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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar variant="inset" collapsible="icon">
            <SidebarContent>
              <ChatInterface 
                onCreateBlock={handleCreateFromPrompt} 
                onQuizRequest={handleGameRequest}
              />
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1 bg-background overflow-hidden p-0 relative">
            {showSettings ? (
              <GameSettings onStart={handleStartGame} topic={topic} />
            ) : (
              <div className="h-full relative">
                <div className="absolute top-2 right-2 z-10">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="p-4 max-w-md mx-auto">
                        <GameSettings 
                          onStart={handleStartGame} 
                          topic={topic} 
                          initialSettings={gameSettings}
                          inDrawer={true}
                        />
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
                <QuizGenerator 
                  ref={quizGeneratorRef} 
                  topic={topic}
                  gameSettings={gameSettings}
                />
              </div>
            )}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;

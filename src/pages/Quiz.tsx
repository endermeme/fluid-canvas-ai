
import React, { useState, useRef, useEffect } from 'react';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import { GameOptions } from '@/components/quiz/GameOptionsSelector';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string, options?: GameOptions) => void }>(null);
  const { addBlock } = useCanvasState();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = 'Trò Chơi Xếp Hình Tương Tác';
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
        description: "Vui lòng cung cấp chủ đề cho trò chơi xếp hình",
        variant: "destructive",
      });
      return;
    }
    
    setTopic(requestedTopic);
    setIsGenerating(true);
    
    setTimeout(() => {
      if (quizGeneratorRef.current) {
        quizGeneratorRef.current.generateQuiz(requestedTopic);
      } else {
        toast({
          title: "Lỗi Hệ Thống",
          description: "Không thể kết nối với trình tạo trò chơi. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
      setIsGenerating(false);
    }, 100);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-blue-950/90">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar variant="inset" collapsible="icon">
            <SidebarContent className="bg-sidebar/80 backdrop-blur-md">
              <ChatInterface 
                onCreateBlock={handleCreateFromPrompt} 
                onQuizRequest={handleGameRequest}
              />
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1 bg-background overflow-hidden p-0 m-0 md:m-3 rounded-none md:rounded-2xl shadow-2xl">
            <div className="h-full">
              <QuizGenerator 
                ref={quizGeneratorRef} 
                topic={topic}
              />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;

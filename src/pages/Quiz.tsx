
import React, { useState, useRef, useEffect } from 'react';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import QuickGameSelector from '@/components/quiz/QuickGameSelector';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { animateAIPanelSlideIn, animateContentHighlight } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string) => void }>(null);
  const { addBlock } = useCanvasState();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Minigame Tương Tác';
    
    // Parse URL parameters for direct game creation
    const queryParams = new URLSearchParams(location.search);
    const topicParam = queryParams.get('topic');
    const autoStart = queryParams.get('autostart');
    
    if (topicParam) {
      setTopic(topicParam);
      setIsManualMode(true);
      
      // If autostart is set, generate the quiz automatically
      if (autoStart === 'true') {
        setIsGenerating(true);
        setTimeout(() => {
          if (quizGeneratorRef.current) {
            quizGeneratorRef.current.generateQuiz(topicParam);
          }
          setIsGenerating(false);
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

  const handleGameRequest = (requestedTopic: string) => {
    if (!requestedTopic.trim()) {
      toast({
        title: "Chủ Đề Trống",
        description: "Vui lòng cung cấp chủ đề cho minigame",
        variant: "destructive",
      });
      return;
    }
    
    // Switch to manual mode when a chat request comes in
    setIsManualMode(true);
    
    // Directly generate the game
    setTopic(requestedTopic);
    setIsGenerating(true);
    
    setTimeout(() => {
      if (quizGeneratorRef.current) {
        quizGeneratorRef.current.generateQuiz(requestedTopic);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleOpenChat = () => {
    setSidebarOpen(true);
  };

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="min-h-screen flex flex-col w-full overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar variant="inset" collapsible="icon">
            <SidebarContent>
              <div ref={sidebarRef} className="h-full">
                <ChatInterface 
                  onCreateBlock={handleCreateFromPrompt} 
                  onQuizRequest={handleGameRequest}
                  onToggleSidebar={toggleSidebar}
                  isSidebarOpen={sidebarOpen}
                />
              </div>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1 bg-background overflow-hidden p-0 relative">
            <div ref={mainContentRef} className="h-full relative">
              {/* Chat button appears when sidebar is closed */}
              {!sidebarOpen && (
                <div className="absolute top-4 right-4 z-10">
                  <Button 
                    onClick={handleOpenChat}
                    variant="outline"
                    className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
                    size="sm"
                  >
                    <MessageSquarePlus size={16} />
                    Tạo Game Tùy Chỉnh
                  </Button>
                </div>
              )}
              
              {isManualMode ? (
                <QuizGenerator 
                  ref={quizGeneratorRef} 
                  topic={topic}
                />
              ) : (
                <QuickGameSelector />
              )}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;

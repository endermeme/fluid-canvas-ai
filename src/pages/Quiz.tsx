import React, { useState, useRef, useEffect } from 'react';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import QuickGameSelector from '@/components/quiz/QuickGameSelector';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { animateAIPanelSlideIn, animateContentHighlight } from '@/lib/animations';
import { BookmarkCheck, Bookmark } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string) => void }>(null);
  const { addBlock } = useCanvasState();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
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
    if (sidebarRef.current) {
      animateAIPanelSlideIn(sidebarRef.current);
    }
    
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

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 flex overflow-hidden">
        {/* Use Collapsible to control the sidebar visibility */}
        <Collapsible
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          className="z-20 h-full"
        >
          <div className={`transition-all duration-300 h-full ${sidebarOpen ? 'w-72' : 'w-0'}`}>
            <CollapsibleContent className="h-full">
              <div ref={sidebarRef} className="h-full flex flex-col">
                <ChatInterface 
                  onCreateBlock={handleCreateFromPrompt} 
                  onQuizRequest={handleGameRequest}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
        
        <div className="flex-1 bg-background overflow-hidden p-0 relative">
          {/* Sidebar toggle button positioned on the left edge */}
          <button
            onClick={toggleSidebar}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 bg-primary/10 rounded-r-md hover:bg-primary/20 transition-colors"
            title={sidebarOpen ? "Thu gọn" : "Mở rộng"}
            aria-label={sidebarOpen ? "Thu gọn" : "Mở rộng"}
          >
            {sidebarOpen ? (
              <BookmarkCheck size={20} className="text-primary" />
            ) : (
              <Bookmark size={20} className="text-primary" />
            )}
          </button>
          
          <div ref={mainContentRef} className="h-full relative">
            {isManualMode ? (
              <QuizGenerator 
                ref={quizGeneratorRef} 
                topic={topic}
              />
            ) : (
              <QuickGameSelector />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;


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
import { Settings, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApiKeySettings from '@/components/quiz/ApiKeySettings';

const API_KEY_STORAGE_KEY = 'claude-api-key';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [hasValidApiKey, setHasValidApiKey] = useState(false);
  
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string) => void }>(null);
  const { addBlock } = useCanvasState();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Minigame Tương Tác';
    
    // Check API key validity
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    setHasValidApiKey(apiKey.startsWith('sk-'));
    
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
    
    // Listen for storage events (API key changes)
    const handleStorageChange = () => {
      const newApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
      setHasValidApiKey(newApiKey.startsWith('sk-'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    
    // Check for valid API key first
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "API Key Không Hợp Lệ",
        description: "Vui lòng cấu hình API key Claude hợp lệ trước",
        variant: "destructive",
      });
      setShowApiSettings(true);
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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        {/* API Key Status Indicator */}
        <div className="bg-background border-b px-4 py-2 flex items-center justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 ${!hasValidApiKey ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}
            onClick={() => setShowApiSettings(true)}
          >
            <Key className="h-4 w-4" />
            {hasValidApiKey ? 'API Key Đã Cấu Hình' : 'Thiết Lập API Key'}
          </Button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar variant="inset" collapsible="icon">
            <SidebarContent>
              <div ref={sidebarRef} className="h-full">
                <ChatInterface 
                  onCreateBlock={handleCreateFromPrompt} 
                  onQuizRequest={handleGameRequest}
                />
              </div>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1 bg-background overflow-hidden p-0 relative">
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
          </SidebarInset>
        </div>
      </div>
      
      <ApiKeySettings 
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
      />
    </SidebarProvider>
  );
};

export default Quiz;

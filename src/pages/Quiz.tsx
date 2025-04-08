
import React, { useState, useRef, useEffect } from 'react';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import SimpleChatInterface from '@/components/chat/SimpleChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { animateContentHighlight } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { PlusCircle, Brain } from 'lucide-react';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string) => void }>(null);
  const { addBlock } = useCanvasState();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Minigame Tương Tác';
    
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

  const toggleChatInterface = () => {
    setShowChatInterface(!showChatInterface);
  };

  const goToCreateGame = () => {
    navigate('/create-game');
  };

  const renderEmptyState = () => (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mb-4">
          <Brain className="h-16 w-16 mx-auto text-primary/70" />
        </div>
        <h2 className="text-2xl font-bold">Tạo Minigame Với AI</h2>
        <p className="text-muted-foreground">
          Tạo các trò chơi học tập tương tác với trí tuệ nhân tạo Gemini. Nhập chủ đề và AI sẽ tạo trò chơi cho bạn.
        </p>
        <div className="pt-4 flex flex-col gap-3">
          <Button 
            className="w-full bg-primary"
            onClick={goToCreateGame}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo Trò Chơi Mới
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={toggleChatInterface}
          >
            <Brain className="mr-2 h-4 w-4" />
            Chat Với AI
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col w-full overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-background overflow-hidden p-0 relative">
          <div ref={mainContentRef} className="h-full relative">
            {topic ? (
              <QuizGenerator 
                ref={quizGeneratorRef} 
                topic={topic}
              />
            ) : (
              renderEmptyState()
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Chat Interface */}
      {showChatInterface && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-center items-center">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">Tạo Game Tùy Chỉnh</h2>
              <button 
                className="text-foreground/70 hover:text-foreground"
                onClick={toggleChatInterface}
              >
                ✕
              </button>
            </div>
            <div className="h-[60vh]">
              <SimpleChatInterface 
                onQuizRequest={handleGameRequest}
                onClose={toggleChatInterface}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;


import React, { useState, useRef, useEffect } from 'react';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import QuickGameSelector from '@/components/quiz/quick-game-selector';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { animateContentHighlight } from '@/lib/animations';
import HistoryPanel from '@/components/history/HistoryPanel';
import { Button } from '@/components/ui/button';
import { History, BookOpen } from 'lucide-react';
import { StoredGame } from '@/utils/gameExport';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string) => void }>(null);
  const { addBlock } = useCanvasState();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

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

  const toggleChatInterface = () => {
    setShowChatInterface(!showChatInterface);
  };
  
  const toggleHistoryPanel = () => {
    setShowHistoryPanel(!showHistoryPanel);
  };
  
  const handleSelectFromHistory = (game: StoredGame) => {
    setIsManualMode(true);
    // Load the selected game directly into view
    if (quizGeneratorRef.current) {
      // We need to modify the QuizGenerator to accept a StoredGame directly
      quizGeneratorRef.current.generateQuiz(game.title);
      
      // Simulate a delay to allow the component to initialize
      setTimeout(() => {
        const miniGame = {
          title: game.title,
          description: game.description,
          content: game.htmlContent
        };
        
        // This requires changing the interface of QuizGenerator, but for now
        // we'll use what we have available
        window.location.href = `/quiz/shared/${game.id}`;
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-background overflow-hidden p-0 relative">
          <div ref={mainContentRef} className="h-full relative">
            {isManualMode ? (
              <QuizGenerator 
                ref={quizGeneratorRef} 
                topic={topic}
              />
            ) : (
              <QuickGameSelector 
                onGameRequest={handleGameRequest}
                onToggleChat={toggleChatInterface}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* History Button */}
      <div className="fixed bottom-4 left-4 z-30">
        <Button 
          onClick={toggleHistoryPanel}
          variant="outline"
          className="rounded-full h-12 w-12 p-0 bg-background/80 backdrop-blur-sm border-primary/30"
        >
          <BookOpen className="h-5 w-5 text-primary" />
        </Button>
      </div>
      
      {/* History Panel */}
      <HistoryPanel 
        isOpen={showHistoryPanel}
        onClose={toggleHistoryPanel}
        onSelectGame={handleSelectFromHistory}
      />
      
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
              <ChatInterface 
                onCreateBlock={handleCreateFromPrompt} 
                onQuizRequest={handleGameRequest}
                onCloseChatInterface={toggleChatInterface}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;

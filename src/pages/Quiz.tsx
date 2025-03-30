import React, { useState, useRef, useEffect } from 'react';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import GameSettings from '@/components/quiz/GameSettings';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
    document.title = 'Minigame Tương Tác';
    
    // Parse URL parameters for direct game creation
    const queryParams = new URLSearchParams(location.search);
    const topicParam = queryParams.get('topic');
    const autoStart = queryParams.get('autostart');
    
    if (topicParam) {
      setTopic(topicParam);
      
      // Check for game settings in URL
      const difficultyParam = queryParams.get('difficulty');
      const questionCountParam = queryParams.get('questionCount');
      const timePerQuestionParam = queryParams.get('timePerQuestion');
      const categoryParam = queryParams.get('category');
      
      const urlSettings: GameSettingsData = {
        difficulty: (difficultyParam as 'easy' | 'medium' | 'hard') || 'medium',
        questionCount: questionCountParam ? parseInt(questionCountParam) : 10,
        timePerQuestion: timePerQuestionParam ? parseInt(timePerQuestionParam) : 30,
        category: categoryParam || 'general',
      };
      
      setGameSettings(urlSettings);
      
      // If autostart is set, generate the quiz automatically
      if (autoStart === 'true') {
        setIsGenerating(true);
        setTimeout(() => {
          if (quizGeneratorRef.current) {
            quizGeneratorRef.current.generateQuiz(topicParam, urlSettings);
          }
          setIsGenerating(false);
        }, 100);
      } else {
        // If no autostart, show settings
        setShowSettings(true);
      }
    }
  }, [location.search]);

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

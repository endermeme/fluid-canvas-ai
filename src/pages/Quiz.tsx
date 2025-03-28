
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Link } from 'react-router-dom';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const quizGeneratorRef = useRef<{ generateQuiz: (topic: string) => void }>(null);
  const { addBlock } = useCanvasState();

  const handleCreateFromPrompt = (type: BlockType, content: string) => {
    const canvasElement = document.querySelector('.canvas-grid');
    const canvasRect = canvasElement?.getBoundingClientRect();
    
    const position = {
      x: ((canvasRect?.width || 800) / 2) - 150,
      y: ((canvasRect?.height || 600) / 2) - 100
    };
    
    addBlock(type, position, canvasRect as DOMRect);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleStartQuiz = () => {
    if (quizGeneratorRef.current && topic.trim()) {
      quizGeneratorRef.current.generateQuiz(topic);
    }
  };

  const handleQuizRequest = (requestedTopic: string) => {
    const topicToUse = requestedTopic || 'General Knowledge';
    setTopic(topicToUse);
    
    // Short delay to ensure the ref is ready
    setTimeout(() => {
      if (quizGeneratorRef.current) {
        quizGeneratorRef.current.generateQuiz(topicToUse);
      }
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
                onQuizRequest={handleQuizRequest}
              />
              <div className="p-3 border-t border-border mt-auto">
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Back to Canvas
                  </Button>
                </Link>
              </div>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1">
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-3xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>AI Quiz Generator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Enter a topic or paste content to generate quiz questions. The AI will create multiple-choice questions based on your input.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input 
                        value={topic}
                        onChange={handleTopicChange}
                        placeholder="Enter a topic or context for quiz generation..."
                        className="flex-1"
                      />
                      <Button onClick={handleStartQuiz}>Generate Quiz</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <QuizGenerator ref={quizGeneratorRef} />
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;

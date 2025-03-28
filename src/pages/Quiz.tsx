
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';

const Quiz = () => {
  const [topic, setTopic] = useState('History');
  const [currentTopic, setCurrentTopic] = useState('History');
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
    setCurrentTopic(topic);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar variant="inset" collapsible="icon">
            <SidebarContent>
              <ChatInterface onCreateBlock={handleCreateFromPrompt} />
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1">
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-3xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Interactive Quiz Generator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input 
                        value={topic}
                        onChange={handleTopicChange}
                        placeholder="Enter quiz topic"
                        className="flex-1"
                      />
                      <Button onClick={handleStartQuiz}>Generate Quiz</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <QuizGenerator topic={currentTopic} />
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;

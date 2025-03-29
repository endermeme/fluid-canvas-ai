
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CanvasContainer from '@/components/canvas/CanvasContainer';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Button } from '@/components/ui/button';
import { Gamepad, Sparkles, Pencil } from 'lucide-react'; // Changed PenLine to Pencil

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const { addBlock } = useCanvasState();

  // Handler for creating blocks from AI prompts
  const handleCreateFromPrompt = (type: BlockType, content: string) => {
    // Get a reference to the canvas element
    const canvasElement = document.querySelector('.canvas-grid');
    const canvasRect = canvasElement?.getBoundingClientRect();
    
    // Calculate a position in the visible part of the canvas
    const position = {
      x: ((canvasRect?.width || 800) / 2) - 150,
      y: ((canvasRect?.height || 600) / 2) - 100
    };
    
    // Add the block to the canvas with the content from the AI
    addBlock(type, position, canvasRect as DOMRect);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        {/* Main content with sidebar */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar variant="inset" collapsible="icon">
            <SidebarContent>
              <ChatInterface onCreateBlock={handleCreateFromPrompt} />
              <div className="p-3 border-t border-border mt-auto">
                <Link to="/quiz">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-sea-pale hover:bg-sea-light/30 border-sea text-sea-dark group transition-all duration-300 font-display font-medium shadow-button hover:shadow-glow">
                    <Gamepad className="h-5 w-5 text-sea group-hover:text-sea-bright transition-colors" />
                    <span className="tracking-wide">Khám Phá Trò Chơi Mini</span>
                    <Sparkles className="h-4 w-4 text-sea-light group-hover:text-sea-bright animate-pulse-soft" />
                  </Button>
                </Link>
              </div>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1">
            <CanvasContainer />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

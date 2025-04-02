
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MainContentArea from '@/components/canvas/MainContentArea';

const Index = () => {
  const isMobile = useIsMobile();
  const [isChatOpen, setIsChatOpen] = useState(!isMobile);
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
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex flex-col w-full">
        {/* Main content with sidebar */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar variant="inset" collapsible="icon">
            <SidebarContent>
              <ChatInterface onCreateBlock={handleCreateFromPrompt} />
              <div className="p-3 border-t border-border mt-auto">
                <Link to="/quiz">
                  <Button variant="outline" className="w-full flex items-center gap-2 min-h-[44px]">
                    <GraduationCap className="h-4 w-4" />
                    Minigame Giáo Dục
                  </Button>
                </Link>
              </div>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1 flex flex-col">
            <MainContentArea />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

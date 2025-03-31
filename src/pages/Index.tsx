
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CanvasContainer from '@/components/canvas/CanvasContainer';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Button } from '@/components/ui/button';
import { Gamepad } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const [isChatOpen, setIsChatOpen] = useState(!isMobile);
  const { addBlock } = useCanvasState();
  const navigate = useNavigate();

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

  // Handler for quick game selection
  const handleQuickGameSelect = (gameTopic: string) => {
    navigate(`/quiz?topic=${encodeURIComponent(gameTopic)}&autostart=true`);
  };

  // Quick game options
  const quickGameOptions = [
    "Câu Đố Lịch Sử", 
    "Trắc Nghiệm Địa Lý",
    "Truy Tìm Kho Báu",
    "Đố Vui Toán Học",
    "Trò Chơi Từ Vựng",
    "Thách Đố Khoa Học"
  ];

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
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Gamepad className="h-4 w-4" />
                    Minigame
                  </Button>
                </Link>
              </div>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1 flex flex-col">
            <div className="flex-1">
              <CanvasContainer />
            </div>
            
            {/* Quick Game Options Panel */}
            <div className="bg-card/50 backdrop-blur-sm border-t p-3">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-2">
                  <Gamepad className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">Tạo nhanh</h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {quickGameOptions.map((game) => (
                    <div key={game} className="flex">
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="w-full text-xs h-auto py-2 hover:bg-primary/10"
                        onClick={() => handleQuickGameSelect(game)}
                      >
                        {game}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

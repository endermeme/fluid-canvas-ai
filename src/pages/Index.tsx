
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CanvasContainer from '@/components/canvas/CanvasContainer';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Button } from '@/components/ui/button';
import { Gamepad, Sparkles } from 'lucide-react';
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
            
            {/* Quick Game Options Panel - Modern Design */}
            <div className="bg-gradient-to-r from-background to-accent/20 backdrop-blur-md border-t border-border/40 p-3">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-3">
                  <div className="bg-primary/10 rounded-full p-1 mr-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Tạo nhanh</h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {quickGameOptions.map((game) => (
                    <div key={game} className="flex">
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="w-full text-xs h-auto py-2 px-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-sm"
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

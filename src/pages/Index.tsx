
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mr-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Tạo nhanh
                  </h3>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {quickGameOptions.map((game, index) => (
                    <div key={game} className="flex">
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="w-full h-auto py-2.5 px-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-sm animate-float-in"
                        style={{animationDelay: `${index * 0.05}s`}}
                        onClick={() => handleQuickGameSelect(game)}
                      >
                        <div className="flex flex-col items-center">
                          {game.split(' ').slice(-1)[0]}
                        </div>
                      </Button>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="sr-only">Thông tin</span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="bg-white/90 backdrop-blur-md border border-primary/20 shadow-lg">
                          {game}
                        </PopoverContent>
                      </Popover>
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


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CanvasArea from '@/components/canvas/CanvasArea';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Button } from '@/components/ui/button';
import { Gamepad, Sparkles, GraduationCap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const [isChatOpen, setIsChatOpen] = useState(!isMobile);
  const { addBlock } = useCanvasState();
  const navigate = useNavigate();

  const handleCreateFromPrompt = (type: BlockType, content: string) => {
    const canvasElement = document.querySelector('.canvas-grid');
    const canvasRect = canvasElement?.getBoundingClientRect();
    
    const position = {
      x: ((canvasRect?.width || 800) / 2) - 150,
      y: ((canvasRect?.height || 600) / 2) - 100
    };
    
    addBlock(type, position, canvasRect as DOMRect);
  };

  const handleQuickGameSelect = (gameTopic: string, gameType: string = 'quiz') => {
    navigate(`/quiz?preset=${encodeURIComponent(gameType)}&topic=${encodeURIComponent(gameTopic)}`);
  };

  const quickGameOptions = [
    { name: "Trắc Nghiệm", type: "quiz", topic: "Học Toán Vui" },
    { name: "Ghép Cặp", type: "matching", topic: "Từ Vựng Tiếng Anh" },
    { name: "Ghi Nhớ", type: "memory", topic: "Khám Phá Lịch Sử" },
    { name: "Thẻ Học Tập", type: "flashcards", topic: "Địa Lý Thế Giới" },
    { name: "Sắp Xếp", type: "ordering", topic: "Thí Nghiệm Khoa Học" },
    { name: "Tìm Từ", type: "wordsearch", topic: "Tư Duy Logic" }
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex flex-col w-full">
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
            <div className="flex-1">
              <CanvasArea 
                blocks={[]} 
                selectedBlockIds={[]} 
                onBlockSelect={() => {}} 
                onBlockUpdate={() => {}} 
                onBlockDelete={() => {}} 
                onBlockDuplicate={() => {}} 
                onStartDrag={() => {}} 
                onCanvasClick={() => {}} 
                canvasRef={React.createRef()} 
              />
            </div>
            
            <div className="bg-gradient-to-r from-background to-accent/20 backdrop-blur-md border-t border-border/40 p-3 shadow-sm">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mr-2 animate-pulse-soft">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Học tập vui
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {quickGameOptions.map((game, index) => (
                    <div key={game.name} className="flex">
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="w-full h-auto py-3 px-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-sm animate-float-in min-h-[52px] text-sm"
                        style={{animationDelay: `${index * 0.05}s`}}
                        onClick={() => handleQuickGameSelect(game.topic, game.type)}
                      >
                        <div className="flex flex-col items-center">
                          {game.name}
                        </div>
                      </Button>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="sr-only">Thông tin</span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="bg-white/90 backdrop-blur-md border border-primary/20 shadow-lg">
                          {game.topic}
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

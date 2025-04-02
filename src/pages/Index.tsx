
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CanvasContainer from '@/components/canvas/CanvasContainer';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Button } from '@/components/ui/button';
import { Gamepad, Sparkles, ChevronRight, BookOpen, GraduationCap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Index = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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

  // Quick game options for educational games
  const quickGameOptions = [
    "Học Toán Vui", 
    "Từ Vựng Tiếng Anh",
    "Khám Phá Lịch Sử",
    "Địa Lý Thế Giới",
    "Thí Nghiệm Khoa Học",
    "Tư Duy Logic"
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Bookmark-style tab that sticks out from the left */}
      <div 
        className={cn(
          "fixed z-20 top-1/3 -left-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "left-[300px] md:left-[320px]" : "left-0"
        )}
      >
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 bg-primary rounded-r-lg px-3 py-4 text-primary-foreground shadow-lg hover:brightness-110 transition-all"
        >
          <BookOpen className="h-5 w-5" />
          <ChevronRight className={cn(
            "h-5 w-5 transition-transform", 
            isSidebarOpen ? "rotate-180" : ""
          )} />
        </button>
      </div>

      {/* Main content with collapsible sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar panel */}
        <div 
          className={cn(
            "fixed top-0 left-0 h-full bg-background border-r border-border shadow-lg z-10 transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "w-[300px] md:w-[320px]"
          )}
        >
          <div className="flex flex-col h-full">
            <ChatInterface onCreateBlock={handleCreateFromPrompt} />
            <div className="p-3 border-t border-border mt-auto">
              <Link to="/quiz">
                <Button variant="outline" className="w-full flex items-center gap-2 min-h-[44px]">
                  <GraduationCap className="h-4 w-4" />
                  Minigame Giáo Dục
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main canvas area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <CanvasContainer />
          </div>
          
          {/* Quick Game Options Panel - Enhanced Design */}
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
                  <Button
                    key={game}
                    variant="ghost" 
                    size="sm"
                    className="w-full h-auto py-3 px-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-sm animate-float-in min-h-[52px] text-sm"
                    style={{animationDelay: `${index * 0.05}s`}}
                    onClick={() => handleQuickGameSelect(game)}
                  >
                    <div className="flex flex-col items-center">
                      {game}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

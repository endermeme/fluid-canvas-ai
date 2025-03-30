import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CanvasContainer from '@/components/canvas/CanvasContainer';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Button } from '@/components/ui/button';
import { Gamepad } from 'lucide-react';
import GameSettings from '@/components/quiz/GameSettings';
import { GameSettingsData } from '@/pages/Quiz';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const [isChatOpen, setIsChatOpen] = useState(!isMobile);
  const { addBlock } = useCanvasState();
  const [selectedQuickGame, setSelectedQuickGame] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    setSelectedQuickGame(gameTopic);
    setShowSettings(true);
  };

  // Handler for starting the game after settings are selected
  const handleStartGame = (settings: GameSettingsData) => {
    if (selectedQuickGame) {
      navigate(`/quiz?topic=${encodeURIComponent(selectedQuickGame)}&autostart=true&difficulty=${settings.difficulty}&questionCount=${settings.questionCount}&timePerQuestion=${settings.timePerQuestion}&category=${settings.category}`);
    }
  };

  // Handler for canceling game settings
  const handleCancelSettings = () => {
    setShowSettings(false);
    setSelectedQuickGame(null);
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
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border-primary/20"
                  >
                    <Gamepad className="h-4 w-4" />
                    Minigame Tương Tác
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
            <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 backdrop-blur-sm border-t p-3 md:p-4">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-medium mb-2 md:mb-3 flex items-center">
                  <Gamepad className="h-5 w-5 mr-2 text-primary" />
                  Tạo nhanh minigame
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {quickGameOptions.map((game) => (
                    <div key={game} className="flex">
                      <Button
                        variant="outline" 
                        size="sm"
                        className="w-full text-xs h-auto py-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm hover:bg-primary/20 border-primary/20"
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
          
          {/* Game Settings Dialog */}
          <Dialog 
            open={showSettings} 
            onOpenChange={(open) => {
              if (!open) {
                handleCancelSettings();
              } else {
                setShowSettings(open);
              }
            }}
          >
            <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] p-0 gap-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 backdrop-blur-md border-primary/20">
              <div className="p-0 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {selectedQuickGame && (
                    <GameSettings 
                      onStart={handleStartGame} 
                      topic={selectedQuickGame}
                      onCancel={handleCancelSettings}
                      inModal={true}
                    />
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

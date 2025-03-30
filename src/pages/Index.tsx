
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CanvasContainer from '@/components/canvas/CanvasContainer';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useCanvasState } from '@/hooks/useCanvasState';
import { BlockType } from '@/lib/block-utils';
import { Button } from '@/components/ui/button';
import { Gamepad } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import GameSettings from '@/components/quiz/GameSettings';
import { GameSettingsData } from '@/pages/Quiz';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
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
    <SidebarProvider defaultOpen={true}>
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
            <div className="bg-card/50 backdrop-blur-sm border-t p-4">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Gamepad className="h-5 w-5 mr-2" />
                  Tạo nhanh minigame
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {quickGameOptions.map((game) => (
                    <div key={game} className="flex">
                      <Button
                        variant="outline" 
                        size="sm"
                        className="w-full text-xs h-auto py-2"
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
          
          {/* Game Settings Modal */}
          {selectedQuickGame && showSettings && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card rounded-lg shadow-lg overflow-hidden max-w-md w-full">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium">Cài Đặt: {selectedQuickGame}</h3>
                </div>
                <GameSettings 
                  onStart={handleStartGame} 
                  topic={selectedQuickGame}
                  onCancel={() => setShowSettings(false)}
                  inModal={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

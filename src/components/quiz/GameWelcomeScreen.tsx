
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad, Settings2, X, ChevronRight, FileText } from 'lucide-react';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import GameOptionsSelector, { GameOptions } from './GameOptionsSelector';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface GameWelcomeScreenProps {
  onTopicSelect: (topic: string, options?: GameOptions) => void;
}

const GameWelcomeScreen = ({ onTopicSelect }: GameWelcomeScreenProps) => {
  const suggestedTopics = [
    "Trò Chơi Đố Vui", "Xếp Hình", "Nhớ Hình", "Phản Xạ", 
    "Truy Tìm Kho Báu", "Câu Đố Logic", "Vẽ Tranh", "Giải Mã", 
    "Đua Xe", "Ghép Đôi", "Trò Chơi Trí Nhớ", "Thử Thách"
  ];
  
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isCustomTopicDialog, setIsCustomTopicDialog] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [gameOptions, setGameOptions] = useState<GameOptions>({
    contentType: 'entertainment',
    difficulty: 'medium',
    ageGroup: 'all',
    customContent: '',
    customFile: null
  });

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    setIsShowingOptions(true);
  };
  
  const handleOptionsChange = (newOptions: GameOptions) => {
    setGameOptions(newOptions);
  };

  const handleConfirm = () => {
    if (selectedTopic) {
      onTopicSelect(selectedTopic, gameOptions);
    }
  };

  const handleCustomTopicConfirm = () => {
    if (customTopic.trim()) {
      setSelectedTopic(customTopic.trim());
      setIsCustomTopicDialog(false);
      setIsShowingOptions(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6 p-6 bg-gradient-to-b from-sea-pale/70 to-white/90 dark:from-sea-dark/30 dark:to-slate-900/50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-r from-sea/90 to-sea-light/90 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
        <Gamepad size={32} className="text-white" />
        <div className="absolute inset-0 rounded-full bg-sea-light/20 animate-ping"></div>
      </div>
      
      <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-sea-bright to-sea-dark">
        Trò Chơi Mini Tương Tác
      </h2>
      
      <p className="text-center max-w-lg text-slate-600 dark:text-slate-300">
        Chọn một chủ đề bên dưới hoặc nhập chủ đề tùy chỉnh vào thanh chat để tạo một minigame vui nhộn và tương tác.
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mt-4">
        {suggestedTopics.map((topic) => (
          <Button 
            key={topic}
            variant="outline" 
            className="rounded-full border-sea-pale dark:border-sea-dark/80 hover:bg-sea-pale/70 dark:hover:bg-sea-dark/50 transition-all shadow-sm"
            onClick={() => handleTopicClick(topic)}
          >
            {topic}
          </Button>
        ))}
        <Button 
          variant="outline" 
          className="rounded-full border-sea/30 bg-sea/10 hover:bg-sea/20 text-sea-bright font-medium transition-all shadow-sm"
          onClick={() => setIsCustomTopicDialog(true)}
        >
          <FileText size={16} className="mr-1" />
          Tùy Chỉnh
        </Button>
      </div>

      {/* Custom Topic Dialog */}
      <Dialog open={isCustomTopicDialog} onOpenChange={setIsCustomTopicDialog}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-lg border-sea-pale/50">
          <DialogHeader>
            <DialogTitle className="text-sea-dark">Tạo Chủ Đề Tùy Chỉnh</DialogTitle>
            <DialogDescription>
              Nhập chủ đề tùy chỉnh cho trò chơi mini của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Nhập chủ đề của bạn..."
              className="w-full p-2 border border-sea-pale dark:border-sea-dark/30 rounded-md bg-white/50 dark:bg-slate-900/50 focus:ring-sea focus:border-sea"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCustomTopicDialog(false)}
              className="border-sea-pale dark:border-sea-dark/30">
              Hủy
            </Button>
            <Button onClick={handleCustomTopicConfirm}
              className="bg-sea hover:bg-sea-bright">
              Tiếp Tục
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Options Drawer */}
      <Drawer open={isShowingOptions} onOpenChange={setIsShowingOptions}>
        <DrawerContent className="bg-white/95 backdrop-blur-lg border-t border-sea-pale/50">
          <DrawerHeader>
            <DrawerTitle className="text-xl text-sea-bright">Tùy chỉnh minigame</DrawerTitle>
            <DrawerDescription>
              {selectedTopic ? (
                <span>Điều chỉnh tùy chọn cho minigame <strong>"{selectedTopic}"</strong></span>
              ) : (
                "Điều chỉnh tùy chọn cho minigame của bạn"
              )}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2">
            <GameOptionsSelector 
              options={gameOptions} 
              onOptionsChange={handleOptionsChange}
            />
          </div>
          <DrawerFooter>
            <div className="flex gap-3">
              <Button 
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-sea to-sea-bright hover:from-sea-bright hover:to-sea-dark"
              >
                Tạo Minigame
                <ChevronRight size={16} className="ml-1" />
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="border-sea-pale dark:border-sea-dark/30">
                  <X size={16} className="mr-1" />
                  Hủy
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default GameWelcomeScreen;

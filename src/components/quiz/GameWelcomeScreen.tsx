import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Gamepad, Settings2, X, ChevronRight, FileText, Star, Sparkles, 
  Brain, Puzzle, Rocket, Trophy, Target, Timer, Music, Gift, Heart, Map,
  Pencil, Joystick // Replacing PenLine with Pencil and Controller with Joystick
} from 'lucide-react';
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
    { name: "Trò Chơi Đố Vui", icon: <Brain size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Xếp Hình", icon: <Puzzle size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Nhớ Hình", icon: <Star size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Phản Xạ", icon: <Timer size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Truy Tìm Kho Báu", icon: <Map size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Câu Đố Logic", icon: <Brain size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Vẽ Tranh", icon: <Pencil size={16} className="mr-1 text-sea-bright" /> }, // Changed from PenLine to Pencil
    { name: "Giải Mã", icon: <Puzzle size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Đua Xe", icon: <Rocket size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Ghép Đôi", icon: <Heart size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Trò Chơi Trí Nhớ", icon: <Brain size={16} className="mr-1 text-sea-bright" /> }, 
    { name: "Thử Thách", icon: <Trophy size={16} className="mr-1 text-sea-bright" /> }
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
      
      <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-sea-bright to-sea-dark flex items-center justify-center font-heading tracking-wide">
        <Sparkles size={20} className="mr-2 text-sea-light animate-pulse-soft" />
        Trò Chơi Mini Tương Tác
        <Sparkles size={20} className="ml-2 text-sea-light animate-pulse-soft" />
      </h2>
      
      <p className="text-center max-w-lg text-slate-600 dark:text-slate-300 font-sans tracking-wide leading-relaxed">
        Chọn một chủ đề bên dưới hoặc nhập chủ đề tùy chỉnh vào thanh chat để tạo một minigame vui nhộn và tương tác.
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mt-4">
        {suggestedTopics.map((topic) => (
          <Button 
            key={topic.name}
            variant="outline" 
            className="rounded-full border-sea-pale dark:border-sea-dark/80 hover:bg-sea-pale/70 dark:hover:bg-sea-dark/50 transition-all shadow-sm flex items-center font-medium tracking-wide"
            onClick={() => handleTopicClick(topic.name)}
          >
            {topic.icon}
            {topic.name}
          </Button>
        ))}
        <Button 
          variant="outline" 
          className="rounded-full border-sea/30 bg-sea/10 hover:bg-sea/20 text-sea-bright font-medium transition-all shadow-button tracking-wide"
          onClick={() => setIsCustomTopicDialog(true)}
        >
          <FileText size={16} className="mr-1" />
          Tùy Chỉnh
          <Sparkles size={12} className="ml-1 text-sea-light animate-pulse-soft" />
        </Button>
      </div>

      {/* Custom Topic Dialog */}
      <Dialog open={isCustomTopicDialog} onOpenChange={setIsCustomTopicDialog}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-lg border-sea-pale/50 font-sans">
          <DialogHeader>
            <DialogTitle className="text-sea-dark flex items-center font-heading">
              <Joystick size={18} className="mr-2 text-sea" /> {/* Changed from Controller to Joystick */}
              Tạo Chủ Đề Tùy Chỉnh
            </DialogTitle>
            <DialogDescription className="tracking-wide">
              Nhập chủ đề tùy chỉnh cho trò chơi mini của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Nhập chủ đề của bạn..."
              className="w-full p-2 border border-sea-pale dark:border-sea-dark/30 rounded-md bg-white/50 dark:bg-slate-900/50 focus:ring-sea focus:border-sea font-sans tracking-wide"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCustomTopicDialog(false)}
              className="border-sea-pale dark:border-sea-dark/30 font-medium">
              Hủy
            </Button>
            <Button onClick={handleCustomTopicConfirm}
              className="bg-sea hover:bg-sea-bright flex items-center font-medium shadow-button hover:shadow-glow">
              Tiếp Tục
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Options Drawer */}
      <Drawer open={isShowingOptions} onOpenChange={setIsShowingOptions}>
        <DrawerContent className="bg-white/95 backdrop-blur-lg border-t border-sea-pale/50 font-sans">
          <DrawerHeader>
            <DrawerTitle className="text-xl text-sea-bright flex items-center font-heading">
              <Settings2 size={18} className="mr-2 text-sea animate-pulse-soft" />
              Tùy chỉnh minigame
            </DrawerTitle>
            <DrawerDescription className="tracking-wide">
              {selectedTopic ? (
                <span>Điều chỉnh tùy chọn cho minigame <strong className="font-medium">"{selectedTopic}"</strong></span>
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
                className="flex-1 bg-gradient-to-r from-sea to-sea-bright hover:from-sea-bright hover:to-sea-dark flex items-center justify-center font-medium shadow-button hover:shadow-glow tracking-wide"
              >
                <Rocket size={16} className="mr-1" />
                Tạo Minigame
                <ChevronRight size={16} className="ml-1" />
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="border-sea-pale dark:border-sea-dark/30 font-medium">
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

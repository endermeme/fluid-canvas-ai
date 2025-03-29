
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad, Settings2, X, ChevronRight } from 'lucide-react';
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

interface GameWelcomeScreenProps {
  onTopicSelect: (topic: string, options?: GameOptions) => void;
}

const GameWelcomeScreen = ({ onTopicSelect }: GameWelcomeScreenProps) => {
  const suggestedTopics = [
    "Đố vui", "Xếp hình", "Nhớ hình", "Phản xạ", 
    "Truy tìm", "Câu đố", "Vẽ tranh", "Toán học", 
    "Địa lý", "Lịch sử", "Vật lý", "Hóa học"
  ];
  
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [gameOptions, setGameOptions] = useState<GameOptions>({
    contentType: 'entertainment',
    difficulty: 'medium',
    ageGroup: 'all'
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

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6 p-6 bg-gradient-to-b from-sky-50/70 to-white/90 dark:from-sky-900/30 dark:to-slate-900/50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-r from-primary/90 to-blue-500/90 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
        <Gamepad size={32} className="text-white" />
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
      </div>
      
      <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
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
            className="rounded-full border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all shadow-sm"
            onClick={() => handleTopicClick(topic)}
          >
            {topic}
          </Button>
        ))}
      </div>

      <Drawer open={isShowingOptions} onOpenChange={setIsShowingOptions}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-xl text-primary">Tùy chỉnh minigame</DrawerTitle>
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
                className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
              >
                Tạo Minigame
                <ChevronRight size={16} className="ml-1" />
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="border-sky-200 dark:border-sky-800">
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

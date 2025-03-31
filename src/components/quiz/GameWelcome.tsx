
import React from 'react';
import { Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameSettingsData } from '@/pages/Quiz';

interface GameWelcomeProps {
  onTopicSelect: (topic: string) => void;
  showSettings?: boolean;
  onStartWithSettings?: (topic: string) => void;
}

const GameWelcome: React.FC<GameWelcomeProps> = ({ onTopicSelect, showSettings = false, onStartWithSettings }) => {
  const gameIdeas = ["Đố vui", "Xếp hình", "Nhớ hình", "Phản xạ", "Truy tìm", "Câu đố", "Vẽ tranh"];
  
  const handleTopicSelect = (topic: string) => {
    if (showSettings && onStartWithSettings) {
      onStartWithSettings(topic);
    } else {
      onTopicSelect(topic);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6 py-10">
      <div className="text-primary mb-4">
        <Gamepad size={64} />
      </div>
      <h2 className="text-2xl font-bold text-center">Chào mừng đến với Trò Chơi Mini</h2>
      <p className="text-center max-w-md">
        Nhập chủ đề vào thanh chat bên trái để tạo một minigame vui nhộn và tương tác.
      </p>
      <div className="flex flex-wrap justify-center gap-3 max-w-lg mt-4">
        {gameIdeas.map((idea) => (
          <Button 
            key={idea}
            variant="outline" 
            className="rounded-full"
            onClick={() => handleTopicSelect(idea)}
          >
            {idea}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GameWelcome;

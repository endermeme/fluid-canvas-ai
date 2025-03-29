
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad } from 'lucide-react';

interface GameWelcomeScreenProps {
  onTopicSelect: (topic: string) => void;
}

const GameWelcomeScreen = ({ onTopicSelect }: GameWelcomeScreenProps) => {
  const suggestedTopics = ["Đố vui", "Xếp hình", "Nhớ hình", "Phản xạ", "Truy tìm", "Câu đố", "Vẽ tranh"];

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
        {suggestedTopics.map((topic) => (
          <Button 
            key={topic}
            variant="outline" 
            className="rounded-full"
            onClick={() => onTopicSelect(topic)}
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GameWelcomeScreen;

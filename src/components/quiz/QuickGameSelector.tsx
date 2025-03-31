
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

const QuickGameSelector: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  
  const gameIdeas = ["Đố vui", "Xếp hình", "Nhớ hình", "Phản xạ", "Truy tìm", "Câu đố", "Vẽ tranh"];

  const handleTopicSelect = async (selectedTopic: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const game = await gameGenerator.generateMiniGame(selectedTopic);
      
      if (game) {
        setSelectedGame(game);
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Đã tạo minigame về "${selectedTopic}"`,
        });
      } else {
        throw new Error('Không thể tạo minigame');
      }
    } catch (error) {
      console.error('Lỗi Tạo Minigame:', error);
      setErrorMessage('Không thể tạo minigame. Vui lòng thử lại hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame. Vui lòng thử lại với chủ đề khác.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <GameLoading />;
  }

  if (errorMessage) {
    return <GameError 
      errorMessage={errorMessage} 
      onRetry={() => setErrorMessage(null)} 
      topic="minigame" 
    />;
  }

  if (selectedGame) {
    return <GameView miniGame={selectedGame} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6 py-10">
      <div className="text-primary mb-4">
        <Gamepad size={64} />
      </div>
      <h2 className="text-2xl font-bold text-center">Chào mừng đến với Trò Chơi Mini</h2>
      <p className="text-center max-w-md">
        Chọn một chủ đề dưới đây hoặc nhập chủ đề vào thanh chat bên trái để tạo một minigame vui nhộn và tương tác.
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

export default QuickGameSelector;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomGameForm from './CustomGameForm';
import { GameContainer } from '@/components/ui/game';

interface GameControllerProps {
  initialTopic?: string;
  onGameGenerated?: (game: any) => void;
}

const GameController: React.FC<GameControllerProps> = ({ 
  initialTopic = "", 
  onGameGenerated 
}) => {
  const navigate = useNavigate();
  
  const handleGameGeneration = (content: string, game?: any) => {
    console.log('🎮 Game form submitted:', { content, game });
    // Chỉ log thông tin, không tạo game thực tế
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <GameContainer
      title="Tạo Game Tùy Chỉnh"
      showBackButton={false}
      onBack={handleBack}
      showSettingsButton={false}
      showCreateButton={false}
      className="p-0 overflow-hidden"
      isCreatingGame={true}
    >
      <div className="h-full w-full overflow-hidden">
        <CustomGameForm 
          onGenerate={handleGameGeneration}
          onCancel={() => navigate('/')}
        />
      </div>
    </GameContainer>
  );
};

export default GameController;

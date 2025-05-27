
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContainer } from '@/components/ui/game';
import CustomGameForm from '@/components/custom/CustomGameForm';

const Quiz = () => {
  const [gameTitle] = useState('Tạo Game Tùy Chỉnh');
  const navigate = useNavigate();
  
  const handleGenerate = async (promptText: string, settings?: any) => {
    console.log('🎮 Form submitted with:', { promptText, settings });
    // Chỉ log thông tin, không tạo game thực tế
  };

  return (
    <GameContainer 
      title={gameTitle}
      showBackButton={true}
      onBack={() => navigate('/')}
      showSettingsButton={false}
      showCreateButton={false}
      isCreatingGame={true}
    >
      <CustomGameForm 
        onGenerate={handleGenerate}
        onCancel={() => navigate('/')}
      />
    </GameContainer>
  );
};

export default Quiz;

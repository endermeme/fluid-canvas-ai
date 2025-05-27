
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomGameForm from './CustomGameForm';
import EnhancedGameView from './EnhancedGameView';
import { GameContainer } from '@/components/ui/game';
import { generateGame } from '@/services/geminiService';

const GameController: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameContent, setGameContent] = useState<string>('');
  const [gameTitle, setGameTitle] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGameGeneration = async (prompt: string) => {
    console.log('🎮 Starting game generation:', { prompt });
    
    setIsGenerating(true);
    setError('');
    setGameTitle(prompt.substring(0, 50) + '...');
    
    try {
      const gameHTML = await generateGame(prompt);
      console.log('🎮 Game generated successfully:', {
        htmlLength: gameHTML.length,
        title: gameTitle
      });
      
      setGameContent(gameHTML);
    } catch (error) {
      console.error('🎮 Game generation failed:', error);
      setError(error instanceof Error ? error.message : 'Lỗi không xác định');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (gameContent) {
      setGameContent('');
      setGameTitle('');
      setError('');
    } else {
      navigate('/');
    }
  };

  const handleReload = () => {
    setGameContent('');
    setError('');
  };

  if (gameContent) {
    return (
      <GameContainer
        title="Custom Game"
        showBackButton={true}
        onBack={handleBack}
        className="h-screen"
      >
        <EnhancedGameView
          miniGame={{
            title: gameTitle,
            content: gameContent
          }}
          onReload={handleReload}
          onBack={handleBack}
          hideHeader={true}
        />
      </GameContainer>
    );
  }

  return (
    <CustomGameForm 
      onGenerate={handleGameGeneration}
      onCancel={() => navigate('/')}
      isGenerating={isGenerating}
    />
  );
};

export default GameController;

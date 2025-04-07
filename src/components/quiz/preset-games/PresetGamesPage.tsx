
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GameSelector from './GameSelector';
import PresetGameManager from './PresetGameManager';
import CustomGameForm from './CustomGameForm';

const PresetGamesPage = () => {
  const [state, setState] = useState<'select' | 'play' | 'custom'>('select');
  const [gameType, setGameType] = useState<string>('');
  const navigate = useNavigate();

  const handleGameSelect = (type: string) => {
    setGameType(type);
    setState('play');
  };

  const handleCustomGameSelect = (type: string) => {
    setGameType(type);
    setState('custom');
  };

  const handleBack = () => {
    if (state === 'play' || state === 'custom') {
      setState('select');
    } else {
      navigate('/');
    }
  };

  const handleCustomGameGenerate = (content: string) => {
    // In a real app, this would process the custom content
    // For now, just switch to play mode
    setState('play');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-background/80 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {state === 'select' ? 'Quay lại trang chủ' : 'Quay lại chọn trò chơi'}
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto">
        {state === 'select' && (
          <GameSelector onSelectGame={handleGameSelect} />
        )}
        
        {state === 'custom' && (
          <CustomGameForm 
            gameType={gameType} 
            onGenerate={handleCustomGameGenerate}
            onCancel={() => setState('select')}
          />
        )}
        
        {state === 'play' && (
          <PresetGameManager 
            gameType={gameType}
            onBack={() => setState('select')}
          />
        )}
      </div>
    </div>
  );
};

export default PresetGamesPage;

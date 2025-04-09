
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GameSelector from './GameSelector';
import PresetGameManager from './PresetGameManager';
import CustomGameForm from './CustomGameForm';
import { MiniGame } from '../generator/AIGameGenerator';

const PresetGamesPage = () => {
  const [state, setState] = useState<'select' | 'play' | 'custom'>('select');
  const [gameType, setGameType] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const navigate = useNavigate();

  const handleGameSelect = (type: string) => {
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

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleCustomGameGenerate = (content: string, game?: MiniGame) => {
    // Lưu prompt của người dùng cho PresetGameManager
    setCustomPrompt(content);
    
    // Sau khi đã có nội dung, chuyển sang chế độ chơi
    setState('play');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-background/80 backdrop-blur-sm flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {state === 'select' ? 'Quay lại trang chủ' : 'Quay lại chọn trò chơi'}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="ghost" size="sm" onClick={handleHomeClick}>
            <Home className="h-4 w-4 mr-2" />
            Trang chủ
          </Button>
        </div>
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
            initialTopic={customPrompt}
          />
        )}
      </div>
    </div>
  );
};

export default PresetGamesPage;

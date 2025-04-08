
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomGameForm from './CustomGameForm';

const PresetGamesPage = () => {
  const [state, setState] = useState<'custom' | 'play'>('custom');
  const [gameContent, setGameContent] = useState<string>('');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleCustomGameGenerate = (content: string) => {
    setGameContent(content);
    setState('play');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-background/80 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại trang chủ
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto">
        {state === 'custom' && (
          <CustomGameForm 
            onGenerate={handleCustomGameGenerate}
            onCancel={handleBack}
          />
        )}
        
        {state === 'play' && (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Game đã được tạo thành công!</h2>
            <p className="mb-4 text-muted-foreground">{gameContent}</p>
            <Button onClick={() => setState('custom')}>
              Tạo game mới
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetGamesPage;

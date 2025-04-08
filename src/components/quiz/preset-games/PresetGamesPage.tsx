
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
    <div className="h-full flex flex-col bg-gradient-to-b from-background/60 to-background">
      <div className="border-b p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center text-primary">
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
          <div className="p-6 max-w-3xl mx-auto bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">Game đã được tạo thành công!</h2>
            <div className="border rounded-md p-4 mb-6 bg-background/60 max-h-[50vh] overflow-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">{gameContent}</pre>
            </div>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setState('custom')}>
                Tạo game mới
              </Button>
              <Button onClick={() => navigator.clipboard.writeText(gameContent)} className="bg-primary">
                Sao chép nội dung
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetGamesPage;

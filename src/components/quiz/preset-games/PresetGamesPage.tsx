
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomGameForm from '../CustomGameForm';

const PresetGamesPage = () => {
  const [gameContent, setGameContent] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleCustomGameGenerate = (content: string) => {
    setGameContent(content);
    // You would typically process the generated content here
    console.log("Generated game content:", content);
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
        <CustomGameForm 
          onGenerate={handleCustomGameGenerate}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
};

export default PresetGamesPage;

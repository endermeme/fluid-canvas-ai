
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LuckyWheel from '@/components/quiz/custom-games/LuckyWheel';

const CustomGame: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen w-full bg-gradient-to-b from-background to-background/95 overflow-auto">
      <header className="bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <h1 className="text-xl font-semibold">Custom Game</h1>
      </header>

      <main className="container mx-auto p-4">
        <LuckyWheel />
      </main>
    </div>
  );
};

export default CustomGame;

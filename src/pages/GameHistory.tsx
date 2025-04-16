
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GameHistory: React.FC = () => {
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
          Back to Home
        </Button>
        
        <h1 className="text-xl font-semibold">Game History</h1>
        
        <div className="w-24"></div>
      </header>

      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Your Game History</h2>
          <p className="text-muted-foreground">Your game history will be displayed here.</p>
        </div>
      </main>
    </div>
  );
};

export default GameHistory;

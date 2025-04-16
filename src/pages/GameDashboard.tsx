
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GameDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="h-screen w-full bg-gradient-to-b from-background to-background/95 overflow-auto">
      <header className="bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-xl font-semibold">Game Dashboard</h1>
        
        <div className="w-24"></div>
      </header>

      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Game #{id}</h2>
          <p className="text-muted-foreground">Dashboard content will be displayed here.</p>
        </div>
      </main>
    </div>
  );
};

export default GameDashboard;

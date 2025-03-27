
import React from 'react';
import CanvasContainer from '@/components/canvas/CanvasContainer';
import { Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border glass-morphism z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-light tracking-tight flex items-center">
            <span className="text-primary font-medium mr-1">CES</span>
            <span>GLOBE</span>
            <span className="ml-2 text-xs px-2 py-0.5 bg-primary/10 rounded-full text-primary flex items-center">
              <Sparkles size={10} className="mr-1" />
              Canvas
            </span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center">
            <span className="text-white text-xs">JD</span>
          </div>
          <span className="text-sm font-medium">John Doe</span>
          <div className="text-xs px-1.5 py-0.5 bg-secondary rounded-full flex items-center animate-pulse-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
            Online
          </div>
        </div>
      </header>
      
      {/* Main canvas area */}
      <main className="flex-1 overflow-hidden">
        <CanvasContainer />
      </main>
    </div>
  );
};

export default Index;

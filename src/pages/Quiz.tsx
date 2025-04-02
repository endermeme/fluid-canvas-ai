
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import QuickGameSelector from '@/components/quiz/QuickGameSelector';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { GameSettingsData } from '@/components/quiz/types';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const quizRef = useRef<{ generateQuiz: (topic: string, settings?: GameSettingsData) => void }>(null);
  const topic = searchParams.get('topic');
  const autostart = searchParams.get('autostart') === 'true';
  
  useEffect(() => {
    if (topic && autostart) {
      setSelectedGame(topic);
      
      // Give time for the component to mount and ref to be available
      const timer = setTimeout(() => {
        if (quizRef.current) {
          quizRef.current.generateQuiz(topic);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [topic, autostart]);
  
  const handleBackToMenu = () => {
    setSelectedGame(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex items-center border-b border-border/40 p-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mr-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Canvas
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Minigame Giáo Dục</h1>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {selectedGame ? (
          <div className="flex-1 h-full relative">
            <QuizGenerator topic={selectedGame} ref={quizRef} />
            <div className="absolute bottom-4 left-4">
              <Button
                onClick={handleBackToMenu}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm shadow-md transition-transform active:scale-95"
              >
                Quay Lại Menu
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <QuickGameSelector onGameSelect={setSelectedGame} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

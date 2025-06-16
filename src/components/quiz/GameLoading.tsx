
import React, { useState, useEffect } from 'react';
import SolarSystemSpinner from './components/SolarSystemSpinner';
import LoadingStepIndicator, { steps } from './components/LoadingStepIndicator';
import ProgressSection from './components/ProgressSection';
import FloatingElements from './components/FloatingElements';
import FunFactsSection from './components/FunFactsSection';

interface GameLoadingProps {
  topic: string;
  progress?: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic, progress: externalProgress }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
      
      // Update current step based on progress
      const stepIndex = Math.floor((externalProgress / 100) * steps.length);
      setCurrentStep(Math.min(stepIndex, steps.length - 1));
      return;
    }
    
    // Simulate realistic progress if no external progress
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 95) {
          clearInterval(timer);
          setCurrentStep(steps.length - 1);
          return prevProgress;
        }
        
        const increment = Math.random() * 8 + 2; // 2-10% increments
        const newProgress = Math.min(prevProgress + increment, 95);
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        return newProgress;
      });
    }, 600);
    
    return () => clearInterval(timer);
  }, [externalProgress]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-background via-primary/5 to-secondary/10 transition-all duration-1000 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <FloatingElements />

      <div className="w-full max-w-lg relative z-10">
        {/* Main content card */}
        <div className="bg-card/90 backdrop-blur-lg rounded-2xl p-8 border border-border/50 shadow-2xl animate-scale-in">
          {/* Header with solar system */}
          <div className="text-center mb-8">
            <SolarSystemSpinner />
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Đang tạo minigame
            </h2>
            <p className="text-muted-foreground text-sm">
              Vui lòng chờ trong giây lát...
            </p>
          </div>

          {/* Current step indicator */}
          <LoadingStepIndicator currentStep={currentStep} />

          {/* Progress section */}
          <ProgressSection progress={progress} currentStep={currentStep} />

          {/* Fun facts */}
          <FunFactsSection progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default GameLoading;

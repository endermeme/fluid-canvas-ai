
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { steps } from './LoadingStepIndicator';

interface ProgressSectionProps {
  progress: number;
  currentStep: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ progress, currentStep }) => {
  return (
    <>
      {/* Progress bar with enhanced styling */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-muted-foreground">Tiến độ tổng thể</span>
          <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-4 shadow-lg"
          indicatorColor="bg-gradient-to-r from-primary via-primary/90 to-primary/80"
        />
        {progress > 80 && (
          <div className="text-center mt-2">
            <span className="text-xs text-primary font-medium animate-pulse">Sắp hoàn thành...</span>
          </div>
        )}
      </div>

      {/* Steps overview */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div
              key={index}
              className={`text-center p-2 rounded-lg transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-500/20 text-green-600' 
                  : isCurrent 
                  ? `${step.bgColor} ${step.color} scale-110` 
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              <StepIcon className={`h-4 w-4 mx-auto mb-1 ${isCurrent ? 'animate-pulse' : ''}`} />
              <div className="text-xs font-medium truncate">{step.title}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProgressSection;

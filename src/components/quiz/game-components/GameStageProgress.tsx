
import React from 'react';
import { motion } from 'framer-motion';
import { Atom, FlaskConical, Microscope, TestTube, Telescope, Radiation, Calculator, Beaker, Dna, Code } from 'lucide-react';

interface GameStageProgressProps {
  currentStage: number;
  stages: string[];
}

const GameStageProgress: React.FC<GameStageProgressProps> = ({ currentStage, stages }) => {
  // Science icons for each stage
  const stageIcons = [
    Atom,
    FlaskConical, 
    Microscope,
    TestTube,
    Code
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Stage indicators */}
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted/30 -translate-y-1/2" />
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-500 -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        {stages.map((stage, index) => {
          const Icon = stageIcons[index] || Atom;
          const isActive = index <= currentStage;
          const isCurrent = index === currentStage;
          
          return (
            <motion.div
              key={index}
              className="relative z-10"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: isCurrent ? 1.2 : isActive ? 1 : 0.8,
                opacity: isActive ? 1 : 0.4
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500
                ${isActive 
                  ? 'bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/50 dark:to-sky-900/50 border-blue-500/50' 
                  : 'bg-muted/20 border-muted/30'
                }
                ${isCurrent ? 'shadow-lg shadow-blue-500/25' : ''}
              `}>
                <motion.div
                  animate={{ 
                    rotate: isCurrent ? [0, 360] : 0,
                    scale: isCurrent ? [1, 1.1, 1] : 1
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Icon className={`w-7 h-7 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Current stage description */}
      <motion.div 
        className="text-center"
        key={currentStage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm font-medium text-primary/80">
          {stages[currentStage]}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Giai đoạn {currentStage + 1} / {stages.length}
        </p>
      </motion.div>
    </div>
  );
};

export default GameStageProgress;

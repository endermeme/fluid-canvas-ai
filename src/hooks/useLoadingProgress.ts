
import { useState, useEffect, useCallback, useRef } from 'react';

interface LoadingProgressProps {
  stages: string[];
  stageDuration?: number;
  finalStageDelay?: number;
  predictiveMode?: boolean; // Cho phép progress tự động chạy
}

export const useLoadingProgress = ({
  stages,
  stageDuration = 1000,
  finalStageDelay = 500,
  predictiveMode = false
}: LoadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [statusText, setStatusText] = useState(stages[0] || '');
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetProgress = useCallback(() => {
    setProgress(0);
    setCurrentStage(0);
    setStatusText(stages[0] || '');
    setIsRunning(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current);
      stageTimeoutRef.current = null;
    }
  }, [stages]);

  const startProgress = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setCurrentStage(0);
    setStatusText(stages[0] || '');

    if (predictiveMode) {
      // Chế độ dự đoán: tự động chạy qua các giai đoạn
      let currentStageIndex = 0;
      const totalStages = stages.length;
      
      const advanceStage = () => {
        if (currentStageIndex < totalStages - 1) {
          currentStageIndex++;
          setCurrentStage(currentStageIndex);
          setStatusText(stages[currentStageIndex]);
          
          // Tính progress dựa trên stage hiện tại
          const newProgress = Math.min((currentStageIndex / (totalStages - 1)) * 100, 95);
          setProgress(newProgress);
          
          // Lên lịch cho stage tiếp theo
          stageTimeoutRef.current = setTimeout(advanceStage, stageDuration);
        } else {
          // Giai đoạn cuối - giữ ở 95% cho đến khi được hoàn thành từ bên ngoài
          setProgress(95);
        }
      };
      
      // Bắt đầu từ stage đầu tiên
      stageTimeoutRef.current = setTimeout(advanceStage, stageDuration);
    } else {
      // Chế độ thông thường: từng bước một
      const progressPerStage = 100 / stages.length;
      let completedStages = 0;

      const updateProgress = () => {
        if (completedStages < stages.length) {
          const newProgress = Math.min((completedStages + 1) * progressPerStage, 100);
          setProgress(newProgress);
          setCurrentStage(completedStages);
          setStatusText(stages[completedStages]);
          
          completedStages++;
          
          if (completedStages < stages.length) {
            stageTimeoutRef.current = setTimeout(updateProgress, stageDuration);
          }
        }
      };

      updateProgress();
    }
  }, [stages, stageDuration, isRunning, predictiveMode]);

  const completeProgress = useCallback(() => {
    // Hoàn thành progress - chuyển về 100%
    setProgress(100);
    setCurrentStage(stages.length - 1);
    setStatusText(stages[stages.length - 1] || '');
    
    // Dọn dẹp timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current);
      stageTimeoutRef.current = null;
    }
    
    setTimeout(() => {
      setIsRunning(false);
    }, finalStageDelay);
  }, [stages, finalStageDelay]);

  const forceProgress = useCallback((targetProgress: number, stage?: number) => {
    // Ép progress về một giá trị cụ thể (cho external control)
    const clampedProgress = Math.min(Math.max(targetProgress, 0), 100);
    setProgress(clampedProgress);
    
    if (stage !== undefined && stage >= 0 && stage < stages.length) {
      setCurrentStage(stage);
      setStatusText(stages[stage]);
    }
  }, [stages]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current);
      }
    };
  }, []);

  return {
    progress,
    statusText,
    currentStage,
    isRunning,
    startProgress,
    resetProgress,
    completeProgress,
    forceProgress
  };
};


import { useState, useEffect, useCallback } from 'react';

interface UseLoadingProgressOptions {
  stages?: string[];
  stageDuration?: number;
  finalStageDelay?: number;
}

export const useLoadingProgress = (options: UseLoadingProgressOptions = {}) => {
  const {
    stages = [
      'Đang phân tích chủ đề...',
      'Đang thiết kế câu hỏi và nội dung...',
      'Đang tạo giao diện trò chơi...',
      'Đang tối ưu hóa trải nghiệm người chơi...',
      'Hoàn thiện trò chơi...'
    ],
    stageDuration = 800,
    finalStageDelay = 400
  } = options;

  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [statusText, setStatusText] = useState(stages[0]);

  const startProgress = useCallback(() => {
    setProgress(0);
    setCurrentStage(0);
    setStatusText(stages[0]);

    const stageProgress = 100 / stages.length;
    let currentProgress = 0;
    let stageIndex = 0;

    const updateProgress = () => {
      if (stageIndex < stages.length) {
        setStatusText(stages[stageIndex]);
        setCurrentStage(stageIndex);

        // Animate progress for current stage
        const targetProgress = Math.min((stageIndex + 1) * stageProgress, 95);
        const progressStep = (targetProgress - currentProgress) / 10;

        const progressInterval = setInterval(() => {
          currentProgress += progressStep;
          if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(progressInterval);
            
            stageIndex++;
            if (stageIndex < stages.length) {
              setTimeout(updateProgress, stageDuration);
            } else {
              // Final stage - reach 100%
              setTimeout(() => {
                const finalInterval = setInterval(() => {
                  currentProgress += 1;
                  if (currentProgress >= 100) {
                    currentProgress = 100;
                    clearInterval(finalInterval);
                  }
                  setProgress(Math.min(currentProgress, 100));
                }, 50);
              }, finalStageDelay);
            }
          }
          setProgress(Math.min(currentProgress, 100));
        }, 100);
      }
    };

    updateProgress();
  }, [stages, stageDuration, finalStageDelay]);

  const resetProgress = useCallback(() => {
    setProgress(0);
    setCurrentStage(0);
    setStatusText(stages[0]);
  }, [stages]);

  return {
    progress: Math.min(Math.max(progress, 0), 100), // Ensure progress is between 0-100
    statusText,
    currentStage,
    startProgress,
    resetProgress
  };
};

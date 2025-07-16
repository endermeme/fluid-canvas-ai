import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, GameSettingsData } from '../types';

interface UseEnhancedTimerProps {
  settings: GameSettingsData;
  totalQuestions: number;
  onTimeUp?: () => void;
  onTimeUpdate?: (timeLeft: number) => void;
}

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  currentStreak: number;
  bonusTimeEarned: number;
  penaltyTimeDeducted: number;
}

export const useEnhancedTimer = ({
  settings,
  totalQuestions,
  onTimeUp,
  onTimeUpdate
}: UseEnhancedTimerProps) => {
  const [state, setState] = useState<TimerState>({
    timeLeft: settings.timePerQuestion || 30,
    isRunning: false,
    isPaused: false,
    currentStreak: 0,
    bonusTimeEarned: 0,
    penaltyTimeDeducted: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestionRef = useRef(0);

  // Calculate progressive time based on question number
  const getProgressiveTime = useCallback((questionIndex: number) => {
    const baseTime = settings.timePerQuestion || 30;
    const reductionFactor = 0.1; // 10% reduction per question
    const minTime = Math.max(5, baseTime * 0.3); // Minimum 30% of base time or 5 seconds
    
    return Math.max(minTime, baseTime - (questionIndex * baseTime * reductionFactor));
  }, [settings.timePerQuestion]);

  // Get initial time based on timer mode
  const getInitialTime = useCallback((questionIndex: number = 0) => {
    const baseTime = settings.timePerQuestion || 30;
    
    switch (settings.timerMode) {
      case 'progressive':
        return getProgressiveTime(questionIndex);
      case 'rush':
        return Math.max(5, baseTime * 0.5); // 50% of normal time
      case 'relaxed':
        return baseTime * 1.5; // 150% of normal time
      default:
        return baseTime;
    }
  }, [settings.timerMode, settings.timePerQuestion, getProgressiveTime]);

  // Start timer
  const startTimer = useCallback((questionIndex: number = 0) => {
    const initialTime = getInitialTime(questionIndex);
    currentQuestionRef.current = questionIndex;
    
    setState(prev => ({
      ...prev,
      timeLeft: initialTime,
      isRunning: true,
      isPaused: false
    }));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        
        onTimeUpdate?.(newTimeLeft);
        
        if (newTimeLeft <= 0) {
          onTimeUp?.();
          return {
            ...prev,
            timeLeft: 0,
            isRunning: false
          };
        }
        
        return {
          ...prev,
          timeLeft: newTimeLeft
        };
      });
    }, 1000);
  }, [getInitialTime, onTimeUp, onTimeUpdate]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false
    }));
  }, []);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true
    }));
  }, []);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (!state.isPaused) return;

    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false
    }));

    intervalRef.current = setInterval(() => {
      setState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        
        onTimeUpdate?.(newTimeLeft);
        
        if (newTimeLeft <= 0) {
          onTimeUp?.();
          return {
            ...prev,
            timeLeft: 0,
            isRunning: false
          };
        }
        
        return {
          ...prev,
          timeLeft: newTimeLeft
        };
      });
    }, 1000);
  }, [state.isPaused, onTimeUp, onTimeUpdate]);

  // Add bonus time for correct answers
  const addBonusTime = useCallback((isCorrect: boolean, responseTime: number) => {
    if (!settings.performanceBonus && !settings.speedBonus) return;

    setState(prev => {
      let bonusTime = 0;
      let newStreak = isCorrect ? prev.currentStreak + 1 : 0;

      // Performance bonus for streaks
      if (isCorrect && settings.performanceBonus && newStreak >= 3) {
        bonusTime += 5; // +5 seconds for 3+ streak
      }

      // Speed bonus for quick answers
      if (isCorrect && settings.speedBonus) {
        const totalTime = getInitialTime(currentQuestionRef.current);
        const timeUsed = totalTime - prev.timeLeft;
        if (timeUsed <= totalTime * 0.3) { // Answered in first 30% of time
          bonusTime += 3; // +3 seconds for quick answers
        }
      }

      return {
        ...prev,
        timeLeft: prev.timeLeft + bonusTime,
        currentStreak: newStreak,
        bonusTimeEarned: prev.bonusTimeEarned + bonusTime
      };
    });
  }, [settings.performanceBonus, settings.speedBonus, getInitialTime]);

  // Deduct time for wrong answers
  const deductPenaltyTime = useCallback(() => {
    if (!settings.timePenalty) return;

    setState(prev => ({
      ...prev,
      timeLeft: Math.max(1, prev.timeLeft - 3), // -3 seconds, minimum 1 second
      currentStreak: 0,
      penaltyTimeDeducted: prev.penaltyTimeDeducted + 3
    }));
  }, [settings.timePenalty]);

  // Reset timer for next question
  const resetForNextQuestion = useCallback((questionIndex: number) => {
    stopTimer();
    startTimer(questionIndex);
  }, [startTimer, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft: state.timeLeft,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    currentStreak: state.currentStreak,
    bonusTimeEarned: state.bonusTimeEarned,
    penaltyTimeDeducted: state.penaltyTimeDeducted,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    addBonusTime,
    deductPenaltyTime,
    resetForNextQuestion
  };
};
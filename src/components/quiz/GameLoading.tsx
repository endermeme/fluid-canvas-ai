
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Crown, Brain, Zap, Star, Gamepad2, Wand2, Rocket } from 'lucide-react';

interface GameLoadingProps {
  topic: string;
  progress?: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic, progress: externalProgress }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);
  
  const steps = [
    { 
      icon: Brain, 
      title: 'Phân tích chủ đề', 
      description: 'Đang hiểu và phân tích nội dung học tập...',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      icon: Wand2, 
      title: 'Thiết kế câu hỏi', 
      description: 'Đang tạo ra các câu hỏi thú vị và phù hợp...',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    { 
      icon: Gamepad2, 
      title: 'Xây dựng giao diện', 
      description: 'Đang thiết kế trải nghiệm game tương tác...',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      icon: Zap, 
      title: 'Tối ưu hóa', 
      description: 'Đang điều chỉnh độ khó và cân bằng game...',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      icon: Rocket, 
      title: 'Hoàn thiện', 
      description: 'Đang chuẩn bị để khởi chạy trò chơi...',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];
  
  const floatingIcons = [Sparkles, Crown, Star, Gamepad2, Wand2];
  
  useEffect(() => {
    // Icon rotation effect for floating icons
    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % floatingIcons.length);
    }, 2000);
    
    return () => clearInterval(iconInterval);
  }, []);
  
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

  const currentStepData = steps[currentStep];
  const CurrentStepIcon = currentStepData?.icon || Brain;
  const FloatingIcon = floatingIcons[currentIcon];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-background via-primary/5 to-secondary/10 transition-all duration-1000 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating icons */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce-subtle opacity-20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          >
            <FloatingIcon className="h-8 w-8 text-primary/30" />
          </div>
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse-soft" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Main content card */}
        <div className="bg-card/90 backdrop-blur-lg rounded-2xl p-8 border border-border/50 shadow-2xl animate-scale-in">
          {/* Header with enhanced spinner */}
          <div className="text-center mb-8">
            <div className="relative mb-6 flex items-center justify-center">
              {/* Multi-layered spinner design */}
              <div className="relative w-20 h-20">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                
                {/* Spinning outer ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                
                {/* Middle ring */}
                <div className="absolute inset-2 border-3 border-secondary/30 rounded-full"></div>
                
                {/* Spinning middle ring (reverse direction) */}
                <div 
                  className="absolute inset-2 border-3 border-transparent border-r-secondary rounded-full animate-spin"
                  style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                ></div>
                
                {/* Inner ring */}
                <div className="absolute inset-4 border-2 border-accent/40 rounded-full"></div>
                
                {/* Spinning inner ring */}
                <div 
                  className="absolute inset-4 border-2 border-transparent border-b-accent rounded-full animate-spin"
                  style={{ animationDuration: '0.8s' }}
                ></div>
                
                {/* Center core with pulsing effect */}
                <div className="absolute inset-6 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse-soft flex items-center justify-center">
                  <div className="w-2 h-2 bg-background rounded-full animate-pulse"></div>
                </div>
                
                {/* Orbital dots */}
                <div className="absolute inset-0">
                  <div 
                    className="absolute w-2 h-2 bg-primary rounded-full animate-spin"
                    style={{ 
                      top: '-4px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      animationDuration: '2s'
                    }}
                  ></div>
                  <div 
                    className="absolute w-2 h-2 bg-secondary rounded-full animate-spin"
                    style={{ 
                      bottom: '-4px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      animationDuration: '2s',
                      animationDirection: 'reverse'
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Pulsing rings around spinner */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-2 rounded-full border border-secondary/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Đang tạo minigame
            </h2>
            <p className="text-muted-foreground text-sm">
              Vui lòng chờ trong giây lát...
            </p>
          </div>

          {/* Current step indicator */}
          <div className="mb-6">
            <div className={`flex items-center p-4 rounded-xl border transition-all duration-500 ${currentStepData?.bgColor} border-current/20`}>
              <div className={`p-3 rounded-lg bg-gradient-to-r from-current/20 to-current/10 mr-4 ${currentStepData?.color}`}>
                <CurrentStepIcon className={`h-6 w-6 ${currentStepData?.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{currentStepData?.title}</h3>
                <p className="text-sm text-muted-foreground">{currentStepData?.description}</p>
              </div>
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current opacity-70" />
              </div>
            </div>
          </div>

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

          {/* Fun facts or tips */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-foreground">Bạn có biết?</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {progress < 25 && "Trò chơi học tập giúp tăng khả năng ghi nhớ lên đến 75%!"}
              {progress >= 25 && progress < 50 && "Học thông qua game giúp não bộ tiết ra dopamine, tạo cảm giác vui vẻ!"}
              {progress >= 50 && progress < 75 && "Phương pháp học tương tác giúp cải thiện khả năng tập trung đáng kể!"}
              {progress >= 75 && "Bạn sắp trải nghiệm một trò chơi học tập tuyệt vời rồi!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoading;

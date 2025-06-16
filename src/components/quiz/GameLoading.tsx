
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
          {/* Header with 7-planet solar system */}
          <div className="text-center mb-8">
            <div className="relative mb-6 flex items-center justify-center">
              {/* 7-Planet Solar System Spinner */}
              <div className="relative w-64 h-64">
                {/* Orbit rings - 7 different sizes */}
                <div className="absolute inset-0 border border-primary/15 rounded-full"></div>
                <div className="absolute inset-4 border border-secondary/20 rounded-full"></div>
                <div className="absolute inset-8 border border-accent/25 rounded-full"></div>
                <div className="absolute inset-12 border border-yellow-400/20 rounded-full"></div>
                <div className="absolute inset-16 border border-green-400/25 rounded-full"></div>
                <div className="absolute inset-20 border border-red-400/20 rounded-full"></div>
                <div className="absolute inset-24 border border-purple-400/25 rounded-full"></div>
                
                {/* Center brain "sun" */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-primary via-secondary to-primary rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                  <Brain className="h-8 w-8 text-white animate-pulse" />
                </div>
                
                {/* Planet 1 - Mercury (closest, fastest) */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-2 -translate-y-2 animate-spin" style={{ animation: 'spin 2s linear infinite' }}>
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -32px)' }}></div>
                </div>
                
                {/* Planet 2 - Venus */}
                <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-2.5 -translate-y-2.5 animate-spin" style={{ animation: 'spin 3s linear infinite reverse' }}>
                  <div className="w-5 h-5 bg-gradient-to-r from-orange-300 to-yellow-400 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -48px)' }}></div>
                </div>
                
                {/* Planet 3 - Earth */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-3 -translate-y-3 animate-spin" style={{ animation: 'spin 4s linear infinite' }}>
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-green-400 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -64px)' }}></div>
                </div>
                
                {/* Planet 4 - Mars */}
                <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-2.5 -translate-y-2.5 animate-spin" style={{ animation: 'spin 5s linear infinite reverse' }}>
                  <div className="w-5 h-5 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -80px)' }}></div>
                </div>
                
                {/* Planet 5 - Jupiter */}
                <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-4 -translate-y-4 animate-spin" style={{ animation: 'spin 6s linear infinite' }}>
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -96px)' }}></div>
                </div>
                
                {/* Planet 6 - Saturn */}
                <div className="absolute top-1/2 left-1/2 w-7 h-7 -translate-x-3.5 -translate-y-3.5 animate-spin" style={{ animation: 'spin 7s linear infinite reverse' }}>
                  <div className="w-7 h-7 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-lg border border-white/50 absolute relative" style={{ transform: 'translate(0, -112px)' }}>
                    {/* Saturn's ring */}
                    <div className="absolute inset-0 border border-yellow-200/70 rounded-full scale-150"></div>
                  </div>
                </div>
                
                {/* Planet 7 - Neptune */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-3 -translate-y-3 animate-spin" style={{ animation: 'spin 8s linear infinite' }}>
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -128px)' }}></div>
                </div>
                
                {/* Outer glow rings */}
                <div className="absolute inset-0 rounded-full border border-primary/5 animate-ping" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-2 rounded-full border border-secondary/5 animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                <div className="absolute inset-4 rounded-full border border-accent/5 animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }} />
              </div>
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


import React, { useEffect, useState } from 'react';

interface LoadingStep {
  id: number;
  message: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  details?: string;
}

interface GameLoadingProps {
  topic?: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic = "chủ đề" }) => {
  const [loadingText, setLoadingText] = useState("Đang tạo minigame từ chủ đề của bạn");
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { id: 1, message: "Khởi tạo mô hình AI", status: 'pending' },
    { id: 2, message: "Phân tích chủ đề", status: 'pending' },
    { id: 3, message: "Tạo minigame với Gemini API", status: 'pending' },
    { id: 4, message: "Cải thiện với GPT-4o", status: 'pending' },
    { id: 5, message: "Kiểm tra và tối ưu mã", status: 'pending' },
    { id: 6, message: "Chuẩn bị hiển thị", status: 'pending' },
  ]);
  
  const progressMessages = [
    `Đang tạo minigame về "${topic}"`,
    "Thiết kế trò chơi tương tác",
    "Chuẩn bị câu hỏi và nội dung",
    "Thiết kế giao diện trò chơi",
    "Tối ưu hóa trải nghiệm người chơi",
    "Kiểm tra logic trò chơi",
    "Đảm bảo tính tương thích",
    "Gần xong rồi..."
  ];
  
  useEffect(() => {
    // Main loading text animation
    let index = 0;
    const textInterval = setInterval(() => {
      index = (index + 1) % progressMessages.length;
      setLoadingText(progressMessages[index]);
    }, 3000);
    
    // Simulate loading steps progressing
    const simulateProgress = async () => {
      // Step 1: Initialize models
      updateStepStatus(0, 'loading');
      await simulateDelay(1000);
      updateStepStatus(0, 'completed', 'Sử dụng Gemini-Pro và GPT-4o');
      
      // Step 2: Analyze topic
      updateStepStatus(1, 'loading');
      await simulateDelay(1500);
      updateStepStatus(1, 'completed', `Chủ đề: "${topic}" - đã phân loại`);
      
      // Step 3: Generate with Gemini
      updateStepStatus(2, 'loading');
      await simulateDelay(3000);
      updateStepStatus(2, 'completed', 'Dữ liệu trò chơi đã được tạo');
      
      // Step 4: GPT-4o Enhancements
      updateStepStatus(3, 'loading');
      await simulateDelay(2500);
      updateStepStatus(3, 'completed', 'Cải thiện logic và giao diện');
      
      // Step 5: Code optimization
      updateStepStatus(4, 'loading');
      await simulateDelay(1800);
      updateStepStatus(4, 'completed', 'Tối ưu HTML/CSS/JS');
      
      // Step 6: Prepare for render
      updateStepStatus(5, 'loading');
      await simulateDelay(1000);
      updateStepStatus(5, 'completed', 'Sẵn sàng hiển thị');
    };
    
    // Start the progress simulation
    simulateProgress();
    
    // Cleanup on unmount
    return () => {
      clearInterval(textInterval);
    };
  }, [topic]);
  
  // Helper functions
  const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const updateStepStatus = (index: number, status: LoadingStep['status'], details?: string) => {
    setLoadingSteps(steps => {
      const newSteps = [...steps];
      newSteps[index] = { ...newSteps[index], status, details };
      
      // Update current active step
      if (status === 'loading') {
        setCurrentStep(index);
      } else if (status === 'completed' && index < steps.length - 1) {
        setCurrentStep(index + 1);
      }
      
      return newSteps;
    });
  };
  
  const getStatusIcon = (status: LoadingStep['status']) => {
    switch (status) {
      case 'pending': return <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>;
      case 'loading': return <div className="w-5 h-5 rounded-full border-2 border-t-primary border-primary/30 animate-spin"></div>;
      case 'completed': return <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">✓</div>;
      case 'error': return <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✗</div>;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6 fixed inset-0 overflow-hidden">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img 
            src="https://cdn.glitch.global/1eee455c-65a0-428f-a71b-89f07640b91b/Thi%E1%BA%BFt%20k%E1%BA%BF%20ch%C6%B0a%20c%C3%B3%20t%C3%AAn.svg?v=1742919732332" 
            alt="Logo" 
            className="w-8 h-8 animate-pulse"
          />
        </div>
      </div>
      
      <div className="space-y-2 text-center">
        <p className="text-lg font-medium animate-fade-in">{loadingText}...</p>
        <div className="flex justify-center">
          <div className="typing-indicator">
            <span style={{'--dot-index': '0'} as any}></span>
            <span style={{'--dot-index': '1'} as any}></span>
            <span style={{'--dot-index': '2'} as any}></span>
          </div>
        </div>
      </div>
      
      {/* Detailed Loading Steps */}
      <div className="max-w-md mt-4 bg-black/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <h3 className="text-sm font-medium mb-3 text-center">Tiến trình tạo minigame</h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
          {loadingSteps.map((step) => (
            <div key={step.id} className={`flex items-start transition-all duration-300 ${currentStep === step.id - 1 ? 'opacity-100' : 'opacity-70'}`}>
              <div className="mr-3 mt-0.5">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${step.status === 'error' ? 'text-red-400' : ''}`}>{step.message}</p>
                {step.details && (
                  <p className="text-xs text-muted-foreground mt-0.5">{step.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="max-w-md text-center mt-2 px-4">
        <p className="text-sm text-muted-foreground bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-md">
          Minigame bởi AI khi tạo ra có thể bị lỗi hoặc không hoạt động như mong muốn, vui lòng tạo lại khi gặp lỗi
        </p>
      </div>
    </div>
  );
};

export default GameLoading;

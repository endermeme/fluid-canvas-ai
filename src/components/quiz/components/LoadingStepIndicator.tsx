
import React from 'react';
import { Brain, Wand2, Gamepad2, Zap, Rocket } from 'lucide-react';

interface LoadingStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface LoadingStepIndicatorProps {
  currentStep: number;
}

const steps: LoadingStep[] = [
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

const LoadingStepIndicator: React.FC<LoadingStepIndicatorProps> = ({ currentStep }) => {
  const currentStepData = steps[currentStep] || steps[0];
  const CurrentStepIcon = currentStepData.icon;

  return (
    <div className="mb-6">
      <div className={`flex items-center p-4 rounded-xl border transition-all duration-500 ${currentStepData.bgColor} border-current/20`}>
        <div className={`p-3 rounded-lg bg-gradient-to-r from-current/20 to-current/10 mr-4 ${currentStepData.color}`}>
          <CurrentStepIcon className={`h-6 w-6 ${currentStepData.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{currentStepData.title}</h3>
          <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
        </div>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current opacity-70" />
        </div>
      </div>
    </div>
  );
};

export { steps };
export default LoadingStepIndicator;

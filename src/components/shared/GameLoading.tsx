
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

interface GameLoadingProps {
  topic?: string;
  message?: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ 
  topic = "game", 
  message 
}) => {
  const loadingSteps = [
    "Đang phân tích chủ đề...",
    "Đang tạo cơ chế game...",
    "Đang thiết kế giao diện...",
    "Đang tối ưu hóa trải nghiệm...",
    "Sắp hoàn thành..."
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <Sparkles className="h-6 w-6 text-primary/60 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-primary">
              Đang tạo game về "{topic}"
            </h3>
            <p className="text-muted-foreground">
              {message || loadingSteps[currentStep]}
            </p>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            Quá trình này có thể mất 1-2 phút...
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GameLoading;

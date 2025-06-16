
import React from 'react';
import { Sparkles } from 'lucide-react';

interface FunFactsSectionProps {
  progress: number;
}

const FunFactsSection: React.FC<FunFactsSectionProps> = ({ progress }) => {
  const getFunFact = () => {
    if (progress < 25) return "Trò chơi học tập giúp tăng khả năng ghi nhớ lên đến 75%!";
    if (progress < 50) return "Học thông qua game giúp não bộ tiết ra dopamine, tạo cảm giác vui vẻ!";
    if (progress < 75) return "Phương pháp học tương tác giúp cải thiện khả năng tập trung đáng kể!";
    return "Bạn sắp trải nghiệm một trò chơi học tập tuyệt vời rồi!";
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
      <div className="flex items-center mb-2">
        <Sparkles className="h-4 w-4 text-primary mr-2" />
        <span className="text-sm font-medium text-foreground">Bạn có biết?</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {getFunFact()}
      </p>
    </div>
  );
};

export default FunFactsSection;

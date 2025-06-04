
import React from 'react';
import { Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BalloonPopHeaderProps {
  title: string;
  score: number;
  timeLeft: number;
  poppedCount: number;
  totalCount: number;
  onShare?: () => void;
}

const BalloonPopHeader: React.FC<BalloonPopHeaderProps> = ({
  title,
  score,
  timeLeft,
  poppedCount,
  totalCount,
  onShare
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="balloon-header">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">{title}</h1>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Clock className="h-5 w-5 text-white" />
            <span className="text-white font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/90 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-white font-bold text-xl">🏆 {score} điểm</span>
          </div>
          <div className="bg-blue-500/90 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white font-semibold">
              🎈 {poppedCount}/{totalCount}
            </span>
          </div>
        </div>
      </div>

      <Progress 
        value={(poppedCount / totalCount) * 100} 
        className="mb-6 h-3 bg-white/30" 
      />

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white drop-shadow">
          🎯 Nhấp vào bóng bay để nổ và xem câu hỏi!
        </h2>
        <p className="text-white/90 drop-shadow">
          Trả lời đúng để ghi điểm. Thời gian có hạn!
        </p>
      </div>
    </div>
  );
};

export default BalloonPopHeader;

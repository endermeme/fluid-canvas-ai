
import React from 'react';
import { Card } from '@/components/ui/card';
import GameHeader from '../../../components/GameHeader';
import GameControls from '../../../components/GameControls';

interface PictionaryResultProps {
  score: number;
  totalItems: number;
  title: string;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
  onRestart: () => void;
}

const PictionaryResult: React.FC<PictionaryResultProps> = ({
  score,
  totalItems,
  title,
  topic,
  onBack,
  onShare,
  onRestart,
}) => {
  const percentage = Math.round((score / totalItems) * 100);

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80">
      <GameHeader 
        onBack={onBack}
        progress={100}
        timeLeft={0}
        score={score}
        currentItem={totalItems}
        totalItems={totalItems}
        title="Kết quả"
        onShare={onShare}
      />

      <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
          <p className="text-lg mb-4">
            Chủ đề: <span className="font-semibold">{title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Điểm của bạn</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          
          <div className="text-4xl font-bold mb-6 text-primary">
            {score} / {totalItems}
          </div>
          
          <GameControls onRestart={onRestart} />
        </div>
      </Card>
    </div>
  );
};

export default PictionaryResult;

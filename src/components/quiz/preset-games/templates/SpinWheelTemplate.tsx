
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Play, RefreshCw } from 'lucide-react';

interface SpinWheelProps {
  content: any;
  topic: string;
}

interface WheelSegment {
  id: string;
  text: string;
  color: string;
  points: number;
}

const SpinWheelTemplate: React.FC<SpinWheelProps> = ({ content, topic }) => {
  const { toast } = useToast();
  
  // Data mẫu nếu không có content
  const segments: WheelSegment[] = content?.segments || [
    { id: '1', text: 'Câu hỏi 1', color: '#FF6B6B', points: 10 },
    { id: '2', text: 'Câu hỏi 2', color: '#4ECDC4', points: 20 },
    { id: '3', text: 'Câu hỏi 3', color: '#45B7D1', points: 30 },
    { id: '4', text: 'Câu hỏi 4', color: '#96CEB4', points: 40 },
    { id: '5', text: 'Câu hỏi 5', color: '#FFEAA7', points: 50 },
    { id: '6', text: 'Câu hỏi 6', color: '#DDA0DD', points: 60 }
  ];
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegment | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const segmentAngle = 360 / segments.length;
  
  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedSegment(null);
    
    // Random spin between 3-6 full rotations plus random angle
    const spins = Math.floor(Math.random() * 4) + 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomAngle;
    
    setRotation(totalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      
      // Calculate which segment was selected
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const selected = segments[segmentIndex];
      
      setSelectedSegment(selected);
      setTotalScore(prev => prev + selected.points);
      
      toast({
        title: 'Kết quả!',
        description: `Bạn đã quay được: ${selected.text} (+${selected.points} điểm)`,
        variant: 'default',
      });
    }, 3000);
  };
  
  const resetGame = () => {
    setGameStarted(false);
    setRotation(0);
    setSelectedSegment(null);
    setTotalScore(0);
    setIsSpinning(false);
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-6 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Vòng Quay May Mắn: {topic}</h2>
          <p className="mb-6">Quay vòng để nhận điểm và thử thách</p>
          <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
            <Play className="mr-2 h-4 w-4" />
            Bắt đầu chơi
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-[500px] p-6">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Vòng Quay May Mắn: {topic}</h2>
        <div className="flex items-center gap-4">
          <span className="font-medium">Tổng điểm: {totalScore}</span>
        </div>
      </Card>
      
      <div className="flex flex-col items-center gap-6">
        {/* Wheel */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
          
          <svg
            width="300"
            height="300"
            className="transform transition-transform duration-3000 ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {segments.map((segment, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;
              const x1 = 150 + 120 * Math.cos(startAngleRad);
              const y1 = 150 + 120 * Math.sin(startAngleRad);
              const x2 = 150 + 120 * Math.cos(endAngleRad);
              const y2 = 150 + 120 * Math.sin(endAngleRad);
              
              const pathData = [
                `M 150 150`,
                `L ${x1} ${y1}`,
                `A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              const textAngle = startAngle + segmentAngle / 2;
              const textX = 150 + 80 * Math.cos((textAngle * Math.PI) / 180);
              const textY = 150 + 80 * Math.sin((textAngle * Math.PI) / 180);
              
              return (
                <g key={segment.id}>
                  <path
                    d={pathData}
                    fill={segment.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {segment.text}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Controls */}
        <div className="flex gap-4">
          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            className="bg-green-600 hover:bg-green-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {isSpinning ? 'Đang quay...' : 'Quay vòng'}
          </Button>
          
          <Button onClick={resetGame} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </div>
        
        {/* Result */}
        {selectedSegment && (
          <Card className="p-4 text-center">
            <h3 className="text-lg font-bold mb-2">Kết quả:</h3>
            <p className="text-xl" style={{ color: selectedSegment.color }}>
              {selectedSegment.text}
            </p>
            <p className="text-lg font-medium">+{selectedSegment.points} điểm</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SpinWheelTemplate;

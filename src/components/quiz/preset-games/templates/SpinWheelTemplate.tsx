
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Play, RefreshCw, Trophy, Target } from 'lucide-react';

interface SpinWheelProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface WheelSegment {
  id: string;
  text: string;
  color: string;
  points: number;
}

const SpinWheelTemplate: React.FC<SpinWheelProps> = ({ content, topic, onBack }) => {
  const { toast } = useToast();
  
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
  const [spinsCount, setSpinsCount] = useState(0);
  
  const segmentAngle = 360 / segments.length;
  
  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedSegment(null);
    
    const spins = Math.floor(Math.random() * 4) + 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomAngle;
    
    setRotation(totalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const selected = segments[segmentIndex];
      
      setSelectedSegment(selected);
      setTotalScore(prev => prev + selected.points);
      setSpinsCount(prev => prev + 1);
      
      toast({
        title: '🎯 Kết quả!',
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
    setSpinsCount(0);
    setIsSpinning(false);
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <div className="mb-8">
              <RotateCcw className="h-24 w-24 text-orange-500 mx-auto mb-6 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Vòng Quay May Mắn
            </h2>
            <p className="text-xl text-gray-700 mb-2 font-medium">🎯 Chủ đề: {topic}</p>
            <p className="text-gray-600 mb-8 text-lg">Quay vòng để nhận điểm và thử thách</p>
            
            <div className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Target className="h-6 w-6 text-orange-500" />
                  <span className="font-medium text-gray-700">{segments.length} phần thưởng</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="font-medium text-gray-700">Không giới hạn lượt quay</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white text-xl font-bold py-6 rounded-2xl"
            >
              🎮 Bắt đầu chơi
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl flex-shrink-0">
          <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Vòng Quay May Mắn
              </h2>
              <p className="text-gray-600 text-lg font-medium">{topic}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="font-bold text-yellow-700 text-xl">{totalScore} điểm</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                <Target className="h-6 w-6 text-blue-500" />
                <span className="font-bold text-blue-700 text-xl">{spinsCount} lượt</span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {/* Wheel */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
            </div>
            
            <div className="relative">
              <svg
                width="400"
                height="400"
                className="drop-shadow-2xl"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
                }}
              >
                {segments.map((segment, index) => {
                  const startAngle = index * segmentAngle;
                  const endAngle = (index + 1) * segmentAngle;
                  const startAngleRad = (startAngle * Math.PI) / 180;
                  const endAngleRad = (endAngle * Math.PI) / 180;
                  
                  const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                  const x1 = 200 + 180 * Math.cos(startAngleRad);
                  const y1 = 200 + 180 * Math.sin(startAngleRad);
                  const x2 = 200 + 180 * Math.cos(endAngleRad);
                  const y2 = 200 + 180 * Math.sin(endAngleRad);
                  
                  const pathData = [
                    `M 200 200`,
                    `L ${x1} ${y1}`,
                    `A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');
                  
                  const textAngle = startAngle + segmentAngle / 2;
                  const textX = 200 + 120 * Math.cos((textAngle * Math.PI) / 180);
                  const textY = 200 + 120 * Math.sin((textAngle * Math.PI) / 180);
                  
                  return (
                    <g key={segment.id}>
                      <path
                        d={pathData}
                        fill={segment.color}
                        stroke="#fff"
                        strokeWidth="3"
                        filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.1))"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                        filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.3))"
                      >
                        {segment.text}
                      </text>
                      <text
                        x={textX}
                        y={textY + 20}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        transform={`rotate(${textAngle}, ${textX}, ${textY + 20})`}
                        filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.3))"
                      >
                        {segment.points}đ
                      </text>
                    </g>
                  );
                })}
                <circle cx="200" cy="200" r="20" fill="#333" />
              </svg>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex gap-6">
            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="mr-3 h-6 w-6" />
              {isSpinning ? 'Đang quay...' : 'Quay vòng'}
            </Button>
            
            <Button 
              onClick={resetGame} 
              variant="outline"
              className="border-2 border-gray-300 hover:border-gray-400 px-6 py-4 text-lg font-semibold rounded-2xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Chơi lại
            </Button>
            
            {onBack && (
              <Button 
                onClick={onBack} 
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-6 py-4 text-lg font-semibold rounded-2xl"
              >
                Quay lại
              </Button>
            )}
          </div>
          
          {/* Result */}
          {selectedSegment && (
            <Card className="p-6 text-center bg-white/95 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl animate-fade-in">
              <h3 className="text-xl font-bold mb-3 text-gray-800">🎉 Kết quả lần quay:</h3>
              <div 
                className="text-2xl font-bold mb-2 px-4 py-2 rounded-xl inline-block text-white"
                style={{ backgroundColor: selectedSegment.color }}
              >
                {selectedSegment.text}
              </div>
              <p className="text-lg font-medium text-green-600">+{selectedSegment.points} điểm</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheelTemplate;

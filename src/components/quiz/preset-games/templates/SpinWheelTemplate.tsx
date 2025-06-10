
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  RefreshCw, 
  Zap,
  Star,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

interface SpinWheelProps {
  data: any;
  onBack: () => void;
  topic: string;
  content: any;
}

interface Segment {
  id: string;
  text: string;
  color: string;
  points: number;
}

const SpinWheelTemplate: React.FC<SpinWheelProps> = ({ data, onBack, topic }) => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(10);
  const [lastWin, setLastWin] = useState<Segment | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [spinHistory, setSpinHistory] = useState<Segment[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (data && data.segments) {
      setSegments(data.segments);
      setSpinsLeft(data.settings?.maxSpins || 10);
    }
  }, [data]);

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🎯 Game bắt đầu!",
      description: "Quay vòng quay để nhận điểm thưởng!",
    });
  };

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    const randomRotation = Math.random() * 360 + 1440; // At least 4 full rotations
    const newRotation = currentRotation + randomRotation;
    setCurrentRotation(newRotation);

    // Calculate which segment the wheel lands on
    const segmentAngle = 360 / segments.length;
    const normalizedAngle = (360 - (newRotation % 360)) % 360;
    const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
    const winningSegment = segments[segmentIndex];

    setTimeout(() => {
      setIsSpinning(false);
      setLastWin(winningSegment);
      setTotalScore(prev => prev + winningSegment.points);
      setSpinsLeft(prev => prev - 1);
      setSpinHistory(prev => [...prev, winningSegment]);

      toast({
        title: `🎊 Chúc mừng!`,
        description: `Bạn được: ${winningSegment.text} (+${winningSegment.points} điểm)`,
      });
    }, 3000);
  };

  const resetGame = () => {
    setCurrentRotation(0);
    setTotalScore(0);
    setSpinsLeft(data.settings?.maxSpins || 10);
    setLastWin(null);
    setGameStarted(false);
    setSpinHistory([]);
    setIsSpinning(false);
  };

  const getSegmentPath = (index: number, total: number) => {
    const angle = 360 / total;
    const startAngle = (index * angle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180);
    
    const x1 = 150 + 140 * Math.cos(startAngle);
    const y1 = 150 + 140 * Math.sin(startAngle);
    const x2 = 150 + 140 * Math.cos(endAngle);
    const y2 = 150 + 140 * Math.sin(endAngle);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number, total: number) => {
    const angle = 360 / total;
    const textAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180);
    const x = 150 + 100 * Math.cos(textAngle);
    const y = 150 + 100 * Math.sin(textAngle);
    return { x, y, angle: (index * angle + angle / 2) };
  };

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Đang tải game...</h3>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Card className="m-4 p-4 bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                onClick={onBack}
                variant="ghost"
                className="mr-4 text-orange-700 hover:bg-orange-100"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl mr-4">
                <RotateCcw className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
                <p className="text-gray-600">
                  <span className="font-medium">{topic}</span> • 
                  <span className="ml-2 text-orange-600">{segments.length} segments</span>
                </p>
              </div>
            </div>
            
            {gameStarted && (
              <div className="flex items-center gap-4 text-lg font-medium">
                <div className="flex items-center text-orange-600">
                  <Zap className="mr-2 h-5 w-5" />
                  {spinsLeft} lượt
                </div>
                <div className="flex items-center text-red-600">
                  <Star className="mr-2 h-5 w-5" />
                  {totalScore} điểm
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Game Content */}
        <div className="flex-1 p-4">
          {!gameStarted ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <RotateCcw className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Vòng Quay May Mắn</h3>
                  <p className="text-gray-600 mb-6">
                    Quay vòng quay để nhận điểm thưởng! Bạn có {spinsLeft} lượt quay.
                  </p>
                  <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    Bắt Đầu Game
                  </Button>
                </div>
              </Card>
            </div>
          ) : spinsLeft === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Game kết thúc! Tổng điểm: {totalScore}
                  </h3>
                  <p className="text-gray-600">
                    Bạn đã sử dụng hết {data.settings?.maxSpins || 10} lượt quay
                  </p>
                </div>

                <div className="max-h-40 overflow-y-auto mb-6">
                  <h4 className="font-semibold mb-3 text-gray-700">Lịch sử quay:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {spinHistory.map((spin, index) => (
                      <div key={index} className="p-2 rounded-lg border text-center text-sm" style={{ backgroundColor: spin.color + '20', borderColor: spin.color }}>
                        <div className="font-medium">{spin.text}</div>
                        <div className="text-xs text-gray-600">+{spin.points} điểm</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetGame} variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Chơi lại
                  </Button>
                  <Button onClick={onBack} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    Kết thúc
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Wheel */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
                  <div className="relative">
                    {/* Wheel SVG */}
                    <div 
                      ref={wheelRef}
                      className="relative transition-transform duration-[3000ms] ease-out"
                      style={{ transform: `rotate(${currentRotation}deg)` }}
                    >
                      <svg width="300" height="300" className="drop-shadow-lg">
                        {segments.map((segment, index) => (
                          <g key={segment.id}>
                            <path
                              d={getSegmentPath(index, segments.length)}
                              fill={segment.color}
                              stroke="#fff"
                              strokeWidth="2"
                            />
                            {(() => {
                              const pos = getTextPosition(index, segments.length);
                              return (
                                <text
                                  x={pos.x}
                                  y={pos.y}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fill="white"
                                  fontSize="11"
                                  fontWeight="bold"
                                  transform={`rotate(${pos.angle > 90 && pos.angle < 270 ? pos.angle + 180 : pos.angle}, ${pos.x}, ${pos.y})`}
                                >
                                  {segment.text}
                                </text>
                              );
                            })()}
                          </g>
                        ))}
                      </svg>
                    </div>
                    
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-red-600 drop-shadow-lg"></div>
                    </div>
                    
                    {/* Center button */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Button
                        onClick={spinWheel}
                        disabled={isSpinning || spinsLeft <= 0}
                        className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
                      >
                        {isSpinning ? (
                          <RotateCcw className="h-6 w-6 animate-spin" />
                        ) : (
                          <Zap className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Stats Panel */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Star className="mr-2 h-6 w-6 text-orange-600" />
                  Thống kê
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-orange-700">{totalScore}</div>
                    <div className="text-sm text-orange-600">Tổng điểm</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-700">{spinsLeft}</div>
                    <div className="text-sm text-blue-600">Lượt còn lại</div>
                  </div>
                  
                  {lastWin && (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl">
                      <div className="text-sm text-green-600 mb-1">Lần quay gần nhất:</div>
                      <div className="font-bold text-green-700">{lastWin.text}</div>
                      <div className="text-sm text-green-600">+{lastWin.points} điểm</div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Các phần thưởng:</h4>
                  <div className="space-y-2">
                    {segments.map((segment) => (
                      <div key={segment.id} className="flex items-center justify-between p-2 rounded border-l-4" style={{ borderColor: segment.color }}>
                        <span className="text-sm font-medium">{segment.text}</span>
                        <span className="text-sm text-gray-600">{segment.points} điểm</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheelTemplate;

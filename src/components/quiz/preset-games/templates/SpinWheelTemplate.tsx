import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, ThumbsUp, ArrowRight } from 'lucide-react';

interface SpinWheelProps {
  content: any;
  topic: string;
}

interface WheelItem {
  id: string;
  text: string;
  color: string;
  // Các thông tin bổ sung nếu có
  details?: string;
  points?: number;
}

const SpinWheelTemplate: React.FC<SpinWheelProps> = ({ content, topic }) => {
  // Data mẫu nếu không có content
  const items: WheelItem[] = content?.items || [
    { id: '1', text: 'Câu hỏi 1', color: '#FF6384', details: 'Ai là người sáng lập Facebook?', points: 10 },
    { id: '2', text: 'Câu hỏi 2', color: '#36A2EB', details: 'Thủ đô của Việt Nam là gì?', points: 5 },
    { id: '3', text: 'Câu hỏi 3', color: '#FFCE56', details: 'Ngôn ngữ lập trình phổ biến nhất hiện nay?', points: 15 },
    { id: '4', text: 'Câu hỏi 4', color: '#4BC0C0', details: 'Năm bao nhiêu Việt Nam độc lập?', points: 10 },
    { id: '5', text: 'Câu hỏi 5', color: '#9966FF', details: 'Tên của ngôn ngữ lập trình do Google phát triển?', points: 20 },
    { id: '6', text: 'Bỏ qua', color: '#FF9F40', details: 'Bạn được bỏ qua lượt này', points: 0 },
    { id: '7', text: 'Điểm cộng', color: '#C9CBCF', details: 'Bạn được cộng 5 điểm!', points: 5 },
    { id: '8', text: 'Mất lượt', color: '#7FC97F', details: 'Bạn bị mất lượt', points: -5 },
  ];

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [spinHistory, setSpinHistory] = useState<WheelItem[]>([]);
  const [score, setScore] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Vẽ vòng quay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Xoá canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Vẽ từng phần của vòng quay
    const sliceAngle = (2 * Math.PI) / items.length;
    
    for (let i = 0; i < items.length; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      
      // Vẽ từng phần của vòng quay
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle + (rotation * Math.PI / 180), endAngle + (rotation * Math.PI / 180));
      ctx.closePath();
      
      // Tô màu
      ctx.fillStyle = items[i].color;
      ctx.fill();
      
      // Vẽ đường viền
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      ctx.stroke();
      
      // Viết text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2 + (rotation * Math.PI / 180));
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(items[i].text, radius - 15, 5);
      ctx.restore();
    }
    
    // Vẽ vòng tròn trung tâm
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Vẽ mũi tên chỉ vị trí
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius - 15, centerY - 15);
    ctx.lineTo(centerX + radius - 15, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
    
  }, [rotation, items]);
  
  // Xử lý quay vòng quay
  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    setSelectedItem(null);
    setShowDetails(false);
    
    // Số vòng quay ngẫu nhiên (3-6) + góc ngẫu nhiên
    const spins = 3 + Math.random() * 3;
    const targetRotation = rotation + (spins * 360) + Math.random() * 360;
    
    // Animation quay
    let currentRotation = rotation;
    const startTime = Date.now();
    const duration = 5000; // Thời gian quay (ms)
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function để làm chậm dần
      const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
      
      currentRotation = rotation + (targetRotation - rotation) * easeOutCubic(progress);
      setRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Kết thúc quay
        finishSpin(currentRotation);
      }
    };
    
    animate();
  };
  
  // Xử lý khi quay xong
  const finishSpin = (finalRotation: number) => {
    // Tính vị trí con trỏ sau khi quay
    const normalizedRotation = finalRotation % 360;
    const sliceAngle = 360 / items.length;
    const indexOffset = Math.floor(normalizedRotation / sliceAngle);
    const selectedIndex = (items.length - indexOffset) % items.length;
    
    const selected = items[selectedIndex];
    setSelectedItem(selected);
    setSpinHistory([...spinHistory, selected]);
    setScore(score + (selected.points || 0));
    setSpinning(false);
  };
  
  // Xử lý hiển thị chi tiết
  const handleShowDetails = () => {
    setShowDetails(true);
  };
  
  // Xử lý reset game
  const resetGame = () => {
    setRotation(0);
    setSpinning(false);
    setSelectedItem(null);
    setShowDetails(false);
    setSpinHistory([]);
    setScore(0);
  };

  return (
    <div className="min-h-[500px] flex flex-col p-4">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Vòng Quay May Mắn: {topic}</h2>
        <div className="flex items-center gap-2">
          <span className="font-medium">Điểm: {score}</span>
        </div>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Vòng quay */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="my-4"
            />
          </div>
          
          <Button
            onClick={spinWheel}
            disabled={spinning}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            {spinning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang quay...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Quay
              </>
            )}
          </Button>
        </div>
        
        {/* Bảng kết quả */}
        <div className="flex-1">
          <Card className="p-4 h-full">
            <h3 className="text-lg font-semibold mb-4">Kết quả</h3>
            
            {selectedItem ? (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Lượt quay hiện tại:</h4>
                <div 
                  className="p-3 rounded-md mb-4" 
                  style={{ backgroundColor: selectedItem.color + '33' }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{selectedItem.text}</span>
                    <span className="font-medium">{selectedItem.points > 0 ? `+${selectedItem.points}` : selectedItem.points} điểm</span>
                  </div>
                  
                  {!showDetails ? (
                    <Button 
                      onClick={handleShowDetails}
                      variant="outline" 
                      className="mt-2 w-full"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </Button>
                  ) : (
                    <div className="mt-2 p-3 bg-white rounded-md">
                      <p>{selectedItem.details}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 text-gray-500">
                <AlertCircle className="mr-2 h-5 w-5" />
                Quay vòng quay để xem kết quả
              </div>
            )}
            
            {/* Lịch sử quay */}
            {spinHistory.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Lịch sử ({spinHistory.length}):</h4>
                <div className="max-h-[200px] overflow-y-auto">
                  {spinHistory.slice().reverse().map((item, index) => (
                    <div 
                      key={index} 
                      className="p-2 rounded-md mb-2 flex justify-between items-center"
                      style={{ backgroundColor: item.color + '33' }}
                    >
                      <span>{item.text}</span>
                      <span className={`font-medium ${item.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.points > 0 ? `+${item.points}` : item.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Điều khiển */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={resetGame}
          variant="outline"
          className="bg-transparent"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm lại
        </Button>
      </div>
    </div>
  );
};

export default SpinWheelTemplate;

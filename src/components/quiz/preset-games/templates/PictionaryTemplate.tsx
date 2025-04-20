import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RotateCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import GameWrapper from './GameWrapper';

interface PictionaryTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
}

const PictionaryTemplate: React.FC<PictionaryTemplateProps> = ({ data, content, topic, onBack }) => {
  const gameContent = content || data || {};
  const { toast } = useToast();
  
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [drawings, setDrawings] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#000000");
  const [timeLeft, setTimeLeft] = useState(gameContent?.settings?.timeLimit || 300);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Khởi tạo game
  useEffect(() => {
    if (!gameStarted && gameContent?.items?.length > 0) {
      const initialDrawings = Array(gameContent.items.length).fill('');
      const initialGuesses = Array(gameContent.items.length).fill('');
      const initialCorrect = Array(gameContent.items.length).fill(false);
      
      setDrawings(initialDrawings);
      setGuesses(initialGuesses);
      setIsCorrect(initialCorrect);
      setCurrentItemIndex(0);
      setTimeLeft(gameContent?.settings?.timeLimit || 300);
      setShowResult(false);
      setGameStarted(true);
      
      initCanvas();
    }
  }, [gameContent, gameStarted]);
  
  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0 && gameStarted && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !showResult) {
      setShowResult(true);
    }
  }, [timeLeft, gameStarted, showResult]);

  // Khởi tạo canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas
    resizeCanvas();

    // Xóa canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Tải bản vẽ hiện tại nếu có
    if (drawings[currentItemIndex]) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = drawings[currentItemIndex];
    }
  };
  
  // Resize canvas khi cửa sổ thay đổi kích thước
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Đặt lại màu nền
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Tải lại bản vẽ
    if (drawings[currentItemIndex]) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = drawings[currentItemIndex];
    }
  };
  
  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Cập nhật canvas khi chuyển sang item khác
  useEffect(() => {
    initCanvas();
  }, [currentItemIndex]);
  
  // Xử lý bắt đầu vẽ
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    setLastPoint(point);
    
    // Vẽ điểm bắt đầu
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = brushColor;
    ctx.fill();
  };
  
  // Xử lý di chuyển chuột khi vẽ
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    
    const point = getCanvasPoint(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Cập nhật điểm cuối
    setLastPoint(point);
  };
  
  // Xử lý kết thúc vẽ
  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
    
    // Lưu bản vẽ hiện tại
    saveDrawing();
  };
  
  // Xử lý khi chuột rời khỏi canvas
  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      
      // Lưu bản vẽ hiện tại
      saveDrawing();
    }
  };
  
  // Xử lý sự kiện touch cho thiết bị di động
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getTouchPoint(e);
    setLastPoint(point);
    
    // Vẽ điểm bắt đầu
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = brushColor;
    ctx.fill();
  };
  
  // Xử lý di chuyển touch khi vẽ
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint) return;
    
    const point = getTouchPoint(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Cập nhật điểm cuối
    setLastPoint(point);
  };
  
  // Xử lý kết thúc touch
  const handleTouchEnd = () => {
    setIsDrawing(false);
    setLastPoint(null);
    
    // Lưu bản vẽ hiện tại
    saveDrawing();
  };
  
  // Lấy tọa độ chuột trên canvas
  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };
  
  // Lấy tọa độ touch trên canvas
  const getTouchPoint = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };
  
  // Lưu bản vẽ hiện tại
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    setDrawings(prev => {
      const newDrawings = [...prev];
      newDrawings[currentItemIndex] = dataURL;
      return newDrawings;
    });
  };
  
  // Xóa canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Lưu canvas trống
    const dataURL = canvas.toDataURL('image/png');
    setDrawings(prev => {
      const newDrawings = [...prev];
      newDrawings[currentItemIndex] = dataURL;
      return newDrawings;
    });
  };
  
  // Xử lý chuyển sang câu hỏi tiếp theo
  const handleNext = () => {
    if (currentItemIndex < gameContent.items.length - 1) {
      // Kiểm tra đáp án
      checkAnswer();
      
      // Chuyển sang câu tiếp theo
      setCurrentItemIndex(prev => prev + 1);
      setCurrentGuess('');
    } else {
      // Kiểm tra đáp án cuối cùng
      checkAnswer();
      
      // Kết thúc game
      setShowResult(true);
    }
  };
  
  // Xử lý quay lại câu hỏi trước
  const handlePrev = () => {
    if (currentItemIndex > 0) {
      // Kiểm tra đáp án
      checkAnswer();
      
      // Quay lại câu trước
      setCurrentItemIndex(prev => prev - 1);
      setCurrentGuess('');
    }
  };
  
  // Kiểm tra đáp án
  const checkAnswer = () => {
    if (!currentGuess.trim()) return;
    
    const correctAnswer = gameContent.items[currentItemIndex].text;
    const isAnswerCorrect = 
      currentGuess.trim().toLowerCase() === correctAnswer.toLowerCase();
    
    // Lưu đáp án
    setGuesses(prev => {
      const newGuesses = [...prev];
      newGuesses[currentItemIndex] = currentGuess;
      return newGuesses;
    });
    
    // Đánh dấu đúng/sai
    setIsCorrect(prev => {
      const newCorrect = [...prev];
      newCorrect[currentItemIndex] = isAnswerCorrect;
      return newCorrect;
    });
    
    // Hiển thị thông báo
    if (isAnswerCorrect) {
      toast({
        title: "Đáp án đúng!",
        description: `"${correctAnswer}" là đáp án chính xác.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Chưa chính xác",
        description: `Đáp án đúng là "${correctAnswer}".`,
        variant: "destructive",
      });
    }
  };
  
  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };
  
  // Tính điểm
  const calculateScore = () => {
    return isCorrect.filter(Boolean).length;
  };
  
  // Khởi động lại game
  const handleRestart = () => {
    const initialDrawings = Array(gameContent.items.length).fill('');
    const initialGuesses = Array(gameContent.items.length).fill('');
    const initialCorrect = Array(gameContent.items.length).fill(false);
    
    setDrawings(initialDrawings);
    setGuesses(initialGuesses);
    setIsCorrect(initialCorrect);
    setCurrentItemIndex(0);
    setTimeLeft(gameContent?.settings?.timeLimit || 300);
    setShowResult(false);
    
    initCanvas();
  };
  
  if (!gameContent || !gameContent.items) {
    return <div className="p-4">Không có dữ liệu trò chơi vẽ/đoán</div>;
  }
  
  const currentItem = gameContent.items[currentItemIndex];
  const progress = ((currentItemIndex + 1) / gameContent.items.length) * 100;
  
  // Màn hình kết quả
  if (showResult) {
    const score = calculateScore();
    const totalQuestions = gameContent.items.length;
    
    return (
      <GameWrapper
        onBack={onBack}
        progress={100}
        timeLeft={timeLeft}
        score={score}
        currentItem={currentItemIndex + 1}
        totalItems={gameContent.items.length}
        title="Kết quả"
      >
        <Card className="flex-grow flex items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-primary">Kết Quả</h2>
            <p className="text-lg mb-4">
              Chủ đề: <span className="font-semibold">{gameContent.title || topic}</span>
            </p>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Đoán đúng</span>
                <span className="font-bold">
                  {Math.round((score / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${(score / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-4xl font-bold mb-6 text-primary">
              {score} / {totalQuestions}
            </div>
            
            <Button onClick={handleRestart} className="mt-4">
              <RotateCw className="mr-2 h-4 w-4" />
              Chơi lại
            </Button>
          </div>
        </Card>
      </GameWrapper>
    );
  }
  
  return (
    <GameWrapper
      onBack={onBack}
      progress={progress}
      timeLeft={timeLeft}
      score={calculateScore()}
      currentItem={currentItemIndex + 1}
      totalItems={gameContent.items.length}
      title={gameContent.title || "Vẽ & Đoán"}
    >
      <div className="flex flex-col h-full">
        <div className="text-lg font-medium text-center mb-2">
          Vẽ: <span className="font-bold">{currentItem.text}</span>
        </div>
        
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex gap-2 items-center">
            <label htmlFor="brush-size" className="text-sm w-20">Cỡ bút: {brushSize}px</label>
            <Slider
              id="brush-size"
              value={[brushSize]}
              min={1}
              max={20}
              step={1}
              onValueChange={(values) => setBrushSize(values[0])}
              className="flex-1"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <label htmlFor="brush-color" className="text-sm w-20">Màu:</label>
            <div className="flex gap-2 flex-1">
              {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${brushColor === color ? 'border-gray-500' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBrushColor(color)}
                />
              ))}
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden"
              />
            </div>
          </div>
        </div>
        
        <Card 
          className="flex-grow flex items-center justify-center bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm border-primary/20 mb-4"
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </Card>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            placeholder="Đoán xem đây là gì..."
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Đoán</Button>
        </form>
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
          >
            Xóa
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentItemIndex === 0}
            >
              Trước
            </Button>
            <Button
              onClick={handleNext}
            >
              {currentItemIndex < gameContent.items.length - 1 ? "Tiếp" : "Kết thúc"}
            </Button>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

export default PictionaryTemplate;

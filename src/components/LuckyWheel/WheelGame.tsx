
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WheelSegment {
  label: string;
  points: number;
  color: string;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { label: '10 Points', points: 10, color: '#e74c3c' },
  { label: '50 Points', points: 50, color: '#3498db' },
  { label: '20 Points', points: 20, color: '#2ecc71' },
  { label: '100 Points', points: 100, color: '#f39c12' },
  { label: '30 Points', points: 30, color: '#9b59b6' },
  { label: '0 Points', points: 0, color: '#f1c40f' }
];

const LuckyWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const drawWheel = (ctx: CanvasRenderingContext2D, segments: WheelSegment[]) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const arcSize = (Math.PI * 2) / segments.length;

    segments.forEach((segment, index) => {
      const startAngle = index * arcSize;
      ctx.fillStyle = segment.color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + arcSize);
      ctx.closePath();
      ctx.fill();

      // Segment text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(segment.label, radius / 2, 0);
      ctx.restore();
    });
  };

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    
    // Simulated spin logic
    const randomSegment = WHEEL_SEGMENTS[Math.floor(Math.random() * WHEEL_SEGMENTS.length)];
    
    setTimeout(() => {
      setResult(`You landed on: ${randomSegment.label}`);
      setScore(prev => prev + randomSegment.points);
      setSpinning(false);
    }, 2000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      drawWheel(ctx, WHEEL_SEGMENTS);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Lucky Wheel Game</h1>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="border-2 border-primary rounded-full"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={spinning}
          onClick={spinWheel}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            px-4 py-2 bg-primary text-white rounded-full 
            ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {spinning ? 'Spinning...' : 'Spin'}
        </motion.button>
      </div>
      {result && (
        <div className="text-lg font-semibold text-primary">
          {result}
        </div>
      )}
      <div className="text-lg">
        Score: <span className="font-bold">{score}</span>
      </div>
    </div>
  );
};

export default LuckyWheel;

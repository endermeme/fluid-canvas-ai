
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface WheelSection {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  color: string;
}

interface WheelComponentProps {
  sections: WheelSection[];
  onSpinComplete: (sectionIndex: number) => void;
  spinDuration: number;
}

const WheelComponent: React.FC<WheelComponentProps> = ({
  sections,
  onSpinComplete,
  spinDuration
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Tăng số vòng quay và thời gian để chậm hơn
    const spins = 6 + Math.random() * 4; // 6-10 vòng thay vì 3-5
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + finalAngle;
    
    setRotation(totalRotation);
    
    // Tăng thời gian animation lên 5 giây
    const actualDuration = 5000;
    
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${actualDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }
    
    setTimeout(() => {
      setIsSpinning(false);
      
      // Tính toán section được chọn
      const normalizedAngle = (360 - (finalAngle % 360)) % 360;
      const sectionAngle = 360 / sections.length;
      const selectedIndex = Math.floor(normalizedAngle / sectionAngle) % sections.length;
      
      onSpinComplete(selectedIndex);
    }, actualDuration);
  };

  const radius = 200;
  const centerX = 250;
  const centerY = 250;
  const sectionAngle = 360 / sections.length;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative mb-8">
        {/* Wheel */}
        <svg width="500" height="500" className="wheel-container">
          <g ref={wheelRef}>
            {sections.map((section, index) => {
              const startAngle = (index * sectionAngle) * (Math.PI / 180);
              const endAngle = ((index + 1) * sectionAngle) * (Math.PI / 180);
              
              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);
              
              const largeArcFlag = sectionAngle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              const textAngle = (startAngle + endAngle) / 2;
              const textRadius = radius * 0.7;
              const textX = centerX + textRadius * Math.cos(textAngle);
              const textY = centerY + textRadius * Math.sin(textAngle);

              return (
                <g key={section.id}>
                  <path
                    d={pathData}
                    fill={section.color}
                    stroke="#fff"
                    strokeWidth="3"
                    className="wheel-section"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="Inter, system-ui, sans-serif"
                    transform={`rotate(${(textAngle * 180 / Math.PI)}, ${textX}, ${textY})`}
                  >
                    {`Câu ${section.id}`}
                  </text>
                </g>
              );
            })}
          </g>
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="20"
            fill="#8B4513"
            stroke="#fff"
            strokeWidth="3"
          />
          
          {/* Pointer */}
          <polygon
            points={`${centerX},${centerY-radius-20} ${centerX-15},${centerY-radius-5} ${centerX+15},${centerY-radius-5}`}
            fill="#8B4513"
            stroke="#fff"
            strokeWidth="2"
          />
        </svg>
      </div>

      <Button
        onClick={handleSpin}
        disabled={isSpinning}
        size="lg"
        className={`px-8 py-4 text-xl font-bold ${isSpinning ? '' : 'pulse-glow'}`}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {isSpinning ? '🎡 Đang quay...' : '🎯 QUAY VÒNG!'}
      </Button>
      
      {isSpinning && (
        <p className="mt-4 text-lg text-muted-foreground animate-pulse" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Vòng quay đang chậm lại...
        </p>
      )}
    </div>
  );
};

export default WheelComponent;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface WheelSection {
  id: number;
  question: string;
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
  const [wheelRotation, setWheelRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spins = 3 + Math.random() * 3; // 3-6 full rotations
    const randomAngle = Math.random() * 360;
    const totalRotation = spins * 360 + randomAngle;
    
    setWheelRotation(prev => prev + totalRotation);
    
    setTimeout(() => {
      const sectionAngle = 360 / sections.length;
      const finalAngle = (wheelRotation + totalRotation) % 360;
      const selectedIndex = Math.floor((360 - finalAngle) / sectionAngle) % sections.length;
      
      setIsSpinning(false);
      onSpinComplete(selectedIndex);
    }, spinDuration * 1000);
  };

  const radius = 180;
  const center = 200;
  const sectionAngle = 360 / sections.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
      <div className="relative mb-8">
        {/* Wheel Container */}
        <div className="relative">
          <svg width="400" height="400" className="wheel-container">
            {/* Wheel Sections */}
            <g
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transformOrigin: '200px 200px',
                transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(0.17, 0.67, 0.12, 0.99)` : 'none'
              }}
            >
              {sections.map((section, index) => {
                const startAngle = index * sectionAngle;
                const endAngle = (index + 1) * sectionAngle;
                
                const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
                const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
                const endX = center + radius * Math.cos((endAngle * Math.PI) / 180);
                const endY = center + radius * Math.sin((endAngle * Math.PI) / 180);
                
                const largeArcFlag = sectionAngle > 180 ? 1 : 0;
                
                const pathData = [
                  `M ${center} ${center}`,
                  `L ${startX} ${startY}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  'Z'
                ].join(' ');

                // Text position
                const textAngle = startAngle + sectionAngle / 2;
                const textRadius = radius * 0.7;
                const textX = center + textRadius * Math.cos((textAngle * Math.PI) / 180);
                const textY = center + textRadius * Math.sin((textAngle * Math.PI) / 180);

                return (
                  <g key={section.id}>
                    <path
                      d={pathData}
                      fill={section.color}
                      stroke="#fff"
                      strokeWidth="2"
                      className="wheel-section"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    >
                      {`Câu ${index + 1}`}
                    </text>
                  </g>
                );
              })}
            </g>
            
            {/* Center Circle */}
            <circle
              cx={center}
              cy={center}
              r="20"
              fill="#4F46E5"
              stroke="#fff"
              strokeWidth="3"
            />
            
            {/* Pointer */}
            <polygon
              points={`${center},10 ${center-15},50 ${center+15},50`}
              fill="#EF4444"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <Button 
        onClick={spinWheel}
        disabled={isSpinning}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
      >
        <Play className="h-6 w-6 mr-2" />
        {isSpinning ? 'Đang quay...' : 'Quay vòng may mắn!'}
      </Button>

      <p className="text-center text-muted-foreground mt-4 max-w-md">
        Nhấn nút để quay vòng và chọn câu hỏi ngẫu nhiên. Vòng quay sẽ dừng lại và bạn sẽ trả lời câu hỏi được chọn.
      </p>
    </div>
  );
};

export default WheelComponent;

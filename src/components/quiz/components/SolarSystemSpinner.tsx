
import React from 'react';
import { Brain, Sun } from 'lucide-react';

const SolarSystemSpinner: React.FC = () => {
  return (
    <div className="relative mb-6 flex items-center justify-center">
      {/* Realistic Solar System với AI Brain làm trung tâm */}
      <div className="relative w-80 h-80">
        {/* Realistic orbit rings - khoảng cách không đều như hệ mặt trời thật */}
        {/* Mercury orbit */}
        <div className="absolute border border-gray-300/20 rounded-full" 
             style={{ 
               width: '80px', 
               height: '80px', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
        </div>
        
        {/* Venus orbit */}
        <div className="absolute border border-yellow-300/20 rounded-full" 
             style={{ 
               width: '100px', 
               height: '100px', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
        </div>
        
        {/* Earth orbit */}
        <div className="absolute border border-blue-400/20 rounded-full" 
             style={{ 
               width: '120px', 
               height: '120px', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
        </div>
        
        {/* Mars orbit */}
        <div className="absolute border border-red-400/20 rounded-full" 
             style={{ 
               width: '150px', 
               height: '150px', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
        </div>
        
        {/* Jupiter orbit - khoảng cách xa hơn */}
        <div className="absolute border border-orange-400/20 rounded-full" 
             style={{ 
               width: '200px', 
               height: '200px', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
        </div>
        
        {/* Saturn orbit */}
        <div className="absolute border border-yellow-300/20 rounded-full" 
             style={{ 
               width: '240px', 
               height: '240px', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
        </div>
        
        {/* Uranus orbit */}
        <div className="absolute border border-cyan-400/20 rounded-full" 
             style={{ 
               width: '280px', 
               height: '280px', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
        </div>
        
        {/* Neptune orbit */}
        <div className="absolute border border-blue-600/20 rounded-full" 
             style={{ 
               width: '320px', 
               height: '320px', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
        </div>
        
        {/* AI Brain "Sun" ở trung tâm với hào quang */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-2xl z-10">
          <Brain className="h-6 w-6 text-white" />
          {/* Hào quang AI */}
          <div className="absolute inset-0 rounded-full border-2 border-yellow-300/30 animate-ping"></div>
          <div className="absolute -inset-2 rounded-full border border-orange-300/20 animate-pulse"></div>
        </div>
        
        {/* Mercury - Nhỏ, xám, gần, nhanh nhất (88 ngày) */}
        <div 
          className="absolute animate-spin" 
          style={{ 
            width: '80px',
            height: '80px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '2s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full shadow-sm" 
            style={{ 
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Venus - Vàng nhạt, gần giống Earth (225 ngày) */}
        <div 
          className="absolute animate-spin" 
          style={{ 
            width: '100px',
            height: '100px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '3.2s',
            animationDirection: 'reverse', // Venus quay ngược
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-2.5 h-2.5 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-full shadow-md" 
            style={{ 
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Earth - Xanh lam với đám mây (365 ngày) */}
        <div 
          className="absolute animate-spin" 
          style={{ 
            width: '120px',
            height: '120px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '4s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-green-500 rounded-full shadow-lg relative" 
            style={{ 
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {/* Đám mây Trái Đất */}
            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        {/* Mars - Đỏ, nhỏ hơn Earth (687 ngày) */}
        <div 
          className="absolute animate-spin" 
          style={{ 
            width: '150px',
            height: '150px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '5.5s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-2 h-2 bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-md" 
            style={{ 
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Jupiter - To nhất, nâu vàng (12 năm) */}
        <div 
          className="absolute animate-spin" 
          style={{ 
            width: '200px',
            height: '200px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '8s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-6 h-6 bg-gradient-to-r from-orange-300 via-yellow-500 to-orange-400 rounded-full shadow-xl" 
            style={{ 
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {/* Dải sọc Jupiter */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-600/30 to-transparent rounded-full"></div>
          </div>
        </div>
        
        {/* Saturn - Vàng với vành đai (29 năm) */}
        <div 
          className="absolute animate-spin" 
          style={{ 
            width: '240px',
            height: '240px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '12s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-5 h-5 bg-gradient-to-r from-yellow-200 to-yellow-500 rounded-full shadow-lg relative" 
            style={{ 
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {/* Vành đai Saturn */}
            <div className="absolute inset-0 border border-yellow-300/80 rounded-full scale-150"></div>
            <div className="absolute inset-0 border border-yellow-200/60 rounded-full scale-125"></div>
            <div className="absolute inset-0 border border-yellow-400/40 rounded-full scale-175"></div>
          </div>
        </div>
        
        {/* Uranus - Xanh nhạt (84 năm) */}
        <div 
          className="absolute animate-spin" 
          style={{ 
            width: '280px',
            height: '280px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '16s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-3.5 h-3.5 bg-gradient-to-r from-cyan-300 to-cyan-500 rounded-full shadow-md" 
            style={{ 
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Neptune - Xanh đậm, xa nhất (165 năm) */}
        <div 
          className="absolute animate-spin" 
          style={{ 
            width: '320px',
            height: '320px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '20s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-md opacity-90" 
            style={{ 
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Outer space glow effects */}
        <div className="absolute inset-0 rounded-full border border-primary/5 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-4 rounded-full border border-secondary/5 animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute inset-8 rounded-full border border-accent/5 animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default SolarSystemSpinner;

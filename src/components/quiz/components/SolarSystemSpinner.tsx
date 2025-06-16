
import React from 'react';
import { Brain } from 'lucide-react';

const SolarSystemSpinner: React.FC = () => {
  return (
    <div className="relative mb-6 flex items-center justify-center">
      {/* Solar System Spinner với axis-based rotation */}
      <div className="relative w-64 h-64">
        {/* Orbit rings - 7 different sizes for visual guidance */}
        <div className="absolute inset-0 border border-primary/15 rounded-full"></div>
        <div className="absolute inset-4 border border-secondary/20 rounded-full"></div>
        <div className="absolute inset-8 border border-accent/25 rounded-full"></div>
        <div className="absolute inset-12 border border-yellow-400/20 rounded-full"></div>
        <div className="absolute inset-16 border border-green-400/25 rounded-full"></div>
        <div className="absolute inset-20 border border-red-400/20 rounded-full"></div>
        <div className="absolute inset-24 border border-purple-400/25 rounded-full"></div>
        
        {/* Center brain "sun" */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-primary via-secondary to-primary rounded-full flex items-center justify-center animate-pulse shadow-2xl z-10">
          <Brain className="h-8 w-8 text-white animate-pulse" />
        </div>
        
        {/* Planet 1 - Mercury (innermost, fastest) */}
        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ 
          animation: 'spin 2s linear infinite',
          transformOrigin: 'center center'
        }}>
          <div className="absolute w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full shadow-lg border border-white/50" 
               style={{ 
                 top: '16px', 
                 left: '50%', 
                 transform: 'translateX(-50%)' 
               }}>
          </div>
        </div>
        
        {/* Planet 2 - Venus */}
        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ 
          animation: 'spin 3s linear infinite reverse',
          transformOrigin: 'center center'
        }}>
          <div className="absolute w-4 h-4 bg-gradient-to-r from-orange-300 to-yellow-400 rounded-full shadow-lg border border-white/50" 
               style={{ 
                 top: '32px', 
                 left: '50%', 
                 transform: 'translateX(-50%)' 
               }}>
          </div>
        </div>
        
        {/* Planet 3 - Earth */}
        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ 
          animation: 'spin 4s linear infinite',
          transformOrigin: 'center center'
        }}>
          <div className="absolute w-5 h-5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full shadow-lg border border-white/50" 
               style={{ 
                 top: '48px', 
                 left: '50%', 
                 transform: 'translateX(-50%)' 
               }}>
          </div>
        </div>
        
        {/* Planet 4 - Mars */}
        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ 
          animation: 'spin 5s linear infinite reverse',
          transformOrigin: 'center center'
        }}>
          <div className="absolute w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg border border-white/50" 
               style={{ 
                 top: '64px', 
                 left: '50%', 
                 transform: 'translateX(-50%)' 
               }}>
          </div>
        </div>
        
        {/* Planet 5 - Jupiter (largest) */}
        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ 
          animation: 'spin 6s linear infinite',
          transformOrigin: 'center center'
        }}>
          <div className="absolute w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg border border-white/50" 
               style={{ 
                 top: '80px', 
                 left: '50%', 
                 transform: 'translateX(-50%)' 
               }}>
          </div>
        </div>
        
        {/* Planet 6 - Saturn (with rings) */}
        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ 
          animation: 'spin 7s linear infinite reverse',
          transformOrigin: 'center center'
        }}>
          <div className="absolute w-5 h-5 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-lg border border-white/50 relative" 
               style={{ 
                 top: '96px', 
                 left: '50%', 
                 transform: 'translateX(-50%)' 
               }}>
            {/* Saturn's ring */}
            <div className="absolute inset-0 border border-yellow-200/70 rounded-full scale-150"></div>
          </div>
        </div>
        
        {/* Planet 7 - Neptune (outermost) */}
        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ 
          animation: 'spin 8s linear infinite',
          transformOrigin: 'center center'
        }}>
          <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full shadow-lg border border-white/50" 
               style={{ 
                 top: '112px', 
                 left: '50%', 
                 transform: 'translateX(-50%)' 
               }}>
          </div>
        </div>
        
        {/* Outer glow rings */}
        <div className="absolute inset-0 rounded-full border border-primary/5 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-2 rounded-full border border-secondary/5 animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute inset-4 rounded-full border border-accent/5 animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default SolarSystemSpinner;

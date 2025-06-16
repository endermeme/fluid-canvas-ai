
import React from 'react';
import { Brain } from 'lucide-react';

const SolarSystemSpinner: React.FC = () => {
  return (
    <div className="relative mb-6 flex items-center justify-center">
      {/* Solar System Spinner với perfect circular rotation */}
      <div className="relative w-64 h-64">
        {/* Orbit rings - 8 different sizes for 8 planets */}
        <div className="absolute inset-0 border border-primary/15 rounded-full"></div>
        <div className="absolute inset-2 border border-orange-400/20 rounded-full"></div>
        <div className="absolute inset-4 border border-yellow-400/20 rounded-full"></div>
        <div className="absolute inset-6 border border-blue-400/20 rounded-full"></div>
        <div className="absolute inset-8 border border-red-400/20 rounded-full"></div>
        <div className="absolute inset-12 border border-orange-500/20 rounded-full"></div>
        <div className="absolute inset-16 border border-yellow-300/20 rounded-full"></div>
        <div className="absolute inset-20 border border-blue-500/20 rounded-full"></div>
        
        {/* Center brain "sun" */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-2xl z-10">
          <Brain className="h-8 w-8 text-white animate-pulse" />
        </div>
        
        {/* Mercury - Planet 1 (closest, fastest, 88 days) */}
        <div 
          className="absolute inset-0 animate-spin" 
          style={{ 
            animationDuration: '2s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full shadow-lg border border-white/50" 
            style={{ 
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Venus - Planet 2 (225 days) */}
        <div 
          className="absolute inset-0 animate-spin" 
          style={{ 
            animationDuration: '3.2s',
            animationDirection: 'reverse',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-3 h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg border border-white/50" 
            style={{ 
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Earth - Planet 3 (365 days) */}
        <div 
          className="absolute inset-0 animate-spin" 
          style={{ 
            animationDuration: '4s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-full shadow-lg border border-white/50" 
            style={{ 
              top: '24px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Mars - Planet 4 (687 days) */}
        <div 
          className="absolute inset-0 animate-spin" 
          style={{ 
            animationDuration: '5s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-3 h-3 bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-lg border border-white/50" 
            style={{ 
              top: '32px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Jupiter - Planet 5 (12 years, largest) */}
        <div 
          className="absolute inset-0 animate-spin" 
          style={{ 
            animationDuration: '8s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full shadow-lg border border-white/50" 
            style={{ 
              top: '48px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Saturn - Planet 6 (29 years, with rings) */}
        <div 
          className="absolute inset-0 animate-spin" 
          style={{ 
            animationDuration: '12s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-5 h-5 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-lg border border-white/50 relative" 
            style={{ 
              top: '64px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {/* Saturn's rings */}
            <div className="absolute inset-0 border border-yellow-200/70 rounded-full scale-150"></div>
            <div className="absolute inset-0 border border-yellow-200/50 rounded-full scale-125"></div>
          </div>
        </div>
        
        {/* Uranus - Planet 7 (84 years) */}
        <div 
          className="absolute inset-0 animate-spin" 
          style={{ 
            animationDuration: '16s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full shadow-lg border border-white/50" 
            style={{ 
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Neptune - Planet 8 (165 years, outermost) */}
        <div 
          className="absolute inset-0 animate-spin" 
          style={{ 
            animationDuration: '20s',
            transformOrigin: '50% 50%'
          }}
        >
          <div 
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-lg border border-white/50" 
            style={{ 
              top: '96px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
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

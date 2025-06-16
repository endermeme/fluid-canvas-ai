
import React from 'react';
import { Brain } from 'lucide-react';

const SolarSystemSpinner: React.FC = () => {
  return (
    <div className="relative mb-6 flex items-center justify-center">
      {/* 7-Planet Solar System Spinner */}
      <div className="relative w-64 h-64">
        {/* Orbit rings - 7 different sizes */}
        <div className="absolute inset-0 border border-primary/15 rounded-full"></div>
        <div className="absolute inset-4 border border-secondary/20 rounded-full"></div>
        <div className="absolute inset-8 border border-accent/25 rounded-full"></div>
        <div className="absolute inset-12 border border-yellow-400/20 rounded-full"></div>
        <div className="absolute inset-16 border border-green-400/25 rounded-full"></div>
        <div className="absolute inset-20 border border-red-400/20 rounded-full"></div>
        <div className="absolute inset-24 border border-purple-400/25 rounded-full"></div>
        
        {/* Center brain "sun" */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-primary via-secondary to-primary rounded-full flex items-center justify-center animate-pulse shadow-2xl">
          <Brain className="h-8 w-8 text-white animate-pulse" />
        </div>
        
        {/* Planet 1 - Mercury (closest, fastest) */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-2 -translate-y-2 animate-spin" style={{ animation: 'spin 2s linear infinite' }}>
          <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -32px)' }}></div>
        </div>
        
        {/* Planet 2 - Venus */}
        <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-2.5 -translate-y-2.5 animate-spin" style={{ animation: 'spin 3s linear infinite reverse' }}>
          <div className="w-5 h-5 bg-gradient-to-r from-orange-300 to-yellow-400 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -48px)' }}></div>
        </div>
        
        {/* Planet 3 - Earth */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-3 -translate-y-3 animate-spin" style={{ animation: 'spin 4s linear infinite' }}>
          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-green-400 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -64px)' }}></div>
        </div>
        
        {/* Planet 4 - Mars */}
        <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-2.5 -translate-y-2.5 animate-spin" style={{ animation: 'spin 5s linear infinite reverse' }}>
          <div className="w-5 h-5 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -80px)' }}></div>
        </div>
        
        {/* Planet 5 - Jupiter */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-4 -translate-y-4 animate-spin" style={{ animation: 'spin 6s linear infinite' }}>
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -96px)' }}></div>
        </div>
        
        {/* Planet 6 - Saturn */}
        <div className="absolute top-1/2 left-1/2 w-7 h-7 -translate-x-3.5 -translate-y-3.5 animate-spin" style={{ animation: 'spin 7s linear infinite reverse' }}>
          <div className="w-7 h-7 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-lg border border-white/50 absolute relative" style={{ transform: 'translate(0, -112px)' }}>
            {/* Saturn's ring */}
            <div className="absolute inset-0 border border-yellow-200/70 rounded-full scale-150"></div>
          </div>
        </div>
        
        {/* Planet 7 - Neptune */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-3 -translate-y-3 animate-spin" style={{ animation: 'spin 8s linear infinite' }}>
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full shadow-lg border border-white/50 absolute" style={{ transform: 'translate(0, -128px)' }}></div>
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

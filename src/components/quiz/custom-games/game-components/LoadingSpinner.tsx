
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="relative">
      <span
        className={cn(
          'inline-block border-[3px] border-primary/20 border-t-primary rounded-full animate-spin',
          sizeClasses[size],
          className
        )}
        aria-label="Đang tải"
        role="status"
        style={{
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent'
        }}
      />
      
      {/* Inner spinning element for more dynamic effect */}
      <span
        className={cn(
          'absolute inset-2 border-[2px] border-transparent border-b-primary/60 rounded-full animate-spin',
          'animation-direction: reverse'
        )}
        style={{
          animationDirection: 'reverse',
          animationDuration: '1.5s'
        }}
      />
      
      {/* Center dot */}
      <div className={cn(
        'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/80 rounded-full animate-pulse',
        size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
      )} />
    </div>
  );
};

export default LoadingSpinner;

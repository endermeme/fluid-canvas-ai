
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
    <span
      className={cn(
        'inline-block border-[3px] border-primary/40 border-t-primary rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
      aria-label="Đang tải"
      role="status"
      style={{
        borderRightColor: 'transparent'
      }}
    />
  );
};

export default LoadingSpinner;

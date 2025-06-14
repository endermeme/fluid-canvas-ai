
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'gradient';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'primary',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'border-primary border-t-transparent',
    secondary: 'border-muted-foreground border-t-transparent',
    gradient: 'border-transparent'
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {variant === 'gradient' ? (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-blue-500 to-purple-500 animate-spin opacity-75" />
          <div className="absolute inset-1 rounded-full bg-background" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20" />
        </div>
      ) : (
        <div className={cn(
          "w-full h-full border-4 rounded-full animate-spin",
          variantClasses[variant]
        )} />
      )}
    </div>
  );
};

export default LoadingSpinner;

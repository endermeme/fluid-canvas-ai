
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
  showPercentage?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, indicatorColor, showPercentage = false, ...props }, ref) => (
  <div className="relative w-full">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 shadow-inner border border-border/50",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-700 ease-out rounded-full shadow-sm",
          indicatorColor || "bg-gradient-to-r from-primary via-primary/90 to-primary/80"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      
      {/* Enhanced shine effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none opacity-60"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          transition: 'transform 0.7s ease-out'
        }}
      />
      
      {/* Glow effect for near completion */}
      {value && value > 80 && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full animate-glow pointer-events-none"
          style={{ 
            transform: `translateX(-${100 - (value || 0)}%)`,
            transition: 'transform 0.7s ease-out'
          }}
        />
      )}
    </ProgressPrimitive.Root>
    
    {showPercentage && (
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground drop-shadow-md">
        <span className="bg-background/80 px-2 py-0.5 rounded-full border border-border/50 backdrop-blur-sm">
          {Math.round(value || 0)}%
        </span>
      </div>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

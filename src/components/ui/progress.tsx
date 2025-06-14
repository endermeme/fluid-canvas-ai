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
        "relative h-3 w-full overflow-hidden rounded-full bg-muted/60 shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-700 ease-out rounded-full",
          indicatorColor || "bg-primary"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {/* Subtle shine effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-0 pointer-events-none"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          transition: 'transform 0.7s ease-out'
        }}
      />
    </ProgressPrimitive.Root>
    {showPercentage && (
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground drop-shadow-sm">
        {Math.round(value || 0)}%
      </div>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

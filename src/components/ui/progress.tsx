import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
  showPercentage?: boolean;
}
const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(({
  className,
  value = 0,
  indicatorColor,
  showPercentage = false,
  ...props
}, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorColor)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
    {showPercentage && (
      <span className="absolute inset-0 flex items-center justify-center text-xs text-primary-foreground">
        {Math.round(value || 0)}%
      </span>
    )}
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };
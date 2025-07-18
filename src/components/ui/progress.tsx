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
}, ref) => {});
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };
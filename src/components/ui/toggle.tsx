
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        glass: 
          "backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 data-[state=on]:bg-primary/20",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => {
  const handlePress = (e: React.MouseEvent) => {
    // Add ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    // Calculate position relative to the button
    const x = e.clientX - rect.left - size/2;
    const y = e.clientY - rect.top - size/2;
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'absolute rounded-full bg-primary/20 pointer-events-none transform animate-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Make sure button has position relative for absolute positioning of ripple
    if (window.getComputedStyle(button).position !== 'relative') {
      button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';
    
    // Add ripple and remove after animation completes
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (button.contains(ripple)) {
        ripple.remove();
      }
    }, 600);
  };

  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      onMouseDown={handlePress}
      {...props}
    />
  )
})

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

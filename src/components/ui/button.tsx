
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-transform",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] transition-transform",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98] transition-transform",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98] transition-transform",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98] transition-transform",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-foreground shadow-sm active:scale-[0.98] transition-transform",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      loading: {
        true: "relative text-transparent transition-none hover:text-transparent",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.onClick) {
        props.onClick(e);
      }
      
      // Enhanced ripple effect
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.5;
      
      // Calculate position relative to the button
      const x = e.clientX - rect.left - size/2;
      const y = e.clientY - rect.top - size/2;
      
      // Create ripple element with better animation
      const ripple = document.createElement('span');
      ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none transform animate-ripple';
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
      }, 700);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        {...props}
        onClick={handleClick}
      >
        {props.children}
        
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1">
              <span className="animate-bounce-subtle h-1.5 w-1.5 rounded-full bg-current" style={{ animationDelay: "0ms" }} />
              <span className="animate-bounce-subtle h-1.5 w-1.5 rounded-full bg-current" style={{ animationDelay: "150ms" }} />
              <span className="animate-bounce-subtle h-1.5 w-1.5 rounded-full bg-current" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

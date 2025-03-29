
import { gsap } from 'gsap';

// Block creation animation
export const animateBlockCreation = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { 
      scale: 0.8, 
      opacity: 0, 
      y: 10 
    },
    { 
      scale: 1, 
      opacity: 1, 
      y: 0, 
      duration: 0.3, 
      ease: "power3.out" 
    }
  );
};

// Block move animation
export const animateBlockMove = (element: HTMLElement, x: number, y: number): void => {
  gsap.to(element, {
    x,
    y,
    duration: 0.2,
    ease: "power2.out"
  });
};

// Block resize animation
export const animateBlockResize = (
  element: HTMLElement, 
  width: number, 
  height: number
): void => {
  gsap.to(element, {
    width,
    height,
    duration: 0.2,
    ease: "power2.out"
  });
};

// Connection line animation
export const animateConnectionLine = (element: SVGElement): void => {
  gsap.fromTo(
    element,
    { strokeDashoffset: 1000, strokeDasharray: 1000 },
    { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }
  );
};

// Fade in animation
export const fadeIn = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
  );
};

// Slide in animation
export const slideIn = (element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'right'): void => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const value = direction === 'right' || direction === 'bottom' ? 100 : -100;
  
  const fromVars: any = { opacity: 0 };
  fromVars[axis] = value;
  
  const toVars: any = { opacity: 1, duration: 0.5, ease: "power2.out" };
  toVars[axis] = 0;
  
  gsap.fromTo(element, fromVars, toVars);
};

// Toolbar appearance animation
export const animateToolbarAppear = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
  );
};

// AI panel slide in animation
export const animateAIPanelSlideIn = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { x: '100%' },
    { x: '0%', duration: 0.4, ease: "power3.out" }
  );
};

// AI panel slide out animation
export const animateAIPanelSlideOut = (element: HTMLElement): void => {
  gsap.to(element, {
    x: '100%',
    duration: 0.3,
    ease: "power2.in"
  });
};

// Notification animation
export const animateNotification = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { y: -50, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.3, 
      ease: "power2.out",
      onComplete: () => {
        gsap.to(element, {
          opacity: 0,
          y: -10,
          delay: 3,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  );
};

// Pulse animation for elements
export const pulsate = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { scale: 1 },
    { 
      scale: 1.05, 
      duration: 0.5, 
      repeat: -1, 
      yoyo: true, 
      ease: "sine.inOut" 
    }
  );
};

// Button click effect
export const buttonClickEffect = (element: HTMLElement): void => {
  gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    onComplete: () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(2)"
      });
    }
  });
};

// Shimmer effect for loading states
export const shimmerEffect = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { backgroundPosition: "-200% 0" },
    { 
      backgroundPosition: "200% 0", 
      duration: 1.5, 
      repeat: -1, 
      ease: "linear" 
    }
  );
};

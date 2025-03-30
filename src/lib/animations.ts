
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

// Content highlight animation
export const animateContentHighlight = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
    { 
      backgroundColor: 'rgba(59, 130, 246, 0)', 
      duration: 0.8, 
      ease: "power2.inOut" 
    }
  );
};

// AI suggestion appearance
export const animateAISuggestion = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { opacity: 0, height: 0 },
    { opacity: 1, height: 'auto', duration: 0.3, ease: "power2.out" }
  );
};

// Typing indicator animation
export const setupTypingIndicator = (element: HTMLElement): void => {
  const dots = element.querySelectorAll('span');
  dots.forEach((dot, index) => {
    dot.style.setProperty('--dot-index', index.toString());
  });
};

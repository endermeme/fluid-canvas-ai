
import React from 'react';

export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = true
): string => {
  const basePrompt = `
    Create an interactive HTML game based on this prompt: "${topic}"

    STRICT CODE GENERATION REQUIREMENTS:
    - Produce fully functional HTML, CSS, and JavaScript code
    - Use modern JavaScript (ES6+) without external libraries
    - Implement proper event listeners and game mechanics
    - Ensure clean, readable, and self-explanatory code
    - Use meaningful variable and function names
    - Break down complex logic into focused functions
    - Maintain clean, concise code structure
    - Prioritize code readability and performance
    - Implement error handling gracefully
    - Ensure cross-browser compatibility
    - Create responsive design for various screen sizes
    - Avoid unnecessary global variables
    - Use semantic HTML5 elements
    - Implement proper game state management
    
    PERFORMANCE AND BEST PRACTICES:
    - Use requestAnimationFrame for smooth animations
    - Optimize memory usage and prevent memory leaks
    - Handle user interactions efficiently
    - Implement proper input validation
    - Create intuitive user experience
    - Use local storage for persistent game state if needed

    ${useCanvas ? `
    CANVAS RENDERING REQUIREMENTS:
    - Use HTML5 Canvas for advanced graphics
    - Implement efficient rendering techniques
    - Handle canvas resizing dynamically
    - Create smooth, performant animations
    - Use sprite-based rendering when appropriate
    - Optimize canvas drawing operations` : ''}

    GAME STRUCTURE:
    - Clear initialization function
    - Modular game loop
    - Separate update and render functions
    - Implement game state tracking
    - Create reusable game object methods
    - Handle game start, progress, and end states

    OUTPUT FORMAT:
    Respond ONLY with complete, runnable HTML code for the game.
  `;

  return basePrompt;
};

export const getCanvasInstructions = (): string => {
  return `
    Canvas Game Development Guidelines:
    1. Efficient game loop implementation
    2. Dynamic canvas resizing
    3. Precise collision detection
    4. Optimized sprite animations
    5. State management techniques
    6. Performance-focused rendering
  `;
};


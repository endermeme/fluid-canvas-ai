
/**
 * Builds a simple prompt for generating HTML games
 * @param topic The topic of the game
 * @param useCanvas Whether to use canvas mode for HTML game generation
 * @returns Complete prompt string
 */
export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = true // Default to canvas mode
): string => {
  return `
    Create an interactive HTML game based on this prompt: "${topic}"

    Your response should be a complete HTML file that includes CSS and JavaScript.
    
    IMPORTANT JAVASCRIPT REQUIREMENTS:
    - All JavaScript code MUST be fully functional without external libraries
    - Implement proper event listeners and game functionality
    - Use proper JavaScript scope and avoid global variables when possible
    - Ensure all interactive elements have proper event handlers
    - Include a scoring system that works correctly
    - Use requestAnimationFrame for animations if needed
    - Make sure all JavaScript references to HTML elements work correctly

    ${useCanvas ? `
    HTML5 CANVAS REQUIREMENTS:
    - Use HTML5 Canvas as the primary rendering approach for better graphics and animations
    - Implement proper canvas context (2d) initialization
    - Create a game loop with requestAnimationFrame
    - Handle canvas resizing properly for different screen sizes
    - Implement mouse/touch events specifically for canvas elements
    - Draw and update all game elements on the canvas
    - Clear the canvas before each frame redraw
    ` : ''}
    
    ADDITIONAL GUIDELINES:
    - Make the game visually appealing with proper styling
    - Include clear game instructions for the player
    - Implement proper gameplay feedback (sounds, visual effects)
    - Ensure all game elements are positioned properly
    - Make sure the game works on all screen sizes
    - Add proper error handling

    TEST YOUR CODE LOGIC:
    - Verify all functions are called correctly
    - Check that all event listeners work
    - Ensure variables are properly initialized
    - Verify game state changes correctly
    - Make sure the scoring system works

    RESPOND ONLY WITH THE COMPLETE HTML CODE.
  `;
};

/**
 * Gets specific instructions for Canvas-based HTML5 games
 * @returns Canvas-specific instructions as a string
 */
export const getCanvasInstructions = (): string => {
  return `Use HTML5 Canvas for better graphics and animations with proper game loop implementation.`;
};

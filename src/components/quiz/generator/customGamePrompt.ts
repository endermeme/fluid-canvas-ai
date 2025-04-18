
export interface GamePromptOptions {
  topic: string;
  useCanvas?: boolean;
  difficulty?: string;
  timeLimit?: number;
  questionCount?: number;
}

/**
 * Generate a prompt for custom game generation
 */
export function generateCustomGamePrompt(options: GamePromptOptions): string {
  const { topic, useCanvas = true, difficulty = 'medium', timeLimit = 120, questionCount = 5 } = options;
  
  // Base prompt that works for any game type
  let prompt = `Create an interactive educational game about "${topic}" with the following specifications:
    - Difficulty level: ${difficulty}
    - Time limit: ${timeLimit} seconds
    - Number of questions/items: ${questionCount}
    - The game must be engaging, educational, and visually appealing
    - Include clear instructions for the player
    - Implement a scoring system
    - Display the final score when the game ends`;
  
  // Add canvas-specific instructions if enabled
  if (useCanvas) {
    prompt += `
    - Use HTML5 Canvas for rendering
    - Implement smooth animations and transitions
    - Create responsive canvas that adapts to different screen sizes
    - Use requestAnimationFrame for the game loop
    - Implement efficient collision detection if needed
    - The canvas should be the main game area`;
  } else {
    prompt += `
    - Use standard HTML, CSS, and JavaScript (no Canvas)
    - Make the UI responsive and accessible
    - Use DOM manipulation for game elements
    - Implement transitions and animations with CSS`;
  }
  
  // Add requirements for the output format
  prompt += `
    
  The output should be complete, valid HTML5 that can be directly embedded in an iframe, with all CSS and JavaScript included inline. The game must work standalone without external dependencies.
  
  Format the response as a complete HTML file with all necessary CSS and JavaScript embedded.`;
  
  return prompt;
}

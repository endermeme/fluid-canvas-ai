
/**
 * Builds a simple prompt for generating HTML games
 * @param topic The topic of the game
 * @param useCanvas Whether to use canvas mode for HTML game generation
 * @returns Complete prompt string
 */
export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = false
): string => {
  return `
    Create a simple interactive game based on this prompt: "${topic}"
    
    Return your response in this JSON format:
    {
      "title": "Game Title",
      "content": "<!DOCTYPE html><html>...</html>"
    }
    
    Guidelines:
    - The content should be a complete HTML document with inline CSS and JavaScript
    - Make the game simple but fun to play
    - Focus on clean, basic JavaScript that works reliably
    - Ensure the game works on all screen sizes (responsive)
    - Avoid complex animations that might lag
    - Keep the interface clean and simple
    ${useCanvas ? '- Use HTML5 Canvas for rendering the game visual elements' : ''}
    
    Return ONLY the JSON object with the title and content properties.
  `;
};

/**
 * Gets specific instructions for Canvas-based HTML5 games
 * @returns Canvas-specific instructions as a string
 */
export const getCanvasInstructions = (): string => {
  return `Use HTML5 Canvas for better graphics and animations.`;
};

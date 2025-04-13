
import { GameSettingsData } from '../types';

/**
 * Builds a prompt for generating games in JSON format
 * @param topic The topic of the game
 * @param useCanvas Whether to use canvas mode for HTML game generation
 * @returns Complete prompt string
 */
export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = false
): string => {
  return `
    Create an interactive HTML game based on this prompt: "${topic}"

    IMPORTANT: Return your response as a JSON object with this structure:
    {
      "title": "Game Title",
      "content": "<!DOCTYPE html><html>... complete HTML code including all CSS and JavaScript ...</html>"
    }

    Guidelines for the HTML content:
    - Create a fully functional, self-contained game with HTML, CSS, and JavaScript
    - Make sure all JavaScript is properly wrapped in <script> tags
    - Use proper event handling (addEventListener)
    - Include all required CSS in <style> tags
    - Ensure the game is responsive and works on different screen sizes
    ${useCanvas ? `
    - Use HTML5 Canvas as the primary rendering approach for better graphics and animations
    - Implement proper game loop with requestAnimationFrame
    - Handle canvas responsiveness properly
    ` : ''}
    
    RESPOND ONLY WITH VALID JSON matching the structure above. No markdown, no explanations.
  `;
};

/**
 * Gets specific instructions for Canvas-based HTML5 games
 * @returns Canvas-specific instructions as a string
 */
export const getCanvasInstructions = (): string => {
  return `Use HTML5 Canvas for better graphics and animations.`;
};

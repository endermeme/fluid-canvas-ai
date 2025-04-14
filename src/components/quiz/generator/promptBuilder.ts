
import { GameSettingsData } from '../types';

/**
 * Builds a simple prompt for generating HTML games
 * @param topic The topic of the game
 * @param useCanvas Whether to use canvas mode for HTML game generation
 * @returns Complete prompt string
 */
export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = true // Changed default to true
): string => {
  return `
    Create an interactive HTML game based on this prompt: "${topic}"

    Your response should be a complete HTML file that includes CSS and JavaScript.
    
    ${useCanvas ? `
    Please use HTML5 Canvas as the primary rendering approach for better graphics and animations.
    Implement proper game loop with requestAnimationFrame and handle canvas responsiveness.
    ` : ''}
    
    RESPOND ONLY WITH THE HTML CODE.
  `;
};

/**
 * Gets specific instructions for Canvas-based HTML5 games
 * @returns Canvas-specific instructions as a string
 */
export const getCanvasInstructions = (): string => {
  return `Use HTML5 Canvas for better graphics and animations.`;
};


import { GameSettingsData } from '../types';

/**
 * Builds a prompt for OpenAI to generate HTML games
 * @param topic The topic of the game
 * @param useCanvas Whether to use canvas mode for HTML game generation
 * @returns Complete prompt string
 */
export const buildOpenAIPrompt = (
  topic: string,
  useCanvas: boolean = false
): string => {
  return `
    Create an interactive HTML game based on this prompt: "${topic}"

    Requirements:
    - Create a fun, interactive game that works in a browser
    - Use HTML, CSS, and JavaScript only (no external libraries)
    - The game should be fully self-contained in a single HTML file
    - Make the game visually appealing and user-friendly
    - Include a title, instructions, and scoring system
    - Handle all user interactions and game logic
    - Make sure the game is responsive and works on different screen sizes
    ${useCanvas ? getCanvasInstructions() : ''}

    Important: Return ONLY valid HTML code as a string, with no additional formatting or explanation.
  `;
};

/**
 * Gets specific instructions for Canvas-based HTML5 games
 * @returns Canvas-specific instructions as a string
 */
export const getCanvasInstructions = (): string => {
  return `- Use HTML5 Canvas for better graphics and animations
- Implement proper game loop with requestAnimationFrame
- Handle canvas responsiveness for different screen sizes`;
};

/**
 * Builds a simple prompt for generating HTML games (legacy Gemini function)
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

    Your response should be a complete HTML file that includes CSS and JavaScript.
    
    ${useCanvas ? `
    Please use HTML5 Canvas as the primary rendering approach for better graphics and animations.
    Implement proper game loop with requestAnimationFrame and handle canvas responsiveness.
    ` : ''}
    
    RESPOND ONLY WITH THE HTML CODE.
  `;
};

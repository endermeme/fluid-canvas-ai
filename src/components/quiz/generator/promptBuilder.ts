
import { GameSettingsData } from '../types';
import { getGameSpecificInstructions, getSettingsPrompt } from './gameInstructions';
import { getImageInstructions } from './imageInstructions';

/**
 * Builds a complete prompt for the Gemini API based on game parameters
 * @param topic The topic of the game
 * @param gameTypeId Optional game type ID
 * @param settings Optional game settings
 * @returns Complete prompt string for Gemini API
 */
export const buildGeminiPrompt = (
  topic: string, 
  gameTypeId: string | undefined, 
  settings?: GameSettingsData
): string => {
  const gameSpecificInstructions = getGameSpecificInstructions(gameTypeId, topic);
  const settingsPrompt = getSettingsPrompt(settings);
  const imageInstructions = getImageInstructions();

  return `
    # Interactive Educational Game Generator – All-in-One HTML File

    ## Objective
    Generate a fully self-contained interactive educational game based on the topic: "${topic}".

    ---

    ## Core Requirements
    - All in **one HTML file** (HTML, CSS, JS inline)
    - **No external libraries**, only **Vanilla JavaScript**
    - Responsive layout (works on desktop & mobile)
    - Valid HTML5 structure
    - JavaScript must run after \`DOMContentLoaded\`
    - Use \`try-catch\` and validate all inputs

    ---

    ## Game Logic
    - Interactive game format with clear instructions
    - Track score and display final result with a performance message
    - Ensure responsive design works on all devices
    - Provide feedback to user actions
    - Create an engaging and educational experience

    ---

    ${gameSpecificInstructions}

    ---

    ## Image Instructions
    - NEVER include actual image URLs in your response
    - For games requiring images, ONLY provide specific search terms for each item
    - DO NOT use 'imageUrl' in your JSON - instead use 'imageSearchTerm'
    - Example format for image questions:
      \`\`\`json
      {
        "imageSearchTerm": "red apple fruit detailed",
        "answer": "Apple",
        "options": ["Banana", "Apple", "Orange", "Grape"],
        "hint": "Keeps the doctor away"
      }
      \`\`\`
    - Make search terms very specific (e.g., "red apple fruit" not just "apple")
    - Our system will handle all image fetching using your search terms

    ${imageInstructions}

    ---

    ## Common Mistakes to Avoid
    - Don't use broken or undefined variables
    - Ensure all event listeners are properly attached
    - Avoid unnecessary DOM manipulation or deeply nested loops
    - Prevent layout overflow or broken UI on small screens
    - Always handle errors with \`try-catch\`
    - Escape all special characters properly in JSON output

    ---

    ${settingsPrompt}

    ---

    ## Output Format
    Return a **valid JSON object**:

    \`\`\`json
    {
      "title": "Game Title",
      "description": "Short game description",
      "content": "A full, escaped HTML document string (\\\\", \\\\\\\\ escaped properly)"
    }
    \`\`\`
  `;
};


import { GameSettingsData } from '../types';

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
  const settingsPrompt = getSettingsPrompt(settings);

  return `
    # Interactive Game Generator – Complete HTML File

    ## Objective
    Generate a fully self-contained interactive game based on the topic: "${topic}".

    ---

    ## Technical Requirements
    - All code must be in **one HTML file** (HTML, CSS, JS inline)
    - Use only **Vanilla JavaScript** without external libraries
    - Create responsive layout that works on all devices
    - Use valid HTML5 structure
    - JavaScript should run after DOMContentLoaded
    - Handle errors and validate all inputs

    ---

    ## Game Design Guidelines
    - Create an engaging, interactive experience related to "${topic}"
    - Include clear instructions for the player
    - Track score or progress and show final results
    - Provide feedback for user actions
    - Design for both desktop and mobile devices
    - Focus on educational value and entertainment

    ---

    ## Image Guidelines
    - For images, use 'imageSearchTerm' format in your data
    - Make search terms specific (e.g., "red apple fruit detailed" not just "apple")
    - Example format for questions with images:
      \`\`\`json
      {
        "imageSearchTerm": "red apple fruit detailed",
        "answer": "Apple",
        "options": ["Banana", "Apple", "Orange", "Grape"]
      }
      \`\`\`
    - Our system will handle all image fetching automatically

    ---

    ## Technical Best Practices
    - Avoid undefined variables or broken references
    - Ensure proper event listener attachment
    - Create efficient code without deep nesting
    - Prevent UI overflow on small screens
    - Handle errors gracefully
    - Escape special characters properly

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

/**
 * Generates settings prompt based on game settings
 * @param settings The game settings
 * @returns string with settings prompt
 */
const getSettingsPrompt = (settings?: GameSettingsData): string => {
  if (!settings) return '';
  
  return `
    Create with these settings:
    - Difficulty: ${settings.difficulty}
    - Number of items/challenges: ${settings.questionCount}
    - Time per action: ${settings.timePerQuestion} seconds
    - Category: ${settings.category}
  `;
};

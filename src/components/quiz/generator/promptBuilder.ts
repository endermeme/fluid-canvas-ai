
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
    # 🎮 Interactive Education Game Generator – All-in-One HTML File

    ## 🎯 Objective
    Generate a fully self-contained interactive educational game based on the topic: "${topic}".

    ---

    ## ✅ Core Requirements
    - All in **one HTML file** (HTML, CSS, JS inline)
    - **No external libraries**, only **Vanilla JavaScript**
    - Responsive layout (works on desktop & mobile)
    - Valid HTML5 structure
    - JavaScript must run after \`DOMContentLoaded\`
    - Use \`try-catch\` and validate all inputs

    ---

    ## 🎓 Game Logic
    - Multiple-choice quiz format
    - One correct answer per question
    - Shuffle answer options randomly on load
    - Do **not** show correct answers before selection
    - Mark the correct answer with \`data-correct="true"\` or \`.correct\`
    - Show **instant feedback** (right/wrong + highlight correct)
    - Track score and display final result with a performance message

    ---

    ${gameSpecificInstructions}

    ---

    ## 🖼️ Image Instructions (CRITICAL)
    - NEVER include actual image URLs in your response
    - For games requiring images (like Pictionary), ONLY provide specific search terms for each item
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
    - Our system will handle all image fetching from Pixabay API using your search terms
    - Search terms should be in English for best results, even for non-English games

    ${imageInstructions}

    ---

    ## ⚠️ Common Mistakes to Avoid
    - Don't use broken or undefined variables
    - Ensure all event listeners are properly attached
    - Avoid unnecessary DOM manipulation or deeply nested loops
    - Prevent layout overflow or broken UI on small screens
    - Always handle errors with \`try-catch\`
    - Escape all special characters properly in JSON output
    - NEVER include actual image URLs in your response

    ---

    ${settingsPrompt}

    ---

    ## 📤 Output Format
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

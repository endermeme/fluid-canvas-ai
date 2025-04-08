
import { GameSettingsData } from '../types';
import { getGameSpecificInstructions, getSettingsPrompt } from './gameInstructions';
import { getImageInstructions } from './imageInstructions';

/**
 * Builds a complete prompt for the Gemini API based on game parameters
 * @param topic The topic of the game
 * @param gameTypeId Optional game type ID
 * @param settings Optional game settings
 * @param requiresImages Whether the game requires images
 * @returns Complete prompt string for Gemini API
 */
export const buildGeminiPrompt = (
  topic: string, 
  gameTypeId: string | undefined, 
  settings?: GameSettingsData,
  requiresImages: boolean = false
): string => {
  const gameSpecificInstructions = getGameSpecificInstructions(gameTypeId, topic);
  const imageInstructions = requiresImages ? getImageInstructions() : '';
  const settingsPrompt = getSettingsPrompt(settings);

  return `
# 🎮 Interactive Education Game Generator – All-in-One HTML File

## 🎯 Objective
Generate a fully self-contained interactive educational game based on the topic: \`${topic}\`.

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

${gameSpecificInstructions}
${imageInstructions}
${settingsPrompt}

---

## ⚠️ Common Mistakes to Avoid
- Don't use broken or undefined variables
- Ensure all event listeners are properly attached
- Avoid unnecessary DOM manipulation or deeply nested loops
- Prevent layout overflow or broken UI on small screens
- Always handle errors with \`try-catch\`
- Escape all special characters properly in JSON output

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

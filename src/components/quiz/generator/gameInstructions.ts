
import { GameSettingsData } from '../types';

/**
 * Generates game-specific instructions based on the game type
 * @param gameTypeId The ID of the game type
 * @param topic The topic of the game
 * @returns string with game-specific instructions
 */
export const getGameSpecificInstructions = (gameTypeId: string | undefined, topic: string): string => {
  switch(gameTypeId) {
    case 'quiz':
      return `
## 📝 Quiz Format
- Create clear multiple-choice questions with 4 options (A, B, C, D)
- Each question must have exactly one correct answer
- Use clear button UI that works well on mobile devices
- Show feedback immediately after user selects an answer
      `;
    
    case 'flashcards':
      return `
## 🔄 Flashcard Format
- Create two-sided cards with question/term on front, answer on back
- Add simple flip animation when clicked
- Include navigation buttons (Next, Previous)
- Allow users to mark cards as "Known" or "Review Again"
      `;
    
    case 'matching':
      return `
## 🔀 Matching Format
- Create up to 8 pairs of related terms/definitions
- Display two columns: terms and definitions
- Use drag-drop or sequential clicking to match pairs
- Highlight matched pairs and track score
      `;
    
    case 'truefalse':
      return `
## ✓✗ True/False Format
- Create clear statements related to "${topic}"
- Each statement must be clearly true or false (not ambiguous)
- Use large, tap-friendly buttons for True/False
- Show explanation after user selects answer
      `;
    
    default:
      return `
## 🎯 General Game Format
- Create an interactive game related to "${topic}"
- Use intuitive UI with clear instructions
- Optimize for both desktop and mobile
- Track and display score/progress
      `;
  }
};

/**
 * Generates settings prompt based on game settings
 * @param settings The game settings
 * @returns string with settings prompt
 */
export const getSettingsPrompt = (settings?: GameSettingsData): string => {
  if (!settings) return '';
  
  return `
## ⚙️ Game Settings
- Difficulty: ${settings.difficulty}
- Questions: ${settings.questionCount}
- Time per question: ${settings.timePerQuestion} seconds
- Category: ${settings.category}
  `;
};

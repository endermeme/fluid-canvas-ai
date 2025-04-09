
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
      ## Instructions for Quiz Game
      
      - Create multiple-choice questions with 4 clear options
      - Each question should have exactly one correct answer
      - Options should be clear and not ambiguous
      - Use clear button interface that works well on mobile
      - Show feedback immediately when player selects an answer
      - Count points and display final score at the end
      - Avoid unnecessary images
      `;
    
    case 'flashcards':
      return `
      ## Instructions for Flashcard Game
      
      - Create a set of cards with two sides: one showing question/word, the other showing the answer
      - Use simple animation to flip card when user clicks/taps
      - Each card should display one concept, not too much information
      - Include clear "Next" and "Previous" buttons for navigation
      - Add a "Flip Card" button to see the answer
      - Include option for users to mark cards as "Known" or "Need to Review"
      - Ensure cards have appropriate size on both large and small screens
      `;
    
    case 'matching':
      return `
      ## Instructions for Matching Game
      
      - Create pairs of words/concepts and corresponding definitions
      - Clearly display two columns: one with terms, one with definitions
      - Use drag/drop or sequential clicks to connect pairs
      - Correct pairs should be connected with a line or change color
      - Pairs should be closely related to the topic "${topic}"
      - Design responsively for small screens
      - Update score and display final result
      `;
    
    case 'memory':
      return `
      ## Instructions for Memory Game
      
      - Create a grid of cards that can be flipped
      - Each card has a matching pair
      - Cards are initially face down
      - Player flips two cards at a time
      - If cards match, they stay face up
      - If not, they flip back down
      - Game ends when all pairs are found
      - Track number of attempts and time
      `;
    
    case 'wordsearch':
      return `
      ## Instructions for Word Search Game
      
      - Create a grid of letters (8x8 for easy, 12x12 for medium, 15x15 for hard)
      - Hide 7-15 words related to "${topic}"
      - Words can be arranged horizontally, vertically, and diagonally
      - Display list of words to find next to the grid
      - Allow marking words by clicking first and last letter
      - Found words should be highlighted and crossed off the list
      - Ensure spacing between cells is large enough for touch devices
      `;
    
    case 'pictionary':
      return `
      ## Instructions for Picture Guessing Game
      
      - Use real images related to "${topic}" (see "Image Processing" section)
      - Create 5-10 questions to guess words based on images
      - Each question should have one image related to the topic
      - Allow user input in a text field
      - Provide hints if user struggles
      - Answers should not be case-sensitive
      - Display score and final result
      `;
    
    case 'truefalse':
      return `
      ## Instructions for True/False Game
      
      - Create clear statements about "${topic}"
      - Each statement must be clearly true or false, not ambiguous
      - Use two large, easy-to-tap buttons: "True" and "False"
      - Show brief explanation after user chooses
      - Use intuitive colors (green for correct, red for incorrect)
      - Count player's score and show total
      - Optimize for both desktop and mobile
      `;
    
    case 'interactive':
    default:
      return `
      ## Instructions for Interactive Educational Game
      
      - Create an engaging, interactive game related to "${topic}"
      - Use clear, intuitive controls and instructions
      - Provide immediate feedback for user actions
      - Include scoring or progress tracking
      - Make design responsive for all devices
      - Focus on educational value while maintaining fun
      - Ensure game mechanics are simple to understand
      - Use appropriate visual elements when needed
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
    Create with these settings:
    - Difficulty: ${settings.difficulty}
    - Number of questions/challenges: ${settings.questionCount}
    - Time per question/challenge: ${settings.timePerQuestion} seconds
    - Category: ${settings.category}
  `;
};

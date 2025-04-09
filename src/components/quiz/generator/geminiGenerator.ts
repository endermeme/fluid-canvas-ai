
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { buildGeminiPrompt } from './promptBuilder';
import { parseGeminiResponse } from './responseParser';

/**
 * Generates specialized prompts for different game types
 * @param gameType Type of the game
 * @param topic Game topic
 * @param settings Game settings
 * @returns Specialized prompt for the given game type
 */
const getSpecializedPrompt = (gameType: string, topic: string, settings?: GameSettingsData): string => {
  const difficulty = settings?.difficulty || 'medium';
  const timeLimit = settings?.timePerQuestion || 30;
  
  switch(gameType) {
    case 'matching':
      return `
Create a high-quality matching pairs game about "${topic}" with the following specifications:

1. Structure:
   - Create exactly 8-10 pairs of matching concepts
   - Left side and right side items must clearly relate to each other
   - For ${difficulty} difficulty: ${difficulty === 'easy' ? 'use simple, direct pairs that are easy to match' : difficulty === 'medium' ? 'include some pairs that require more thought but are still clearly related' : 'create challenging pairs that require deeper knowledge'}
   - Arrange words in a balanced horizontal layout with 4-5 items per row

2. Layout:
   - Words must be arranged to minimize overlapping
   - Ensure all words fit comfortably on screen without wrapping (max ${difficulty === 'easy' ? '10' : difficulty === 'medium' ? '15' : '20'} characters)
   - Items should be properly aligned with consistent spacing
   - For longer words, provide shorter alternatives or break complex concepts into simpler terms

3. Display Requirements:
   - Maximum character length per item: ${difficulty === 'easy' ? '10' : difficulty === 'medium' ? '15' : '20'} characters
   - Items should be evenly distributed in the grid
   - No special characters that could cause display issues
   - Items must be positioned in a way that's visually clear and balanced

4. Game Mechanics:
   - Time limit: ${timeLimit} seconds
   - Difficulty progression: Items get gradually more challenging
   - Scoring system: 10 points per correct match, -2 points for incorrect tries
   - Layout: ${settings?.layout || 'horizontal'} (items arranged ${settings?.layout === 'vertical' ? 'in columns' : settings?.layout === 'grid' ? 'in a grid pattern' : 'in rows'})

JSON Format Example:
{
  "title": "Matching Game: ${topic}",
  "description": "Match related concepts about ${topic}",
  "pairs": [
    {"left": "Term 1", "right": "Definition 1"},
    {"left": "Term 2", "right": "Definition 2"}
  ],
  "settings": {
    "timeLimit": ${timeLimit},
    "shuffleItems": true,
    "difficulty": "${difficulty}",
    "layout": "${settings?.layout || 'horizontal'}"
  }
}

Make sure each item is unique, with no duplicate items in either column. Left items should NOT repeat, right items should NOT repeat. Return ONLY valid JSON without additional text.
`;

    case 'wordsearch':
      return `
Create a word search puzzle about "${topic}" with the following specifications:

1. Grid:
   - Size: ${difficulty === 'easy' ? '8x8' : difficulty === 'medium' ? '10x10' : '12x12'} letters
   - Words placed in ${difficulty === 'easy' ? 'horizontal and vertical' : difficulty === 'medium' ? 'horizontal, vertical, and diagonal' : 'all possible'} directions
   - ${difficulty === 'hard' ? 'Include backwards words for added challenge' : ''}
   - Ensure letters are properly spaced and aligned in a perfect grid

2. Words:
   - Include ${difficulty === 'easy' ? '6-8' : difficulty === 'medium' ? '8-10' : '10-12'} words related to "${topic}"
   - Word length: ${difficulty === 'easy' ? '3-5' : difficulty === 'medium' ? '4-7' : '5-10'} letters
   - No special characters, spaces, or diacritics in words
   - Words should be meaningful and educational related to the topic
   - Words must actually fit in the grid with proper directions

3. Difficulty:
   - ${difficulty === 'easy' ? 'Words are placed in straightforward directions with minimal overlaps' : difficulty === 'medium' ? 'Some word overlaps and mixed directions' : 'Complex word arrangements with multiple overlaps and all possible directions'}
   - Fill remaining spaces with random letters that don't accidentally form other words
   - Ensure the grid is challenging but solvable

4. Game Mechanics:
   - Time limit: ${timeLimit} seconds
   - Words are marked as found when correctly identified
   - Scoring: 10 points per word found

JSON Format Example:
{
  "title": "Word Search: ${topic}",
  "description": "Find words related to ${topic} hidden in the grid",
  "words": [
    {"word": "EXAMPLE", "found": false},
    {"word": "SAMPLE", "found": false}
  ],
  "grid": [
    ["A", "B", "C", "D", "E", "F", "G", "H"],
    ["I", "J", "K", "L", "M", "N", "O", "P"]
  ],
  "settings": {
    "timeLimit": ${timeLimit},
    "showWordList": true,
    "difficulty": "${difficulty}"
  }
}

CRITICALLY IMPORTANT: The grid MUST contain all the words listed, properly placed according to the rules. Double-check that each word can actually be found in your grid. Return ONLY valid JSON without additional text.
`;

    case 'quiz':
      return `
Create a multiple-choice quiz about "${topic}" with the following specifications:

1. Questions:
   - Create ${settings?.questionCount || 10} distinct, educational questions about "${topic}"
   - Questions must be clear, concise, and cover different aspects of the topic
   - For ${difficulty} difficulty: ${difficulty === 'easy' ? 'focus on basic facts and definitions' : difficulty === 'medium' ? 'include some analytical questions requiring deeper understanding' : 'create challenging questions that test thorough knowledge'}
   - No duplicate or highly similar questions

2. Answer Options:
   - Each question must have exactly 4 options (A, B, C, D)
   - One clearly correct answer per question
   - Incorrect options should be plausible but clearly wrong when you know the material
   - No ambiguous or partially correct options
   - Options should be roughly the same length to avoid giving clues

3. Difficulty Progression:
   - Questions should gradually increase in difficulty
   - First few questions should be accessible to beginners
   - ${difficulty !== 'easy' ? 'Later questions should challenge even knowledgeable players' : 'Keep all questions at an introductory level'}

4. Game Mechanics:
   - Time per question: ${timeLimit} seconds
   - Scoring: 10 points per correct answer, no points for incorrect answers
   - Provide brief explanations for correct answers to enhance learning

JSON Format Example:
{
  "title": "Quiz: ${topic}",
  "description": "Test your knowledge about ${topic}",
  "questions": [
    {
      "question": "What is X?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2,
      "explanation": "Option C is correct because..."
    }
  ],
  "settings": {
    "timePerQuestion": ${timeLimit},
    "shuffleQuestions": true,
    "shuffleOptions": true,
    "difficulty": "${difficulty}"
  }
}

Return ONLY valid JSON without additional text. Ensure correctAnswer is a NUMBER (0-3) representing the index of the correct option.
`;

    case 'flashcards':
      return `
Create a set of educational flashcards about "${topic}" with the following specifications:

1. Content:
   - Create ${settings?.questionCount || 10} flashcards related to "${topic}"
   - Front side should contain a term, concept, or question
   - Back side should contain definition, explanation, or answer
   - For ${difficulty} difficulty: ${difficulty === 'easy' ? 'include basic terms and short definitions' : difficulty === 'medium' ? 'cover more complex concepts with detailed explanations' : 'include advanced material with comprehensive explanations'}
   - Content must be accurate, educational, and age-appropriate

2. Format:
   - Keep front side concise (max 20 words)
   - Back side can be more detailed but still focused (max 50 words)
   - Add hints where appropriate to help with recall
   - Ensure proper formatting with no unusual characters

3. Educational Value:
   - Cards should build on each other to create a comprehensive understanding
   - Include important facts, dates, concepts, formulas as appropriate for the topic
   - Ensure information is accurate and educational
   - Progressive difficulty from basic to more advanced concepts

4. Game Mechanics:
   - Auto-flip option after ${settings?.timePerQuestion || 5} seconds
   - Option to mark cards as "known" or "needs review"
   - Shuffle capability to randomize card order

JSON Format Example:
{
  "title": "Flashcards: ${topic}",
  "description": "Learn about ${topic} with these flashcards",
  "cards": [
    {
      "front": "Term or question",
      "back": "Definition or answer",
      "hint": "Optional hint to help remember"
    }
  ],
  "settings": {
    "autoFlip": false,
    "flipTime": ${settings?.timePerQuestion || 5},
    "shuffleCards": true,
    "difficulty": "${difficulty}"
  }
}

Return ONLY valid JSON without additional text. Ensure all cards have both front and back content.
`;

    // Add more game types as needed
    default:
      // Use the standard prompt builder for other game types
      return buildGeminiPrompt(topic, gameType, settings);
  }
};

/**
 * Generates a game using Google's Gemini API
 * @param model Gemini model instance
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @returns MiniGame object or null if generation fails
 */
export const generateWithGemini = async (
  model: any, 
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  // Get game type from topic to provide better context for the AI
  const gameType = getGameTypeByTopic(topic);
  
  console.log(`🔷 Gemini: Starting game generation for "${topic}" - Type: ${gameType?.name || "Not specified"}`);
  console.log(`🔷 Gemini: Settings: ${JSON.stringify(settings || {})}`);
  
  // Get specialized prompt if available
  let prompt;
  if (gameType?.id) {
    prompt = getSpecializedPrompt(gameType.id, topic, settings);
  } else {
    // Fall back to standard prompt
    prompt = buildGeminiPrompt(topic, gameType?.id, settings);
  }

  try {
    console.log("🔷 Gemini: Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return parseGeminiResponse(text, topic);
  } catch (error) {
    console.error("❌ Gemini: Error generating with Gemini:", error);
    throw error;
  }
};

/**
 * Attempts to generate a game with Gemini, with retries on failure
 * @param model Gemini model instance
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @param retryCount Current retry count (internal use)
 * @returns MiniGame object or null if all retries fail
 */
export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 2; // Reduced number of retries
  
  if (retryCount >= maxRetries) {
    console.log(`⚠️ Gemini: Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    console.log(`⏳ Gemini: Attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithGemini(model, topic, settings);
  } catch (error) {
    console.error(`❌ Gemini: Attempt ${retryCount + 1} failed:`, error);
    // Wait a bit before retrying
    const waitTime = (retryCount + 1) * 1000;
    console.log(`⏳ Gemini: Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};

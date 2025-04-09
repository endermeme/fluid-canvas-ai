
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

2. Layout:
   - Words must be arranged in a way that's suitable for a grid layout
   - Ensure all words fit comfortably on screen without wrapping
   - For longer words, provide shorter alternatives or break complex concepts into simpler terms

3. Display Requirements:
   - Maximum character length per item: ${difficulty === 'easy' ? '15' : difficulty === 'medium' ? '20' : '25'} characters
   - Items should be properly spaced and aligned
   - No special characters that could cause display issues

4. Game Mechanics:
   - Time limit: ${timeLimit} seconds
   - Difficulty progression: Items get gradually more challenging
   - Scoring system: 10 points per correct match, -5 points for incorrect tries

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
    "difficulty": "${difficulty}"
  }
}

Make sure each item is unique, with no duplicate items in either column. Return ONLY valid JSON without additional text.
`;

    case 'wordsearch':
      return `
Create a word search puzzle about "${topic}" with the following specifications:

1. Grid:
   - Size: ${difficulty === 'easy' ? '8x8' : difficulty === 'medium' ? '10x10' : '12x12'} letters
   - Words placed in horizontal and vertical directions only for ${difficulty === 'easy' ? 'easy difficulty' : 'better readability'}
   - ${difficulty !== 'easy' ? 'Include diagonal word placements for added challenge' : ''}
   - Ensure letters are properly spaced and aligned

2. Words:
   - Include ${difficulty === 'easy' ? '5-7' : difficulty === 'medium' ? '8-10' : '10-12'} words related to "${topic}"
   - Word length: ${difficulty === 'easy' ? '3-5' : difficulty === 'medium' ? '4-7' : '5-10'} letters
   - No special characters or spaces in words
   - Words should be meaningful and educational related to the topic

3. Difficulty:
   - ${difficulty === 'easy' ? 'Words are placed in straightforward directions with minimal overlaps' : difficulty === 'medium' ? 'Some word overlaps and mixed directions' : 'Complex word arrangements with multiple overlaps and all possible directions'}
   - Fill remaining spaces with random letters that don't accidentally form other words

4. Game Mechanics:
   - Time limit: ${timeLimit * 10} seconds
   - Words are marked as found when correctly identified

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
    "timeLimit": ${timeLimit * 10},
    "showWordList": true,
    "difficulty": "${difficulty}"
  }
}

Ensure the grid actually contains all the words listed, properly placed. Return ONLY valid JSON without additional text.
`;

    case 'quiz':
      return `
Create a multiple-choice quiz about "${topic}" with the following specifications:

1. Questions:
   - Create ${settings?.questionCount || 10} distinct, educational questions about "${topic}"
   - Questions should be clear, concise, and cover different aspects of the topic
   - For ${difficulty} difficulty: ${difficulty === 'easy' ? 'focus on basic facts and definitions' : difficulty === 'medium' ? 'include some analytical questions requiring deeper understanding' : 'create challenging questions that test thorough knowledge'}

2. Answer Options:
   - Each question must have exactly 4 options (A, B, C, D)
   - One clearly correct answer per question
   - Incorrect options should be plausible but clearly wrong when you know the material
   - No ambiguous or partially correct options

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

Return ONLY valid JSON without additional text.
`;

    case 'flashcards':
      return `
Create a set of educational flashcards about "${topic}" with the following specifications:

1. Content:
   - Create ${settings?.questionCount || 10} flashcards related to "${topic}"
   - Front side should contain a term, concept, or question
   - Back side should contain definition, explanation, or answer
   - For ${difficulty} difficulty: ${difficulty === 'easy' ? 'include basic terms and short definitions' : difficulty === 'medium' ? 'cover more complex concepts with detailed explanations' : 'include advanced material with comprehensive explanations'}

2. Format:
   - Keep front side concise (max 25 words)
   - Back side can be more detailed but still focused (max 50 words)
   - Add hints where appropriate to help with recall

3. Educational Value:
   - Cards should build on each other to create a comprehensive understanding
   - Include important facts, dates, concepts, formulas as appropriate for the topic
   - Ensure information is accurate and educational

4. Game Mechanics:
   - Auto-flip option after ${settings?.timePerQuestion || 5} seconds
   - Option to mark cards as "known" or "needs review"

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

Return ONLY valid JSON without additional text.
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
  const maxRetries = 3; // Reduced number of retries
  
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
    const waitTime = (retryCount + 1) * 1500;
    console.log(`⏳ Gemini: Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};

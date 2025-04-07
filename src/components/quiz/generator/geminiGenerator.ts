
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { buildGeminiPrompt } from './promptBuilder';
import { parseGeminiResponse } from './responseParser';

/**
 * Generates content only using Google's Gemini API
 * @param model Gemini model instance
 * @param topic Topic for the game
 * @param gameType Type of game template to generate content for
 * @param settings Optional game settings
 * @returns Content object or null if generation fails
 */
export const generateContentWithGemini = async (
  model: any, 
  topic: string,
  gameType: string, 
  settings?: GameSettingsData
): Promise<any | null> => {
  // Get game type from topic to provide better context for the AI
  const gameTypeObj = getGameTypeByTopic(topic);
  const gameDescription = gameTypeObj ? gameTypeObj.description : "interactive learning game";
  
  console.log(`🔷 Gemini: Starting content generation for "${topic}" - Game template: ${gameType}`);
  console.log(`🔷 Gemini: Settings: ${JSON.stringify(settings || {})}`);
  
  // Build the complete prompt for content-only
  const prompt = buildContentPrompt(topic, gameType, settings);

  try {
    console.log("🔷 Gemini: Sending content request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return parseContentResponse(text);
  } catch (error) {
    console.error("❌ Gemini: Error generating content with Gemini:", error);
    throw error;
  }
};

/**
 * Builds a prompt specifically for generating game content
 */
const buildContentPrompt = (topic: string, gameType: string, settings?: GameSettingsData): string => {
  // Determine difficulty level
  const difficultyLevel = settings?.difficulty || 'medium';
  // Determine question count
  const questionCount = settings?.questionCount || 10;
  
  // Template-specific instructions based on game type
  let templateInstructions = '';
  
  switch(gameType) {
    case 'quiz':
      templateInstructions = `
        Create ${questionCount} multiple-choice questions about "${topic}".
        Each question should have 4 options with 1 correct answer.
        Format as a JSON array: 
        [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0, // Index of correct answer (0-3)
            "explanation": "Brief explanation"
          },
          // more questions...
        ]
      `;
      break;
    case 'matching':
      templateInstructions = `
        Create ${questionCount} matching pairs about "${topic}".
        Format as a JSON array: 
        [
          {
            "term": "Term to match",
            "definition": "Definition to match with the term",
            "hint": "Optional hint" 
          },
          // more pairs...
        ]
      `;
      break;
    case 'memory':
      templateInstructions = `
        Create ${questionCount} memory card pairs about "${topic}".
        Format as a JSON array: 
        [
          {
            "id": 1,
            "term": "Term for card 1",
            "definition": "Definition or matching item",
            "image": "https://direct-image-url.jpg" // Must provide a VALID, DIRECT image URL
          },
          // more cards...
        ]
      `;
      break;
    case 'flashcards':
      templateInstructions = `
        Create ${questionCount} flashcards about "${topic}".
        Format as a JSON array: 
        [
          {
            "front": "Question or term",
            "back": "Answer or definition",
            "hint": "Optional hint",
            "image": "https://direct-image-url.jpg" // Optional direct image URL
          },
          // more flashcards...
        ]
      `;
      break;
    case 'ordering':
      templateInstructions = `
        Create a sequence of ${questionCount} ordered items about "${topic}".
        Format as a JSON object: 
        {
          "title": "Title for this sequence",
          "description": "Description of what needs to be ordered",
          "items": [
            {
              "id": 1,
              "text": "First item in correct order",
              "order": 1,
              "image": "https://direct-image-url.jpg" // Optional direct image URL
            },
            // more items in correct order...
          ]
        }
      `;
      break;
    case 'wordsearch':
      templateInstructions = `
        Create a word search puzzle about "${topic}" with ${questionCount} words.
        Format as a JSON object: 
        {
          "title": "Word Search: ${topic}",
          "words": ["word1", "word2", "word3", ...],
          "hints": ["hint for word1", "hint for word2", ...],
          "images": ["https://direct-image-url1.jpg", "https://direct-image-url2.jpg", ...] // Optional direct image URLs for visual hints
        }
      `;
      break;
    case 'image-guess':
      templateInstructions = `
        Create ${questionCount} image guessing questions about "${topic}".
        For each term to guess, provide multiple direct image URLs.
        Format as a JSON array: 
        [
          {
            "term": "Word to be guessed",
            "images": [
              "https://direct-image-url1.jpg",
              "https://direct-image-url2.jpg"
            ],
            "hints": ["Hint 1", "Hint 2"]  // Optional progressive hints
          },
          // more items...
        ]
        
        IMPORTANT: All image URLs must be direct links to actual images (ending in .jpg, .png, etc.) that can be displayed in an <img> tag.
        You can use image sources from any website as long as they are direct image URLs.
      `;
      break;
    default:
      // Default to quiz format if game type not recognized
      templateInstructions = `
        Create ${questionCount} multiple-choice questions about "${topic}".
        Each question should have 4 options with 1 correct answer.
        Format as a JSON array: 
        [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0, // Index of correct answer (0-3)
            "explanation": "Brief explanation"
          },
          // more questions...
        ]
      `;
  }
  
  return `
    # Content Generation for Educational Game Template
    
    ## Topic
    ${topic}
    
    ## Game Template
    ${gameType}
    
    ## Difficulty Level
    ${difficultyLevel}
    
    ## Instructions
    ${templateInstructions}
    
    ## Important Requirements for Images
    - For any game templates that use images, you MUST provide direct image URLs that can be displayed in an <img> tag
    - Image URLs can be from ANY source, but must be directly accessible and valid
    - Each image URL must lead directly to an image file (typically ending in .jpg, .png, .gif, etc.)
    - You can use images from Google Images, Unsplash, Pixabay, or any other public image repository
    - Do NOT restrict yourself to specific image sources - use any valid image URL
    - For image guessing games, provide multiple image URLs for each term to be guessed
    
    ## Response Format
    Provide ONLY the JSON content with no other text, explanations or formatting.
  `;
};

/**
 * Parses the content response from Gemini
 */
const parseContentResponse = (text: string): any => {
  try {
    // Try to parse the text as JSON
    const cleanedText = text.trim();
    
    // Remove any markdown code block markers if present
    const jsonText = cleanedText
      .replace(/^```json\s*/g, '')
      .replace(/```$/g, '')
      .replace(/^```\s*/g, '')
      .trim();
    
    console.log("🔍 Parsing content response:", jsonText.substring(0, 100) + "...");
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("❌ Error parsing content response:", error);
    throw new Error("Invalid content format received from AI");
  }
};

/**
 * Attempts to generate content with Gemini, with retries on failure
 */
export const tryContentGeneration = async (
  model: any,
  topic: string,
  gameType: string,
  settings?: GameSettingsData,
  retryCount = 0
): Promise<any | null> => {
  const maxRetries = 3; // Maximum number of retries
  
  if (retryCount >= maxRetries) {
    console.log(`⚠️ Gemini: Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    console.log(`⏳ Gemini: Content generation attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateContentWithGemini(model, topic, gameType, settings);
  } catch (error) {
    console.error(`❌ Gemini: Attempt ${retryCount + 1} failed:`, error);
    // Wait a bit before retrying
    const waitTime = (retryCount + 1) * 1000;
    console.log(`⏳ Gemini: Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return tryContentGeneration(model, topic, gameType, settings, retryCount + 1);
  }
};

/**
 * Generates a game using Google's Gemini API
 * @param model Gemini model instance
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @param requiresImages Whether the game requires images
 * @returns MiniGame object or null if generation fails
 */
export const generateWithGemini = async (
  model: any, 
  topic: string, 
  settings?: GameSettingsData,
  requiresImages: boolean = false
): Promise<MiniGame | null> => {
  // Get game type from topic to provide better context for the AI
  const gameType = getGameTypeByTopic(topic);
  const gameDescription = gameType ? gameType.description : "interactive learning game";
  
  console.log(`🔷 Gemini: Starting game generation for "${topic}" - Type: ${gameType?.name || "Not specified"}`);
  console.log(`🔷 Gemini: Settings: ${JSON.stringify(settings || {})}`);
  console.log(`🔷 Gemini: Requires images: ${requiresImages}`);
  
  // Build the complete prompt
  const prompt = buildGeminiPrompt(topic, gameType?.id, settings, true); // Always allow images

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
 * @param requiresImages Whether the game requires images
 * @param retryCount Current retry count (internal use)
 * @returns MiniGame object or null if all retries fail
 */
export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  requiresImages: boolean = false,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 5; // Maximum number of retries
  
  if (retryCount >= maxRetries) {
    console.log(`⚠️ Gemini: Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    console.log(`⏳ Gemini: Attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithGemini(model, topic, settings, requiresImages);
  } catch (error) {
    console.error(`❌ Gemini: Attempt ${retryCount + 1} failed:`, error);
    // Wait a bit before retrying (increasing wait time with each retry)
    const waitTime = (retryCount + 1) * 1500; // Increase wait time between retries
    console.log(`⏳ Gemini: Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return tryGeminiGeneration(model, topic, settings, requiresImages, retryCount + 1);
  }
};


import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { buildGeminiPrompt } from './promptBuilder';
import { parseGeminiResponse } from './responseParser';

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
  
  // Check if the game might require images
  const mightRequireImages = checkIfGameRequiresImages(topic);
  if (mightRequireImages) {
    console.log("🔷 Gemini: This game likely requires images. Adding image generation instructions.");
  }
  
  // Build the complete prompt with image instructions if needed
  const prompt = buildGeminiPrompt(topic, gameType?.id, settings);

  try {
    console.log("🔷 Gemini: Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("🔷 Gemini: Response received, extracting JSON...");
    console.log(`🔷 Gemini: Response length: ${text.length}`);
    
    // If this is an image-based game, replace any non-Unsplash image URLs with Unsplash
    let parsedResponse = await parseGeminiResponse(text, topic);
    
    // Return the generated game
    return parsedResponse;
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

/**
 * Helper function to determine if a game likely requires images
 * @param topic The game topic
 * @returns Boolean indicating if images might be required
 */
function checkIfGameRequiresImages(topic: string): boolean {
  const imageRelatedKeywords = [
    'pictionary', 'picture', 'image', 'photo', 'hình', 'ảnh', 'đoán hình',
    'memory', 'matching', 'flashcard', 'thẻ nhớ', 'ghép hình', 'thẻ hình',
    'fruit', 'hoa quả', 'cây', 'animal', 'động vật', 'landmark', 'place',
    'địa danh', 'thắng cảnh'
  ];
  
  const lowerTopic = topic.toLowerCase();
  return imageRelatedKeywords.some(keyword => lowerTopic.includes(keyword));
}


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
  const prompt = buildGeminiPrompt(topic, gameType?.id, settings, requiresImages);

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


import { MiniGame } from './types';
import { logInfo, logError } from './apiUtils';
import { AIGameGenerator } from './AIGameGenerator';

/**
 * Attempts to generate a minigame using Google Gemini AI
 * 
 * @param apiKey - Optional API key, will use default if not provided
 * @param topic - The topic for the minigame
 * @param settings - Optional settings for the game generation
 * @returns Promise with the generated minigame or null if generation failed
 */
export const tryGeminiGeneration = async (
  apiKey: string | null,
  topic: string,
  settings?: { useCanvas?: boolean, category?: string }
): Promise<MiniGame | null> => {
  try {
    logInfo('geminiGenerator', `Starting generation for topic: ${topic}`, settings);
    
    // Use the singleton instance of AIGameGenerator
    const generator = AIGameGenerator.getInstance();
    
    // Generate the minigame
    const result = await generator.generateMiniGame(topic, {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: settings?.category || 'general',
    });
    
    if (result) {
      logInfo('geminiGenerator', `Successfully generated minigame: ${result.title}`);
      return result;
    } else {
      logError('geminiGenerator', 'Generation returned null result');
      return null;
    }
  } catch (error) {
    logError('geminiGenerator', 'Error during generation attempt', error);
    return null;
  }
};

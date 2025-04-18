
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { AIGameGenerator } from './AIGameGenerator';

/**
 * Helper function to try generating a game with Gemini
 */
export const tryGeminiGeneration = async (
  gameGenerator: AIGameGenerator | null,
  topic: string,
  settings?: { useCanvas?: boolean; category?: string }
): Promise<MiniGame | null> => {
  try {
    // Use provided generator or get the singleton instance
    const generator = gameGenerator || AIGameGenerator.getInstance();
    
    // Set canvas mode if specified
    if (settings?.useCanvas !== undefined) {
      generator.setCanvasMode(settings.useCanvas);
    }
    
    // Create game settings from the basic settings
    const gameSettings: GameSettingsData = {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: settings?.category || 'general',
    };
    
    // Generate the minigame
    return await generator.generateMiniGame(topic, gameSettings);
  } catch (error) {
    console.error('Error in tryGeminiGeneration:', error);
    return null;
  }
};

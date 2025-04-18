
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo } from './apiUtils';

/**
 * Simplified API client for generating minigames
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;

  /**
   * Create a new AIGameGenerator
   */
  constructor() {
    logInfo('AIGameGenerator', 'Initialized with simplified mock functionality');
  }

  /**
   * Get the singleton instance of AIGameGenerator
   * @returns AIGameGenerator instance
   */
  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  /**
   * Generate a minigame based on a topic (mock implementation)
   * @param topic Topic to generate game for
   * @param settings Optional game settings
   * @returns Promise with generated game or null
   */
  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    return {
      title: `Game about ${topic}`,
      description: `This is a simplified game interface about ${topic}`,
      content: `<p>Game content would appear here for: ${topic}</p>`
    };
  }
}

// Export MiniGame type
export type { MiniGame };

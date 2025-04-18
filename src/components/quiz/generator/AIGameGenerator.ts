
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo } from './apiUtils';

/**
 * Simplified API client for generating minigames
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private canvasMode: boolean = true;

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
   * Set canvas mode for game generation
   * @param useCanvas boolean flag to enable/disable canvas mode
   */
  public setCanvasMode(useCanvas: boolean): void {
    this.canvasMode = useCanvas;
    logInfo('AIGameGenerator', `Canvas mode ${useCanvas ? 'enabled' : 'disabled'}`);
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

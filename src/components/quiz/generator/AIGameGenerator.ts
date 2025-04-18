
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError, logSuccess } from './apiUtils';
import { processGeminiHtml } from './direct-html-parser';

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
   * Generate a minigame based on a topic
   * @param topic Topic to generate game for
   * @param settings Optional game settings
   * @returns Promise with generated game or null
   */
  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      logInfo('AIGameGenerator', `Generating game for topic: ${topic}`, {
        canvasMode: this.canvasMode,
        settings
      });
      
      // For demonstration, using mockGeminiResponse but this would be replaced with actual API call
      const mockGeminiResponse = await this.simulateGeminiApiCall(topic, settings);
      
      // Process the HTML response directly with our new parser
      const miniGame = processGeminiHtml(mockGeminiResponse);
      
      logSuccess('AIGameGenerator', `Successfully generated game for: ${topic}`);
      
      return {
        title: miniGame.title || `Game about ${topic}`,
        description: miniGame.description || `Interactive game about ${topic}`,
        content: miniGame.content,
        useCanvas: this.canvasMode
      };
    } catch (error) {
      logError('AIGameGenerator', `Error generating game: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }
  
  /**
   * Simulate a Gemini API call that returns HTML content directly
   * This would be replaced with a real API call
   */
  private async simulateGeminiApiCall(topic: string, settings?: GameSettingsData): Promise<string> {
    logInfo('AIGameGenerator', `Simulating Gemini API call for: ${topic}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a simple HTML game about the topic
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game about ${topic}</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f0f8ff;
    }
    
    .game-container {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      max-width: 90%;
      width: 500px;
    }
    
    h1 {
      color: #4a6fa5;
      margin-bottom: 1.5rem;
    }
    
    .game-content {
      margin-bottom: 2rem;
    }
    
    button {
      background-color: #5f85db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #4a6fa5;
    }
    
    .score {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="game-container">
    <h1>Interactive Game: ${topic}</h1>
    
    <div class="game-content">
      <p>This is a simple interactive game about ${topic}.</p>
      <p class="score">Score: <span id="score">0</span></p>
      <button id="play-button">Click to Play</button>
    </div>
  </div>
  
  <script>
    // Simple game logic
    const button = document.getElementById('play-button');
    const scoreElement = document.getElementById('score');
    let score = 0;
    
    button.addEventListener('click', () => {
      score += 1;
      scoreElement.textContent = score;
      
      if (score >= 10) {
        alert('You won the game!');
        
        // Dispatch game completion event
        document.dispatchEvent(new CustomEvent('game-completed', {
          detail: { score: score }
        }));
      }
    });
  </script>
</body>
</html>
    `;
  }
}

// Export MiniGame type
export type { MiniGame };

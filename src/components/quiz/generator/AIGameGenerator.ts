
import { buildGeminiPrompt } from './promptBuilder';
import { MiniGame, GameGenerationOptions } from './types';

/**
 * Generator for AI-powered minigames
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private useCanvas: boolean = true;
  
  // Public constructor to allow direct instantiation
  constructor() {}
  
  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }
  
  /**
   * Set canvas mode for game generation
   */
  public setCanvasMode(useCanvas: boolean): void {
    this.useCanvas = useCanvas;
  }
  
  /**
   * Generate a minigame based on a topic
   */
  public async generateMiniGame(
    topic: string, 
    settings: any = {}
  ): Promise<MiniGame> {
    try {
      // Log the generation attempt
      console.log(`Generating minigame with topic: ${topic}`);
      
      // Use the prompt builder to create the prompt
      const prompt = buildGeminiPrompt(topic, this.useCanvas);
      
      // For now, return a placeholder game since we don't have the actual AI integration
      return {
        title: `Game: ${topic}`,
        description: `Interactive game about ${topic}`,
        content: this.generatePlaceholderGame(topic)
      };
    } catch (error) {
      console.error('Error generating minigame:', error);
      throw new Error('Failed to generate minigame');
    }
  }
  
  /**
   * Generate a basic placeholder game when no AI is available
   */
  private generatePlaceholderGame(topic: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Game: ${topic}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #4f46e5;
          }
          .game-area {
            margin-top: 20px;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            background-color: #fafafa;
          }
          button {
            background-color: #4f46e5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
            font-size: 16px;
          }
          button:hover {
            background-color: #4338ca;
          }
          .score {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Game: ${topic}</h1>
          <p>This is a placeholder for an interactive game about "${topic}".</p>
          
          <div class="score">Score: <span id="score">0</span></div>
          
          <div class="game-area">
            <p>Game content will appear here when generated by AI.</p>
            <p>Click the buttons below to simulate gameplay.</p>
            
            <button onclick="increaseScore()">Earn Points</button>
            <button onclick="resetScore()">Reset Game</button>
          </div>
        </div>
        
        <script>
          let score = 0;
          
          function increaseScore() {
            score += 10;
            document.getElementById('score').textContent = score;
            
            // Send message to parent frame if it exists
            try {
              window.parent.postMessage({
                type: 'gameStats',
                payload: { score: score }
              }, '*');
            } catch (e) {
              console.error('Failed to send message to parent:', e);
            }
          }
          
          function resetScore() {
            score = 0;
            document.getElementById('score').textContent = score;
            
            // Send message to parent frame if it exists
            try {
              window.parent.postMessage({
                type: 'gameStats',
                payload: { score: score, completed: false }
              }, '*');
            } catch (e) {
              console.error('Failed to send message to parent:', e);
            }
          }
        </script>
      </body>
      </html>
    `;
  }
}

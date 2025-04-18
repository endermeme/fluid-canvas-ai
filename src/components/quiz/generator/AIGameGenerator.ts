
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
      return this.createErrorResponse(topic, String(error));
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
    
    #wheel-container {
      margin: 2rem auto;
      position: relative;
      width: 300px;
      height: 300px;
    }
    
    #wheel {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: conic-gradient(
        #ff7f50 0% 10%,
        #ffd700 10% 20%,
        #32cd32 20% 30%,
        #87cefa 30% 40%,
        #9370db 40% 50%,
        #ff69b4 50% 60%,
        #ff6347 60% 70%,
        #00ced1 70% 80%,
        #ffa500 80% 90%,
        #7fffd4 90% 100%
      );
      transform: rotate(0deg);
      transition: transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67);
      position: relative;
      border: 5px solid #333;
    }
    
    #wheel::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      background-color: #333;
      border-radius: 50%;
    }
    
    #pointer {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
      border-top: 40px solid #ff4136;
      z-index: 10;
    }
    
    .prizes {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      margin-top: 2rem;
    }
    
    .prize {
      background-color: #f0f0f0;
      padding: 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <div class="game-container">
    <h1>Vòng Quay May Mắn</h1>
    
    <div class="game-content">
      <p>Hãy quay vòng quay để nhận phần thưởng!</p>
      <p class="score">Điểm: <span id="score">0</span></p>
      
      <div id="wheel-container">
        <div id="pointer"></div>
        <div id="wheel"></div>
      </div>
      
      <button id="spin-button">Quay Ngay!</button>
      
      <div class="prizes">
        <div class="prize">50 Điểm</div>
        <div class="prize">100 Điểm</div>
        <div class="prize">150 Điểm</div>
        <div class="prize">200 Điểm</div>
        <div class="prize">Mất Lượt</div>
        <div class="prize">300 Điểm</div>
        <div class="prize">Quay Lại</div>
        <div class="prize">400 Điểm</div>
        <div class="prize">500 Điểm</div>
        <div class="prize">250 Điểm</div>
      </div>
    </div>
  </div>
  
  <script>
    // Simple wheel spinning game
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spin-button');
    const scoreElement = document.getElementById('score');
    let score = 0;
    let spinning = false;
    
    // Prize values based on wheel segments
    const prizes = [
      { name: '50 Điểm', value: 50 },
      { name: '100 Điểm', value: 100 },
      { name: '150 Điểm', value: 150 },
      { name: '200 Điểm', value: 200 },
      { name: 'Mất Lượt', value: 0 },
      { name: '300 Điểm', value: 300 },
      { name: 'Quay Lại', value: -1 },
      { name: '400 Điểm', value: 400 },
      { name: '500 Điểm', value: 500 },
      { name: '250 Điểm', value: 250 }
    ];
    
    spinButton.addEventListener('click', () => {
      if (spinning) return;
      
      spinning = true;
      spinButton.disabled = true;
      
      // Random rotation (5-10 full spins + random segment)
      const rotations = 5 + Math.floor(Math.random() * 5);
      const extraDegrees = Math.floor(Math.random() * 360);
      const totalDegrees = rotations * 360 + extraDegrees;
      
      // Apply the rotation
      wheel.style.transform = 'rotate(' + totalDegrees + 'deg)';
      
      // Calculate which prize was won
      setTimeout(() => {
        // The wheel rotates clockwise, so we need to calculate the segment
        // by taking into account the final position of the wheel
        const finalRotation = totalDegrees % 360;
        const segmentSize = 360 / prizes.length;
        const prizeIndex = Math.floor((360 - finalRotation) / segmentSize) % prizes.length;
        const prize = prizes[prizeIndex];
        
        // Update score
        if (prize.value > 0) {
          score += prize.value;
          alert('Chúc mừng! Bạn đã nhận được ' + prize.name);
        } else if (prize.value === 0) {
          alert('Tiếc quá! Bạn đã quay trúng "Mất Lượt"');
        } else if (prize.value === -1) {
          alert('Bạn được quay lại một lần nữa!');
          setTimeout(() => {
            spinning = false;
            spinButton.disabled = false;
          }, 500);
        }
        
        scoreElement.textContent = score;
        
        // Check for game completion
        if (score >= 1000) {
          alert('Chúc mừng! Bạn đã thắng cuộc với ' + score + ' điểm!');
          
          // Dispatch game completion event
          document.dispatchEvent(new CustomEvent('game-completed', {
            detail: { score: score }
          }));
        } else if (prize.value !== -1) {
          // Re-enable button after delay
          setTimeout(() => {
            spinning = false;
            spinButton.disabled = false;
          }, 500);
        }
      }, 3000); // Wait for the wheel to stop spinning
    });
  </script>
</body>
</html>
    `;
  }
  
  /**
   * Create an error response MiniGame
   */
  private createErrorResponse(topic: string, errorMessage: string): MiniGame {
    const errorHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error: ${topic}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
      color: #333;
    }
    .error-container {
      background-color: #fee2e2;
      border: 1px solid #ef4444;
      border-radius: 8px;
      padding: 20px;
    }
    h1 { color: #b91c1c; }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>Error Generating Game</h1>
    <p>Sorry, there was a problem creating your game about "${topic}".</p>
    <p>Error: ${errorMessage}</p>
    <p>Please try again or check the console for more details.</p>
  </div>
</body>
</html>
    `;
    
    return {
      title: `Error: ${topic}`,
      description: "Error generating content",
      content: errorHtml
    };
  }
}

// Export MiniGame type
export type { MiniGame };

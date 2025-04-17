
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError } from './apiUtils';

/**
 * API client for generating minigames with AI
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private useCanvas: boolean = false;

  /**
   * Create a new AIGameGenerator
   */
  constructor() {
    logInfo('AIGameGenerator', 'Initialized AIGameGenerator');
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
   * Set canvas mode for HTML game generation
   * @param useCanvas Whether to use canvas mode
   */
  public setCanvasMode(useCanvas: boolean): void {
    this.useCanvas = useCanvas;
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
      // Separate the game into three distinct files with proper formatting
      const htmlContent = this.createHtmlContent(topic);
      const cssContent = this.createCssContent();
      const jsContent = this.createJsContent(topic);
      
      // Create the full game content by combining the files
      const fullContent = this.createFullContent(htmlContent, cssContent, jsContent, topic);
      
      // Create the minigame object with separated files
      const placeholderGame: MiniGame = {
        title: `Game: ${topic}`,
        content: fullContent,
        htmlContent: htmlContent,
        cssContent: cssContent,
        jsContent: jsContent,
        isSeparatedFiles: true,
        useCanvas: this.useCanvas
      };
      
      return placeholderGame;
    } catch (error) {
      logError('AIGameGenerator', 'Error generating minigame', error);
      throw error;
    }
  }

  private createHtmlContent(topic: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game: ${topic}</title>
</head>
<body>
  <div class="game-container">
    <h1 class="game-title">Game: ${topic}</h1>
    
    <div class="game-stats">
      <div class="score-container">Score: <span id="score">0</span></div>
      <div class="time-container">Time: <span id="time">60</span>s</div>
    </div>
    
    <div id="game-area" class="game-area">
      <div class="start-screen" id="start-screen">
        <h2>Welcome to ${topic} Game!</h2>
        <p>Click the targets as they appear to score points.</p>
        <button id="start-button" class="start-button">Start Game</button>
      </div>
      
      <div class="game-over hidden" id="game-over">
        <h2>Game Over!</h2>
        <p>Your final score: <span id="final-score">0</span></p>
        <button id="restart-button" class="restart-button">Play Again</button>
      </div>
    </div>
    
    <div class="controls">
      <button id="pause-button" class="control-button">Pause</button>
      <button id="mute-button" class="control-button">Mute</button>
    </div>
  </div>
</body>
</html>`;
  }

  private createCssContent(): string {
    return `/* Game Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  background-color: #f8f9fa;
  color: #212529;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.game-container {
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.game-title {
  color: #4f46e5;
  margin-bottom: 16px;
  font-size: 28px;
}

.game-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.score-container {
  color: #4f46e5;
}

.time-container {
  color: #ef4444;
}

.game-area {
  margin-top: 20px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  border-radius: 8px;
  background-color: #f3f4f6;
  min-height: 300px;
  position: relative;
  overflow: hidden;
}

.target {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: #4f46e5;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.target:hover {
  transform: scale(1.1);
}

.start-screen, .game-over {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.hidden {
  display: none;
}

.start-button, .restart-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 18px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:hover, .restart-button:hover {
  background-color: #4338ca;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.control-button {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-button:hover {
  background-color: #e5e7eb;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.pulse {
  animation: pulse 0.6s infinite;
}`;
  }

  private createJsContent(topic: string): string {
    return `// Game variables
let score = 0;
let timeLeft = 60;
let gameRunning = false;
let timerId;
let targets = [];
let isPaused = false;
let isMuted = false;

// DOM Elements
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const finalScoreElement = document.getElementById('final-score');
const gameArea = document.getElementById('game-area');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const pauseButton = document.getElementById('pause-button');
const muteButton = document.getElementById('mute-button');

// Game initialization
function initGame() {
  console.log('Game initialized for topic: ${topic}');
  
  // Event listeners
  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', restartGame);
  pauseButton.addEventListener('click', togglePause);
  muteButton.addEventListener('click', toggleMute);
  
  // Initial setup
  updateScore(0);
  updateTime(60);
}

// Start the game
function startGame() {
  console.log('Game started');
  gameRunning = true;
  isPaused = false;
  
  // Hide start screen
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  
  // Reset game state
  score = 0;
  timeLeft = 60;
  updateScore(score);
  updateTime(timeLeft);
  
  // Start the game timer
  timerId = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      updateTime(timeLeft);
      
      if (timeLeft <= 0) {
        endGame();
      }
    }
  }, 1000);
  
  // Start spawning targets
  spawnTarget();
}

// End the game
function endGame() {
  console.log('Game over. Final score:', score);
  gameRunning = false;
  clearInterval(timerId);
  
  // Remove all targets
  targets.forEach(target => {
    if (target && target.parentNode) {
      target.parentNode.removeChild(target);
    }
  });
  targets = [];
  
  // Show game over screen
  finalScoreElement.textContent = score;
  gameOverScreen.classList.remove('hidden');
  
  // Report the completed game and score to the parent frame
  try {
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'gameStats',
        payload: {
          completed: true,
          score: score,
          totalTime: 60 - timeLeft
        }
      }, '*');
    }
  } catch (e) {
    console.error('Failed to communicate with parent frame:', e);
  }
}

// Restart the game
function restartGame() {
  if (timerId) {
    clearInterval(timerId);
  }
  startGame();
}

// Spawn a new target
function spawnTarget() {
  if (!gameRunning || isPaused) return;
  
  const target = document.createElement('div');
  target.classList.add('target');
  
  // Random position within game area
  const gameAreaRect = gameArea.getBoundingClientRect();
  const maxX = gameAreaRect.width - 50;
  const maxY = gameAreaRect.height - 50;
  
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  
  target.style.left = x + 'px';
  target.style.top = y + 'px';
  
  // Random color
  const colors = ['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  target.style.backgroundColor = color;
  
  // Click handler
  target.addEventListener('click', () => {
    if (!isPaused) {
      updateScore(score + 10);
      playSound('hit');
      
      // Remove the target
      gameArea.removeChild(target);
      targets = targets.filter(t => t !== target);
    }
  });
  
  // Add to game area
  gameArea.appendChild(target);
  targets.push(target);
  
  // Remove after a timeout
  setTimeout(() => {
    if (target.parentNode) {
      target.parentNode.removeChild(target);
      targets = targets.filter(t => t !== target);
    }
  }, 2000);
  
  // Schedule next target
  const nextTargetDelay = Math.random() * 1000 + 500;
  setTimeout(spawnTarget, nextTargetDelay);
}

// Update the score display
function updateScore(newScore) {
  score = newScore;
  scoreElement.textContent = score;
}

// Update the time display
function updateTime(time) {
  timeElement.textContent = time;
  
  // Add pulse animation when time is low
  if (time <= 10) {
    timeElement.classList.add('pulse');
  } else {
    timeElement.classList.remove('pulse');
  }
}

// Toggle pause state
function togglePause() {
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
  
  if (isPaused) {
    gameArea.classList.add('paused');
  } else {
    gameArea.classList.remove('paused');
  }
}

// Toggle mute state
function toggleMute() {
  isMuted = !isMuted;
  muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
}

// Play sound effect
function playSound(soundType) {
  if (isMuted) return;
  
  // Simple audio feedback
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (soundType) {
    case 'hit':
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);
      break;
      
    case 'gameOver':
      oscillator.frequency.value = 220;
      gainNode.gain.value = 0.1;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
      break;
  }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initGame);

// Report loaded event to parent
window.addEventListener('load', function() {
  console.log('Game loaded successfully');
  try {
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'gameStats',
        payload: { loaded: true }
      }, '*');
    }
  } catch (e) {
    console.error('Failed to communicate with parent frame:', e);
  }
});`;
  }

  private createFullContent(htmlContent: string, cssContent: string, jsContent: string, topic: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game: ${topic}</title>
  <style>
${cssContent}
  </style>
</head>
<body>
${htmlContent.split('<!DOCTYPE html>')[1].split('<head>')[0]}
  <div class="game-container">
    <h1 class="game-title">Game: ${topic}</h1>
    
    <div class="game-stats">
      <div class="score-container">Score: <span id="score">0</span></div>
      <div class="time-container">Time: <span id="time">60</span>s</div>
    </div>
    
    <div id="game-area" class="game-area">
      <div class="start-screen" id="start-screen">
        <h2>Welcome to ${topic} Game!</h2>
        <p>Click the targets as they appear to score points.</p>
        <button id="start-button" class="start-button">Start Game</button>
      </div>
      
      <div class="game-over hidden" id="game-over">
        <h2>Game Over!</h2>
        <p>Your final score: <span id="final-score">0</span></p>
        <button id="restart-button" class="restart-button">Play Again</button>
      </div>
    </div>
    
    <div class="controls">
      <button id="pause-button" class="control-button">Pause</button>
      <button id="mute-button" class="control-button">Mute</button>
    </div>
  </div>

  <script>
${jsContent}
  </script>
</body>
</html>`;
  }
}

// Export MiniGame type
export type { MiniGame };

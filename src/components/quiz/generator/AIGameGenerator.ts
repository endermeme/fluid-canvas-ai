import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError, escapeStringLiterals } from './apiUtils';
import { GEMINI_API_KEY, GEMINI_MODELS, getApiEndpoint, DEFAULT_GENERATION_SETTINGS, REQUEST_TIMEOUT } from '../../../constants/api-constants';

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
      logInfo('AIGameGenerator', `Generating minigame for topic: ${topic}`);
      
      // In a real implementation, here we would call the Gemini API
      // Instead, we'll create a sample game based on the topic
      const gameType = this.determineGameType(topic);
      
      // Generate game content based on the topic and game type
      const title = `Game: ${topic}`;
      
      // Create separate HTML, CSS, and JS files with proper formatting
      const htmlContent = this.createHtmlContent(topic, gameType);
      const cssContent = this.createCssContent(gameType);
      const jsContent = this.createJsContent(topic, gameType);
      
      // Create the full content by combining the files
      const fullContent = this.createFullContent(htmlContent, cssContent, jsContent, title);
      
      // Create the minigame object with separated files
      const game: MiniGame = {
        title: title,
        content: fullContent,
        htmlContent: htmlContent,
        cssContent: cssContent,
        jsContent: jsContent,
        isSeparatedFiles: true,
        useCanvas: this.useCanvas
      };
      
      logInfo('AIGameGenerator', `Successfully generated minigame: ${title}`);
      return game;
    } catch (error) {
      logError('AIGameGenerator', 'Error generating minigame', error);
      throw error;
    }
  }

  /**
   * Determine the type of game to generate based on the topic
   */
  private determineGameType(topic: string): string {
    const lowerTopic = topic.toLowerCase();
    
    if (lowerTopic.includes('quiz') || lowerTopic.includes('câu hỏi') || lowerTopic.includes('trắc nghiệm')) {
      return 'quiz';
    } else if (lowerTopic.includes('memory') || lowerTopic.includes('trí nhớ') || lowerTopic.includes('ghi nhớ')) {
      return 'memory';
    } else if (lowerTopic.includes('puzzle') || lowerTopic.includes('xếp hình') || lowerTopic.includes('ghép hình')) {
      return 'puzzle';
    } else if (lowerTopic.includes('wheel') || lowerTopic.includes('vòng quay') || lowerTopic.includes('fortune')) {
      return 'wheel';
    } else if (lowerTopic.includes('jump') || lowerTopic.includes('nhảy') || lowerTopic.includes('platform')) {
      return 'platform';
    } else if (lowerTopic.includes('draw') || lowerTopic.includes('vẽ') || lowerTopic.includes('drawing')) {
      return 'drawing';
    } else if (lowerTopic.includes('match') || lowerTopic.includes('ghép cặp') || lowerTopic.includes('matching')) {
      return 'matching';
    } else {
      return 'clicker';
    }
  }

  private createHtmlContent(topic: string, gameType: string): string {
    if (gameType === 'wheel') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vòng Quay May Mắn: ${topic}</title>
</head>
<body>
  <div class="game-container">
    <h1 class="game-title">Vòng Quay May Mắn: ${topic}</h1>
    
    <div class="game-area">
      <div class="wheel-container">
        <canvas id="wheel" width="400" height="400"></canvas>
        <div class="wheel-pointer"></div>
      </div>
      
      <div class="controls">
        <button id="spin-button" class="spin-button">Quay!</button>
        <div class="result" id="result"></div>
      </div>
    </div>
    
    <div class="options-panel">
      <h3>Tùy chỉnh vòng quay</h3>
      <div class="options-form">
        <div class="form-group">
          <label for="add-option">Thêm mục mới:</label>
          <div class="input-group">
            <input type="text" id="add-option" placeholder="Nhập nội dung...">
            <button id="add-button">Thêm</button>
          </div>
        </div>
        
        <div class="form-group">
          <h4>Danh sách mục:</h4>
          <ul id="options-list" class="options-list"></ul>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
    } else if (gameType === 'quiz') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Game: ${topic}</title>
</head>
<body>
  <div class="game-container">
    <h1 class="game-title">Quiz Game: ${topic}</h1>
    
    <div class="game-stats">
      <div class="score-container">Score: <span id="score">0</span></div>
      <div class="time-container">Time: <span id="time">60</span>s</div>
    </div>
    
    <div id="game-area" class="game-area">
      <div class="start-screen" id="start-screen">
        <h2>Welcome to ${topic} Quiz!</h2>
        <p>Test your knowledge with these questions.</p>
        <button id="start-button" class="start-button">Start Quiz</button>
      </div>
      
      <div class="quiz-content hidden" id="quiz-content">
        <div class="question-container">
          <h3 id="question">Question goes here</h3>
          <div class="options-container" id="options-container">
            <!-- Options will be added here -->
          </div>
        </div>
      </div>
      
      <div class="game-over hidden" id="game-over">
        <h2>Quiz Complete!</h2>
        <p>Your final score: <span id="final-score">0</span></p>
        <button id="restart-button" class="restart-button">Play Again</button>
      </div>
    </div>
  </div>
</body>
</html>`;
    } else {
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
  }

  private createCssContent(gameType: string): string {
    if (gameType === 'wheel') {
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
  max-width: 900px;
  text-align: center;
}

.game-title {
  color: #4f46e5;
  margin-bottom: 24px;
  font-size: 28px;
}

.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.wheel-container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto 20px;
}

.wheel-pointer {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: #ef4444;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  z-index: 10;
}

.controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.spin-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 12px 36px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.spin-button:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.spin-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.result {
  font-size: 24px;
  font-weight: bold;
  min-height: 36px;
  color: #4f46e5;
}

.options-panel {
  margin-top: 30px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  text-align: left;
}

.options-form {
  margin-top: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  gap: 8px;
}

input[type="text"] {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
}

.options-list {
  list-style: none;
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
}

.options-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.options-list li:last-child {
  border-bottom: none;
}

.delete-option {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

#add-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .wheel-container {
    width: 300px;
    height: 300px;
  }
  
  canvas {
    width: 300px;
    height: 300px;
  }
}`;
    } else if (gameType === 'quiz') {
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

.quiz-content {
  padding: 20px;
}

.question-container {
  margin-bottom: 20px;
}

.question-container h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #1f2937;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  background-color: white;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 16px;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option:hover {
  border-color: #4f46e5;
  background-color: #eef2ff;
}

.option.selected {
  border-color: #4f46e5;
  background-color: #eef2ff;
}

.option.correct {
  border-color: #10b981;
  background-color: #d1fae5;
}

.option.incorrect {
  border-color: #ef4444;
  background-color: #fee2e2;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.pulse {
  animation: pulse 0.5s ease-in-out;
}`;
    } else {
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
  }

  private createJsContent(topic: string, gameType: string): string {
    if (gameType === 'wheel') {
      return `// Game variables
let spinning = false;
let segments = [
  "Phần thưởng 1", 
  "Phần thưởng 2", 
  "Phần thưởng 3", 
  "Phần thưởng 4", 
  "Phần thưởng 5", 
  "Phần thưởng 6"
];
let colors = [
  "#4f46e5", "#10b981", "#f97316", "#8b5cf6", "#ef4444", "#06b6d4",
  "#84cc16", "#ec4899", "#f59e0b", "#6366f1"
];
let canvas, ctx, radius, centerX, centerY, startAngle;

// DOM Elements
const wheelElement = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const resultElement = document.getElementById('result');
const addOptionInput = document.getElementById('add-option');
const addButton = document.getElementById('add-button');
const optionsList = document.getElementById('options-list');

// Initialize the wheel
function initWheel() {
  console.log("Initializing wheel for: ${topic}");
  
  if (!wheelElement) return;
  
  canvas = wheelElement;
  ctx = canvas.getContext('2d');
  radius = canvas.width / 2;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  
  // Calculate the angle for each segment
  startAngle = 0;
  
  // Draw the initial wheel
  drawWheel();
  
  // Initialize UI
  updateOptionsList();
  
  // Event listeners
  spinButton.addEventListener('click', spinWheel);
  addButton.addEventListener('click', addOption);
  addOptionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addOption();
  });
}

// Draw the wheel
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const anglePerSegment = 2 * Math.PI / segments.length;
  
  for (let i = 0; i < segments.length; i++) {
    const angle = i * anglePerSegment;
    
    // Draw segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + anglePerSegment);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + anglePerSegment / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    
    const text = segments[i];
    // Fit text within the segment
    const maxWidth = radius * 0.8;
    
    if (ctx.measureText(text).width > maxWidth) {
      const words = text.split(' ');
      let line = '';
      let y = -20;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
          ctx.fillText(line, radius * 0.8, y);
          line = words[n] + ' ';
          y += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, radius * 0.8, y);
    } else {
      ctx.fillText(text, radius * 0.8, 0);
    }
    
    ctx.restore();
  }
  
  // Draw center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.stroke();
}

// Spin the wheel
function spinWheel() {
  if (spinning) return;
  
  spinning = true;
  spinButton.disabled = true;
  resultElement.textContent = '';
  
  // Generate a random stop angle
  const stopAngle = Math.random() * 2 * Math.PI;
  const spinAngle = 2 * Math.PI * (5 + Math.random() * 5); // Spin 5-10 full rotations
  const totalAngle = spinAngle + stopAngle;
  
  // Create a spinning animation
  const duration = 3000; // 3 seconds
  const start = performance.now();
  
  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Cubic bezier easing for natural spin slowdown
    const easedProgress = cubicBezier(0.2, 0.8, 0.2, 1, progress);
    const currentAngle = easedProgress * totalAngle;
    
    // Update wheel rotation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle);
    ctx.translate(-centerX, -centerY);
    
    // Redraw the wheel in rotated context
    const anglePerSegment = 2 * Math.PI / segments.length;
    
    for (let i = 0; i < segments.length; i++) {
      const angle = i * anglePerSegment;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + anglePerSegment);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      
      const text = segments[i];
      ctx.fillText(text, radius * 0.8, 0);
      
      ctx.restore();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      finishSpin(stopAngle);
    }
  }
  
  requestAnimationFrame(animate);
}

// Cubic bezier easing function
function cubicBezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  
  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
}

// Finish the spinning animation and show the result
function finishSpin(stopAngle) {
  const anglePerSegment = 2 * Math.PI / segments.length;
  
  // Normalize the angle
  let normalizedAngle = (2 * Math.PI - stopAngle) % (2 * Math.PI);
  if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
  
  // Calculate which segment the wheel landed on
  const segmentIndex = Math.floor(normalizedAngle / anglePerSegment);
  const result = segments[segmentIndex];
  
  resultElement.textContent = 'Kết quả: ' + result;
  
  spinning = false;
  spinButton.disabled = false;
  
  // Report the result to the parent window if available
  try {
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'wheelResult',
        result: result
      }, '*');
    }
  } catch (e) {
    console.error('Failed to report result to parent window:', e);
  }
}

// Add a new option to the wheel
function addOption() {
  const value = addOptionInput.value.trim();
  
  if (value) {
    segments.push(value);
    addOptionInput.value = '';
    drawWheel();
    updateOptionsList();
  }
}

// Update the list of options
function updateOptionsList() {
  optionsList.innerHTML = '';
  
  segments.forEach((segment, index) => {
    const li = document.createElement('li');
    
    const textSpan = document.createElement('span');
    textSpan.textContent = segment;
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '×';
    deleteButton.className = 'delete-option';
    deleteButton.addEventListener('click', () => removeOption(index));
    
    li.appendChild(textSpan);
    li.appendChild(deleteButton);
    
    optionsList.appendChild(li);
  });
}

// Remove an option from the wheel
function removeOption(index) {
  if (segments.length <= 2) {
    alert('The wheel must have at least 2 segments.');
    return;
  }
  
  segments.splice(index, 1);
  drawWheel();
  updateOptionsList();
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initWheel);

// Report loaded event to parent
window.addEventListener('load', function() {
  console.log('Wheel of fortune game loaded successfully');
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
    } else if (gameType === 'quiz') {
      return `// Game variables
let score = 0;
let timeLeft = 60;
let gameRunning = false;
let timerId;
let currentQuestionIndex = 0;
let questions = [
  {
    question: "Question 1 about ${topic}?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0
  },
  {
    question: "Question 2 about ${topic}?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 1
  },
  {
    question: "Question 3 about ${topic}?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 2
  },
  {
    question: "Question 4 about ${topic}?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 3
  },
  {
    question: "Question 5 about ${topic}?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0
  }
];

// DOM Elements
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const finalScoreElement = document.getElementById('final-score');
const gameArea = document.getElementById('game-area');
const startScreen = document.getElementById('start-screen');
const quizContent = document.getElementById('quiz-content');
const gameOverScreen = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');

// Game initialization
function initGame() {
  console.log("Quiz game initialized for topic: ${topic}");
  
  // Generate quiz questions based on topic
  generateQuestions();
  
  // Event listeners
  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', restartGame);
  
  // Initial setup
  updateScore(0);
  updateTime(60);
}

// Generate some quiz questions related to the topic
function generateQuestions() {
  // In a real implementation, we would use an API to generate questions
  // For now, we'll use the sample questions defined above
  
  // Shuffle the questions
  questions = shuffleArray(questions);
}

// Shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start the game
function startGame() {
  console.log('Quiz started');
  gameRunning = true;
  
  // Hide start screen, show quiz content
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  quizContent.classList.remove('hidden');
  
  // Reset game state
  score = 0;
  timeLeft = 60;
  currentQuestionIndex = 0;
  updateScore(score);
  updateTime(timeLeft);
  
  // Display the first question
  displayQuestion();
  
  // Start the game timer
  timerId = setInterval(() => {
    timeLeft--;
    updateTime(timeLeft);
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Display the current question
function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endGame();
    return;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  
  // Clear previous options
  optionsContainer.innerHTML = '';
  
  // Add options
  currentQuestion.options.forEach((option, index) => {
    const optionElement = document.createElement('button');
    optionElement.className = 'option';
    optionElement.textContent = option;
    optionElement.dataset.index = index;
    
    optionElement.addEventListener('click', () => selectOption(index));
    
    optionsContainer.appendChild(optionElement);
  });
}

// Handle option selection
function selectOption(index) {
  if (!gameRunning) return;
  
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = index === currentQuestion.correctAnswer;
  
  // Mark the selected option
  const options = optionsContainer.querySelectorAll('.option');
  
  options.forEach(option => {
    const optionIndex = parseInt(option.dataset.index);
    
    if (optionIndex === index) {
      option.classList.add('selected');
      option.classList.add(isCorrect ? 'correct' : 'incorrect');
    } else if (optionIndex === currentQuestion.correctAnswer) {
      option.classList.add('correct');
    }
    
    // Disable all options after selection
    option.disabled = true;
  });
  
  // Update score if correct
  if (isCorrect) {
    updateScore(score + 10);
    playSound('correct');
  } else {
    playSound('incorrect');
  }
  
  // Move to next question after a delay
  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, 1500);
}

// End the game
function endGame() {
  console.log('Quiz over. Final score:', score);
  gameRunning = false;
  clearInterval(timerId);
  
  // Hide quiz content, show game over screen
  quizContent.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  finalScoreElement.textContent = score;
  
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
  // Shuffle questions again
  questions = shuffleArray(questions);
  startGame();
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

// Play sound effect
function playSound(soundType) {
  // Simple audio feedback
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (soundType) {
    case 'correct':
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
      break;
      
    case 'incorrect':
      oscillator.frequency.value = 220;
      gainNode.gain.value = 0.1;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 300);
      break;
  }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initGame);

// Report loaded event to parent
window.addEventListener('load', function() {
  console.log('Quiz game loaded successfully');
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
    } else {
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
  console.log("Game initialized for topic: ${topic}");
  
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
  }

  private createFullContent(htmlContent: string, cssContent: string, jsContent: string, title: string): string {
    // Fix: Replace raw string literals in template literals to prevent syntax errors
    const fixedJsContent = jsContent
      .replace(/\${topic}/g, "${topic}")
      .replace(/'/g, "\\'")
      .replace(/`/g, "\\`")
      .replace(/console\.log\("([^"]+)"\);/g, function(match, p1) {
        return match.replace(/\${topic}/, "${topic}");
      });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
${cssContent}
  </style>
</head>
<body>
${htmlContent.split('<!DOCTYPE html>')[1].split('</head>')[1].split('<body>')[1].split('</body>')[0]}
  <script>
${fixedJsContent}
  </script>
</body>
</html>`;
  }
}

// Export MiniGame type
export type { MiniGame };

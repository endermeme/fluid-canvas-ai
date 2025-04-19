
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { logInfo, logError, logWarning, logSuccess, measureExecutionTime } from './apiUtils';
import { makeGeminiRequest } from './api/geminiClient';
import { parseGeminiResponse } from './responseParser';
import { buildGeminiPrompt } from './promptBuilder';
import { generateCustomGamePrompt } from './customGamePrompt';
import { formatHtml } from '@/utils/html-processor';
import { formatCss, addBaseStyles } from '@/utils/css-processor';
import { formatJavaScript, addErrorHandling } from '@/utils/js-processor';
import { injectDebugUtils } from '@/utils/iframe-handler';

const SOURCE = "GEMINI";

/**
 * Tạo ra game với Gemini AI
 */
export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    type: gameType?.name || "Not specified",
    settings: settings || {},
    canvasMode: useCanvas ? "enabled" : "disabled"
  });

  const promptOptions = {
    topic,
    useCanvas,
    language: settings?.language || 'en',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  };

  const formattingInstructions = `
IMPORTANT CODE FORMATTING INSTRUCTIONS:
1. Return a SINGLE, complete, self-contained HTML file with all CSS and JavaScript included
2. Use proper HTML structure with DOCTYPE, html, head, and body tags
3. Include all JavaScript inside a SINGLE script tag at the end of the body
4. Format all CSS and JavaScript code with proper indentation
5. Use template literals correctly with backticks (\`) not regular quotes for dynamic content
6. Use clear parameter names in function declarations (NOT $2 or placeholder variables)
7. Include proper error handling for canvas operations
8. Make sure all HTML elements are properly closed
9. DO NOT include markdown syntax (\`\`\`) in your response
`;

  const prompt = generateCustomGamePrompt(promptOptions) + formattingInstructions;

  try {
    const startTime = Date.now();
    
    const { text } = await makeGeminiRequest({ prompt });
    
    const duration = measureExecutionTime(startTime);
    logSuccess(SOURCE, `Response received in ${duration.seconds}s`);
    
    console.log('%c Generated Game Code:', 'font-weight: bold; color: #6f42c1;');
    console.log(text);
    
    // Sử dụng parser để xử lý response
    const game = parseGeminiResponse(text);
    
    logSuccess(SOURCE, "Game generated successfully");
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    
    // Tạo một fallback game đơn giản khi API không khả dụng
    if (error.message && error.message.includes('NetworkError')) {
      const fallbackGame = createFallbackGame(topic);
      logWarning(SOURCE, "Using fallback game due to network error");
      return fallbackGame;
    }
    
    throw error;
  }
};

/**
 * Tạo một game đơn giản khi API không khả dụng
 */
const createFallbackGame = (topic: string): MiniGame => {
  const safeTopicName = topic.replace(/[^\w\s]/gi, '').trim() || "Interactive Game";
  
  const fallbackHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fallback Game: ${safeTopicName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #333;
        }
        
        .container {
            text-align: center;
            padding: 2rem;
            background-color: white;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            max-width: 800px;
            width: 100%;
        }
        
        h1 {
            color: #4a69bd;
            margin-bottom: 1rem;
        }
        
        .game-area {
            margin-top: 2rem;
            border: 2px solid #ddd;
            border-radius: 0.5rem;
            padding: 1rem;
            background-color: #f9f9f9;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .score {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 1rem 0;
        }
        
        button {
            background-color: #4a69bd;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
            margin: 0.5rem;
        }
        
        button:hover {
            background-color: #3c58a8;
        }
        
        button:disabled {
            background-color: #9aa5c3;
            cursor: not-allowed;
        }
        
        .message {
            margin-top: 1rem;
            font-style: italic;
            color: #666;
        }
        
        .target {
            width: 50px;
            height: 50px;
            background-color: #e74c3c;
            border-radius: 50%;
            display: none;
            position: absolute;
            cursor: pointer;
            transition: transform 0.1s;
        }
        
        .target:hover {
            transform: scale(1.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Simple Game: ${safeTopicName}</h1>
        
        <p>This is a fallback game due to network connection issues.</p>
        
        <div class="score">Score: <span id="scoreValue">0</span></div>
        
        <div class="game-area" id="gameArea">
            <p class="message" id="message">Click Start to begin!</p>
        </div>
        
        <div>
            <button id="startButton">Start Game</button>
            <button id="resetButton" disabled>Reset</button>
        </div>
    </div>

    <script>
        // Game variables
        let score = 0;
        let gameActive = false;
        let gameTimer;
        let targets = [];
        
        // DOM elements
        const scoreValue = document.getElementById('scoreValue');
        const message = document.getElementById('message');
        const gameArea = document.getElementById('gameArea');
        const startButton = document.getElementById('startButton');
        const resetButton = document.getElementById('resetButton');
        
        // Set up the game area for positioning
        gameArea.style.position = 'relative';
        gameArea.style.overflow = 'hidden';
        
        // Start game function
        function startGame() {
            if (gameActive) return;
            
            gameActive = true;
            score = 0;
            scoreValue.textContent = score;
            message.textContent = 'Click on the circles as they appear!';
            
            startButton.disabled = true;
            resetButton.disabled = false;
            
            // Start spawning targets
            gameTimer = setInterval(spawnTarget, 1000);
            spawnTarget();
        }
        
        // Reset game function
        function resetGame() {
            gameActive = false;
            clearInterval(gameTimer);
            
            // Remove all targets
            targets.forEach(target => {
                if (target.parentNode) {
                    target.parentNode.removeChild(target);
                }
            });
            targets = [];
            
            // Reset UI
            message.textContent = 'Game reset. Click Start to begin again!';
            startButton.disabled = false;
            resetButton.disabled = true;
        }
        
        // Spawn a new target
        function spawnTarget() {
            if (!gameActive) return;
            
            const target = document.createElement('div');
            target.className = 'target';
            
            // Random position within game area
            const maxX = gameArea.clientWidth - 50;
            const maxY = gameArea.clientHeight - 50;
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            
            // Random color
            const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Set position and color
            target.style.left = randomX + 'px';
            target.style.top = randomY + 'px';
            target.style.backgroundColor = randomColor;
            target.style.display = 'block';
            
            // Click handler
            target.addEventListener('click', () => {
                score += 10;
                scoreValue.textContent = score;
                
                // Visual feedback
                target.style.transform = 'scale(1.5)';
                target.style.opacity = '0';
                
                // Remove after animation
                setTimeout(() => {
                    if (target.parentNode) {
                        target.parentNode.removeChild(target);
                    }
                    const index = targets.indexOf(target);
                    if (index > -1) {
                        targets.splice(index, 1);
                    }
                }, 300);
            });
            
            // Add to game area and targets array
            gameArea.appendChild(target);
            targets.push(target);
            
            // Auto-remove after 2 seconds if not clicked
            setTimeout(() => {
                if (target.parentNode && gameActive) {
                    target.parentNode.removeChild(target);
                    const index = targets.indexOf(target);
                    if (index > -1) {
                        targets.splice(index, 1);
                    }
                }
            }, 2000);
        }
        
        // Event listeners
        startButton.addEventListener('click', startGame);
        resetButton.addEventListener('click', resetGame);
    </script>
</body>
</html>
`;

  return {
    title: `Simple Game: ${safeTopicName}`,
    content: fallbackHTML,
    description: "A fallback game created when network connection to AI is unavailable",
    isSeparatedFiles: false
  };
};

/**
 * Thử tạo game với Gemini và thử lại nếu thất bại
 */
export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 3;
  
  if (retryCount >= maxRetries) {
    logWarning(SOURCE, `Reached maximum retries (${maxRetries})`);
    
    // Khi đạt đến số lần thử lại tối đa, tạo game fallback
    const fallbackGame = createFallbackGame(topic);
    logWarning(SOURCE, "Using fallback game after maximum retries");
    return fallbackGame;
  }
  
  try {
    return await generateWithGemini(topic, settings);
  } catch (error) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    // Nếu là lỗi mạng, tạo ngay game fallback
    if (error.message && (error.message.includes('NetworkError') || error.message.includes('timeout'))) {
      const fallbackGame = createFallbackGame(topic);
      logWarning(SOURCE, "Using fallback game due to network error");
      return fallbackGame;
    }
    
    const waitTime = (retryCount + 1) * 1500;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};

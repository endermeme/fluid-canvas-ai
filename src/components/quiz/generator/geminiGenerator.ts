
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { 
  logInfo, logError, logWarning, logSuccess, 
  measureExecutionTime
} from './apiUtils';
import { 
  GEMINI_MODELS, 
  API_VERSION, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';
import { buildGeminiPrompt } from './promptBuilder';

const SOURCE = "GEMINI";

/**
 * Generates a game using direct API calls to Google's Gemini API
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @returns MiniGame object or null if generation fails
 */
export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  // Get game type from topic to provide better context for the AI
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  logInfo(SOURCE, `Starting game generation for "${topic}" using ${GEMINI_MODELS.CUSTOM_GAME}`, {
    model: GEMINI_MODELS.CUSTOM_GAME,
    apiVersion: API_VERSION,
    type: gameType?.name || "Not specified",
    settings: settings || {},
    canvasMode: useCanvas ? "enabled" : "disabled"
  });
  
  // Use the improved prompt builder with canvas mode setting
  const prompt = buildGeminiPrompt(topic, useCanvas);

  try {
    logInfo(SOURCE, `Sending request to Gemini API using model ${GEMINI_MODELS.CUSTOM_GAME} (${API_VERSION})`);
    
    const startTime = Date.now();
    
    // Create payload with improved generation settings for better code
    const payload = {
      contents: [{
        parts: [{text: prompt}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.7,  // Slightly higher for creativity but still structured
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192  // Ensure we get complete code
      }
    };
    
    // Make API call
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Parse response
    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      throw new Error('No content returned from API');
    }
    
    const duration = measureExecutionTime(startTime);
    
    logSuccess(SOURCE, `Response received in ${duration.seconds}s (${duration.ms}ms)`);
    logInfo(SOURCE, `Response length: ${text.length} characters`);
    
    // Log full response to console
    console.log('%c 📄 Full Gemini Response:', 'font-weight: bold; color: #6f42c1;');
    console.log(text);
    
    // Extract title from HTML
    let title = topic;
    const titleMatch = text.match(/<title>(.*?)<\/title>/i) || 
                      text.match(/<h1[^>]*>(.*?)<\/h1>/i);
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Extract HTML content properly
    let content = text;
    
    // Clean up the response - ensure it's just the HTML
    if (!content.trim().startsWith('<!DOCTYPE') && !content.trim().startsWith('<html')) {
      // Try to extract HTML from the response
      const htmlMatch = text.match(/<!DOCTYPE[\s\S]*<\/html>/i) || 
                        text.match(/<html[\s\S]*<\/html>/i);
      
      if (htmlMatch && htmlMatch[0]) {
        content = htmlMatch[0];
      }
    }
    
    // Sanitize content to prevent common JavaScript errors
    content = sanitizeGameCode(content, useCanvas);
    
    // Create MiniGame object
    const game: MiniGame = {
      title: title,
      content: content,
      useCanvas: useCanvas
    };
    
    logSuccess(SOURCE, "Game generated successfully", {
      title: title,
      contentSize: content.length,
      useCanvas: useCanvas
    });
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

/**
 * Sanitizes the game HTML/JS code to prevent common errors
 * @param content Original HTML content
 * @param useCanvas Whether Canvas API is being used
 * @returns Sanitized HTML content
 */
const sanitizeGameCode = (content: string, useCanvas: boolean): string => {
  let sanitized = content;
  
  // Fix common JavaScript errors
  
  // 1. Ensure requestAnimationFrame is properly called
  sanitized = sanitized.replace(
    /requestAnimationFrame\s*\(\s*\)/g, 
    'requestAnimationFrame(gameLoop)'
  );
  
  // 2. Fix canvas initialization if canvas mode is enabled
  if (useCanvas) {
    // Check if canvas is properly getting context
    if (!sanitized.includes('getContext')) {
      sanitized = sanitized.replace(
        /<canvas\s+id="([^"]+)"[^>]*>/,
        (match, canvasId) => {
          // Add canvas initialization after the closing body tag
          const initScript = `
            <script>
              // Initialize canvas
              const canvas = document.getElementById('${canvasId}');
              const ctx = canvas.getContext('2d');
              
              // Set canvas size
              function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
              }
              
              // Call resize on load and when window size changes
              window.addEventListener('resize', resizeCanvas);
              resizeCanvas();
            </script>
          `;
          return match + initScript;
        }
      );
    }
  }
  
  // 3. Fix event listeners to use proper syntax
  sanitized = sanitized.replace(
    /addEventListener\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^,)]+)\s*\)/g,
    'addEventListener("$1", $2)'
  );
  
  // 4. Add proper error handling to prevent crashes
  if (!sanitized.includes('try') && !sanitized.includes('catch')) {
    // Add global error handler
    sanitized = sanitized.replace(
      /<\/body>/,
      `
      <script>
        // Global error handling
        window.onerror = function(message, source, lineno, colno, error) {
          console.error('Game error:', message);
          console.error('At:', source, 'line:', lineno, 'column:', colno);
          console.error('Stack:', error && error.stack);
          return true; // Prevents default error handling
        };
      </script>
      </body>
      `
    );
  }
  
  return sanitized;
};

/**
 * Attempts to generate a game with Gemini, with retries on failure
 * @param model This parameter is no longer used but kept for compatibility
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @param retryCount Current retry count (internal use)
 * @returns MiniGame object or null if all retries fail
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
    return null;
  }
  
  try {
    logInfo(SOURCE, `Attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithGemini(topic, settings);
  } catch (error) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    // Wait a bit before retrying
    const waitTime = (retryCount + 1) * 1500;
    logInfo(SOURCE, `Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Display retry information
    console.log(
      `%c ${SOURCE} RETRY %c Attempt ${retryCount + 2}/${maxRetries+1}`,
      'background: #f9a825; color: black; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      ''
    );
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};

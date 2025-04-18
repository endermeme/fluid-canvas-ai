
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
import { processGeminiHtml } from './direct-html-parser';

const SOURCE = "GEMINI";

export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    model: GEMINI_MODELS.CUSTOM_GAME,
    apiVersion: API_VERSION,
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

  // Add instructions for direct HTML generation
  const directHtmlInstructions = `
IMPORTANT INSTRUCTIONS:
Create a complete interactive game about "${topic}" using HTML, CSS, and JavaScript. 
The output should be a fully functional HTML page that can be loaded directly in a browser.

Your response should follow this format:
1. Generate HTML with embedded CSS and JavaScript (no need to separate them into different files)
2. Do not include any explanations or markdown - ONLY provide the HTML code
3. Make sure the game is responsive and works on different screen sizes
4. Add proper error handling in JavaScript code
5. Make the game visually appealing with CSS
6. Ensure the game is interactive and engaging

Remember to include DOCTYPE, html, head, and body tags in your response.
`;

  // Generate prompt
  const prompt = buildGeminiPrompt(topic) + directHtmlInstructions;

  try {
    logInfo(SOURCE, `Sending request to Gemini API`);
    
    const startTime = Date.now();
    
    const payload = {
      contents: [{
        parts: [{text: prompt}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };
    
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
    
    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      throw new Error('No content returned from API');
    }
    
    const duration = measureExecutionTime(startTime);
    logSuccess(SOURCE, `Response received in ${duration.seconds}s`);
    
    console.log('%c Generated Game HTML:', 'font-weight: bold; color: #6f42c1;');
    console.log(text.substring(0, 500) + '...');
    
    // Process the HTML directly without separating files
    const miniGame = processGeminiHtml(text);
    
    logSuccess(SOURCE, "Game generated successfully");
    
    return miniGame;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

// Sanitize game code to ensure it works properly
const sanitizeGameCode = (content: string): string => {
  let sanitized = content;
  
  // Add error handling script while preserving formatting
  if (!sanitized.includes('window.onerror')) {
    sanitized = sanitized.replace(
      /<\/body>/,
      `
  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
  </script>
</body>
`
    );
  }
  
  return sanitized;
};

// Retry mechanism for Gemini API calls
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
    return await generateWithGemini(topic, settings);
  } catch (error) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    const waitTime = (retryCount + 1) * 1500;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};

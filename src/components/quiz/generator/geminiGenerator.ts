
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
import { generateCustomGamePrompt } from './customGamePrompt';

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

  const prompt = generateCustomGamePrompt(promptOptions);

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
    
    console.log('%c Generated Game Code:', 'font-weight: bold; color: #6f42c1;');
    console.log(text);
    
    let title = topic;
    const titleMatch = text.match(/<title>(.*?)<\/title>/i) || 
                      text.match(/<h1[^>]*>(.*?)<\/h1>/i);
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    let content = text;
    
    if (!content.trim().startsWith('<!DOCTYPE') && !content.trim().startsWith('<html')) {
      const htmlMatch = text.match(/<!DOCTYPE[\s\S]*<\/html>/i) || 
                        text.match(/<html[\s\S]*<\/html>/i);
      
      if (htmlMatch && htmlMatch[0]) {
        content = htmlMatch[0];
      }
    }
    
    content = sanitizeGameCode(content);
    
    const game: MiniGame = {
      title: title,
      content: content,
      useCanvas: useCanvas
    };
    
    logSuccess(SOURCE, "Game generated successfully");
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

const sanitizeGameCode = (content: string): string => {
  let sanitized = content;
  
  sanitized = sanitized
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    .replace(/\s*\n\s*\n\s*/g, '\n')
    .trim();
  
  sanitized = sanitized.replace(
    /requestAnimationFrame\s*\(\s*\)/g, 
    'requestAnimationFrame(gameLoop)'
  );
  
  sanitized = sanitized.replace(
    /addEventListener\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^,)]+)\s*\)/g,
    'addEventListener("$1", $2)'
  );

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
  
  return sanitized;
};

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

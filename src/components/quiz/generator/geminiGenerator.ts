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
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GEMINI";

// Export the MiniGame type for use in other files
export type { MiniGame } from './types';

// Tạo lớp AIGameGenerator để giữ tương thích với code cũ
export class AIGameGenerator {
  private static instance: AIGameGenerator | null = null;

  private constructor() {}

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    return tryGeminiGeneration(null, topic, settings);
  }
}

export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    model: GEMINI_MODELS.CUSTOM_GAME,
    apiVersion: API_VERSION,
    settings: settings || {}
  });

  const promptOptions = {
    topic,
    language: settings?.language || 'vi',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  };

  // Add enhanced instructions for proper code formatting to the prompt
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

  // Generate prompt with formatting instructions
  const prompt = generateCustomGamePrompt(promptOptions) + formattingInstructions;

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
      useCanvas: true
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
  
  // Remove markdown code block syntax if present
  sanitized = sanitized.replace(/```html|```/g, '');
  
  // Fix function parameters
  sanitized = sanitized.replace(/function\s+(\w+)\s*\(\$2\)/g, (match, funcName) => {
    if (funcName === 'drawSegment') return 'function drawSegment(index)';
    if (funcName === 'getWinningSegment') return 'function getWinningSegment(finalAngle)';
    if (funcName === 'spinWheel') return 'function spinWheel()';
    if (funcName === 'drawWheel') return 'function drawWheel()';
    return match;
  });
  
  // Fix template literals
  sanitized = sanitized.replace(/(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\)/g, 
    "$1`rotate(${$2}$3)`");
  
  sanitized = sanitized.replace(/(\w+\.textContent\s*=\s*)([^;"`']*)\$\{([^}]+)\}([^;"`']*);/g, 
    "$1`$2${$3}$4`;");
  
  // Add error handling for canvas context
  if (sanitized.includes('getContext') && !sanitized.includes('if (!ctx)')) {
    sanitized = sanitized.replace(
      /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
      "const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Canvas context not available'); return; }"
    );
  }
  
  // Add error handling script
  if (!sanitized.includes('window.onerror')) {
    sanitized = sanitized.replace(
      /<\/body>/,
      `  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
  </script>
</body>`
    );
  }
  
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

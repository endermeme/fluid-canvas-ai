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

  // Hướng dẫn định dạng code chi tiết hơn
  const formattingInstructions = `
FORMATTING REQUIREMENTS (CRITICAL - MUST FOLLOW):
1. Code must be properly formatted with clear indentation and line breaks
2. Separate code into distinct sections with proper spacing
3. HTML tags should each be on their own lines with proper nesting indentation
4. JavaScript functions should have clear structure and formatting
5. CSS rules should be properly spaced with each property on a new line
6. All opening and closing brackets should be properly aligned
7. Each HTML, CSS, and JavaScript code block MUST be properly formatted - NOT all on one line
8. Use the following format for code blocks:

\`\`\`html
<!-- HTML neatly formatted with indentation -->
<div class="container">
  <div class="game-area">
    <h1>Game Title</h1>
  </div>
</div>
\`\`\`

\`\`\`css
/* CSS neatly formatted */
.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}
\`\`\`

\`\`\`js
// JavaScript neatly formatted
document.addEventListener('DOMContentLoaded', function() {
  // Initialize game
  const gameArea = document.querySelector('.game-area');
  
  function startGame() {
    // Game logic
    console.log('Game started');
  }
  
  startGame();
});
\`\`\`
`;

  // Tạo prompt với hướng dẫn định dạng
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
    
    // Phân tích và báo cáo về định dạng phản hồi
    const hasMarkdownBlocks = text.includes('```html') && (text.includes('```css') || text.includes('```js'));
    const isCompleteHtml = text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html');
    const isOneLineHtml = text.includes('</head>') && !text.includes('\n</head>');
    
    console.log('%c Generated Game Code Format Analysis:', 'font-weight: bold; color: #6f42c1;');
    console.log(`- Has markdown blocks: ${hasMarkdownBlocks ? 'Yes' : 'No'}`);
    console.log(`- Is complete HTML: ${isCompleteHtml ? 'Yes' : 'No'}`);
    console.log(`- Is one-line HTML: ${isOneLineHtml ? 'Yes' : 'No'}`);
    console.log(`- Approximate length: ${text.length} characters`);
    
    console.log('%c Generated Game Code (First 500 chars):', 'font-weight: bold; color: #6f42c1;');
    console.log(text.substring(0, 500) + '...');
    
    let title = topic;
    const titleMatch = text.match(/<title>(.*?)<\/title>/i) || 
                      text.match(/<h1[^>]*>(.*?)<\/h1>/i);
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    let content = text;
    
    if (!isCompleteHtml && !hasMarkdownBlocks) {
      // Nếu không phải là HTML hoàn chỉnh hoặc markdown blocks, thử tìm HTML
      const htmlMatch = text.match(/<!DOCTYPE[\s\S]*<\/html>/i) || 
                        text.match(/<html[\s\S]*<\/html>/i);
      
      if (htmlMatch && htmlMatch[0]) {
        content = htmlMatch[0];
        console.log('🔶 Gemini: Extracted HTML content from mixed response');
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
  
  // Check if content is in one line and directly format it if needed
  if (sanitized.includes('</head>') && !sanitized.includes('\n</head>')) {
    console.log("🔶 Gemini: Detecting one-line HTML response, applying special formatting");
    // Let responseParser handle the formatting
    return sanitized;
  }
  
  // Basic code cleanup while preserving line breaks and formatting
  sanitized = sanitized
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\/\/[^\n]*/g, '') // Remove single-line comments
    .trim();
  
  // Fix common JavaScript issues while preserving formatting
  sanitized = sanitized.replace(
    /requestAnimationFrame\s*\(\s*\)/g, 
    'requestAnimationFrame(gameLoop)'
  );
  
  sanitized = sanitized.replace(
    /addEventListener\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^,)]+)\s*\)/g,
    'addEventListener("$1", $2)'
  );

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

import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { 
  logInfo, logError, logWarning, logSuccess, 
  measureExecutionTime, createAPIError, categorizeError,
  ERROR_CODES, APIError
} from './apiUtils';
import { 
  GEMINI_MODELS, 
  API_VERSION, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';
import { createGameGenerationPrompt } from './geminiPrompt';
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GEMINI";

// Request timeout: 3 phút (180 giây)
const REQUEST_TIMEOUT = 180000;

// Export the MiniGame type for use in other files
export type { MiniGame } from './types';

// Tạo lớp AIGameGenerator để giữ tương thích với code cũ
export class AIGameGenerator {
  private static instance: AIGameGenerator | null = null;
  private canvasMode: boolean = true;

  private constructor() {}

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public setCanvasMode(mode: boolean): void {
    this.canvasMode = mode;
  }

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    // Sử dụng biến canvasMode từ instance
    const useCanvasMode = settings?.useCanvas !== undefined ? settings.useCanvas : this.canvasMode;
    const updatedSettings = {
      ...settings,
      useCanvas: useCanvasMode
    };
    
    return generateWithGemini(topic, updatedSettings);
  }
}

export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    model: GEMINI_MODELS.CUSTOM_GAME,
    type: gameType?.name || "general",
    canvasMode: useCanvas ? "enabled" : "disabled",
    timeout: `${REQUEST_TIMEOUT / 1000} seconds`
  });

  // Tạo prompt với template cải tiến từ geminiPrompt.ts
  const prompt = createGameGenerationPrompt({
    topic,
    useCanvas,
    language: settings?.language || 'en',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  });

  try {
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
        maxOutputTokens: 4096
      }
    };
    
    // Tạo AbortController để handle timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);
    
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    // Clear timeout nếu request thành công
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      const errorCode = response.status === 429 ? ERROR_CODES.API_QUOTA_EXCEEDED : ERROR_CODES.API_REQUEST_FAILED;
      throw createAPIError(
        errorCode,
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
        { status: response.status, topic, model: GEMINI_MODELS.CUSTOM_GAME }
      );
    }
    
    const result = await response.json();
    
    // Simplified response validation and parsing
    const { text, hasWarning, warningMessage } = parseAPIResponse(result);
    
    if (!text || text.trim().length === 0) {
      throw createAPIError(
        ERROR_CODES.API_NO_CONTENT,
        `No content returned from API. Finish reason: ${result?.candidates?.[0]?.finishReason || 'unknown'}`,
        { topic, finishReason: result?.candidates?.[0]?.finishReason }
      );
    }
    
    const duration = measureExecutionTime(startTime);
    
    if (hasWarning && warningMessage) {
      logWarning(SOURCE, warningMessage, { duration: duration.seconds });
    } else {
      logSuccess(SOURCE, `Game generated successfully`, { duration: duration.seconds });
    }
    
    // Xử lý code để extract thông tin và clean
    const { title, content } = processGameCode(text);
    
    // Tạo đối tượng game
    const game: MiniGame = {
      title: title || topic,
      content: content,
      useCanvas: useCanvas
    };
    
    // Final validation log
    logInfo(SOURCE, "Game validation completed", {
      title: game.title,
      contentLength: game.content.length,
      hasDocType: game.content.includes('<!DOCTYPE')
    });
    
    return game;
  } catch (error) {
    // Enhanced error handling with categorization
    const errorCode = categorizeError(error);
    
    if (error instanceof APIError) {
      logError(SOURCE, "API Error occurred", error);
      throw error;
    } else {
      const structuredError = createAPIError(
        errorCode,
        error.message || "Unknown error occurred",
        { topic, useCanvas, originalError: error.name }
      );
      logError(SOURCE, "Error generating with Gemini", structuredError);
      throw structuredError;
    }
  }
};

/**
 * Parse API response and extract essential information
 */
function parseAPIResponse(result: any): { text: string, hasWarning: boolean, warningMessage?: string } {
  // Essential validation only
  if (!result?.candidates || result.candidates.length === 0) {
    throw createAPIError(
      ERROR_CODES.API_NO_CONTENT,
      'No candidates returned from API',
      { candidatesCount: 0 }
    );
  }
  
  const candidate = result.candidates[0];
  let hasWarning = false;
  let warningMessage = '';
  
  // Check for truncation warning
  if (candidate.finishReason === 'MAX_TOKENS') {
    hasWarning = true;
    warningMessage = 'Response truncated due to length limit, but game should still work';
  }
  
  // Extract text content efficiently
  let text = '';
  if (candidate.content?.parts?.[0]?.text) {
    text = candidate.content.parts[0].text;
  } else if (candidate.content?.parts) {
    // Fallback: concatenate all text parts
    const parts = candidate.content.parts || [];
    for (const part of parts) {
      if (part.text) {
        text += part.text;
      }
    }
  }
  
  return { text, hasWarning, warningMessage };
}

/**
 * Xử lý mã code trả về từ Gemini để extract thông tin và làm sạch
 */
const processGameCode = (text: string): { title: string, content: string } => {
  // Loại bỏ hoàn toàn cú pháp markdown nếu có
  let cleanedContent = text.trim();
  
  // 1. Loại bỏ markdown code block syntax
  const codeBlockRegex = /^```(?:html|javascript)?\s*([\s\S]*?)```$/;
  const codeBlockMatch = cleanedContent.match(codeBlockRegex);
  
  if (codeBlockMatch && codeBlockMatch[1]) {
    cleanedContent = codeBlockMatch[1].trim();
  } else {
    // Nếu không tìm thấy, vẫn xóa các dấu hiệu markdown
    cleanedContent = cleanedContent.replace(/```html|```javascript|```/g, '').trim();
  }
  
  // 2. Đảm bảo code HTML đầy đủ và đúng cấu trúc
  if (!cleanedContent.toLowerCase().includes('<!doctype html>') && 
      !cleanedContent.toLowerCase().startsWith('<html') &&
      !cleanedContent.toLowerCase().startsWith('<!--')) {
    // Tìm HTML trong văn bản nếu không có doctype
    const htmlPattern = /<html[\s\S]*?<\/html>/i;
    const htmlMatch = cleanedContent.match(htmlPattern);
    
    if (htmlMatch && htmlMatch[0]) {
      cleanedContent = `<!DOCTYPE html>\n${htmlMatch[0]}`;
    } else {
      // Nếu không có thẻ HTML đầy đủ, bọc nội dung lại
      cleanedContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanedContent.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1] || 'Interactive Game'}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: sans-serif; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    ${cleanedContent}
  </div>
  <script>
    // Console error catching
    window.onerror = (msg, src, line, col, err) => {
      console.error('Game error:', msg, 'at', line, ':', col);
      return true;
    }
  </script>
</body>
</html>`;
    }
  }
  
  // 3. Sửa các lỗi cú pháp JavaScript phổ biến
  let sanitized = cleanedContent;
  
  // Sửa các template literals bị lỗi - ghi đè bằng regexp phức tạp hơn
  sanitized = sanitized.replace(/(\w+\.(?:style\.transform|innerHTML|textContent|innerText)\s*=\s*)(['"])?([^'"`;]*)\$\{([^}]+)\}([^'"`;]*)(['"])?;?/g, 
    (match, prefix, openQuote, before, expr, after, closeQuote) => {
      // Nếu đã có backticks thì giữ nguyên
      if (!openQuote && !closeQuote) return match;
      
      // Thay thế quotes bằng backticks
      return `${prefix}\`${before}\${${expr}}${after}\`;`;
    });
  
  // Sửa các tham số hàm bị lỗi
  sanitized = sanitized.replace(/function\s+(\w+)\s*\(\$(\d+)\)/g, (match, funcName, paramNum) => {
    const paramNames = {
      'drawSegment': 'index',
      'getWinningSegment': 'finalAngle',
      'spinWheel': '',
      'drawWheel': '',
      'updateScore': 'points',
      'checkAnswer': 'selectedOption',
      'startGame': '',
      'endGame': '',
      'resetGame': '',
    };
    
    if (paramNames.hasOwnProperty(funcName)) {
      return `function ${funcName}(${paramNames[funcName]})`;
    }
    
    // Nếu không có trong danh sách, thay thế bằng param + số
    return `function ${funcName}(param${paramNum})`;
  });
  
  // 4. Đảm bảo xử lý lỗi cho canvas
  if (sanitized.includes('getContext') && !sanitized.includes('if (!ctx)')) {
    sanitized = sanitized.replace(
      /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
      "const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Canvas context not available'); return; }"
    );
  }
  
  // 5. Đảm bảo tất cả CSS được đặt trong thẻ <style>
  const cssBlockMatch = sanitized.match(/\/\*\s*CSS\s*\*\/([\s\S]*?)\/\*\s*End CSS\s*\*\//i);
  if (cssBlockMatch && cssBlockMatch[1] && !cssBlockMatch[0].includes('<style>')) {
    const cssContent = cssBlockMatch[1].trim();
    sanitized = sanitized.replace(
      cssBlockMatch[0],
      `<style>\n${cssContent}\n</style>`
    );
  }
  
  // 6. Thêm xử lý lỗi window.onerror nếu chưa có
  if (!sanitized.includes('window.onerror')) {
    const errorHandlingScript = `
  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
  </script>`;
    
    if (sanitized.includes('</body>')) {
      sanitized = sanitized.replace('</body>', `${errorHandlingScript}\n</body>`);
    } else if (sanitized.includes('</html>')) {
      sanitized = sanitized.replace('</html>', `${errorHandlingScript}\n</html>`);
    }
  }
  
  // 7. Extract title
  let title = '';
  const titleTag = sanitized.match(/<title>(.*?)<\/title>/is);
  if (titleTag && titleTag[1]) {
    title = titleTag[1].trim();
  } else {
    const h1Tag = sanitized.match(/<h1[^>]*>(.*?)<\/h1>/is);
    if (h1Tag && h1Tag[1]) {
      title = h1Tag[1].replace(/<[^>]*>/g, '').trim();
    }
  }
  
  return {
    title,
    content: sanitized
  };
};

// Loại bỏ hoàn toàn function tryGeminiGeneration với retry logic
export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  // Chỉ gọi generateWithGemini một lần duy nhất, không retry
  logInfo(SOURCE, `Single attempt generation (no retries)`);
  return await generateWithGemini(topic, settings);
};


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
import { createGameGenerationPrompt } from './geminiPrompt';
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GEMINI";

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
    
    return tryGeminiGeneration(null, topic, updatedSettings);
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
    apiVersion: API_VERSION,
    type: gameType?.name || "Not specified",
    settings: settings || {},
    canvasMode: useCanvas ? "enabled" : "disabled"
  });

  // Tạo prompt với template cải tiến từ geminiPrompt.ts
  const prompt = createGameGenerationPrompt({
    topic,
    useCanvas,
    language: settings?.language || 'vi',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  });

  try {
    logInfo(SOURCE, `Sending request to Gemini API`);
    console.log('🔍 GEMINI DEBUG - Full prompt being sent:', prompt.substring(0, 500) + '...');
    
    const startTime = Date.now();
    
    const payload = {
      contents: [{
        parts: [{text: prompt}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };
    
    console.log('🔍 GEMINI DEBUG - Request payload:', {
      endpoint: getApiEndpoint(),
      payloadStructure: {
        contents: payload.contents.length,
        generationConfig: Object.keys(payload.generationConfig),
        promptLength: prompt.length
      }
    });
    
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log('🔍 GEMINI DEBUG - Response status:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 GEMINI DEBUG - Error response text:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // Chi tiết logging của response structure
    console.log('🔍 GEMINI DEBUG - Full API Response:', {
      fullResponse: result,
      responseKeys: Object.keys(result || {}),
      responseType: typeof result
    });
    
    // Debug log để xem response structure chi tiết
    logInfo(SOURCE, "Detailed API Response analysis:", {
      hasResult: !!result,
      resultKeys: result ? Object.keys(result) : [],
      hasCandidates: !!result?.candidates,
      candidatesType: typeof result?.candidates,
      candidatesLength: Array.isArray(result?.candidates) ? result.candidates.length : 'not array',
      candidatesContent: result?.candidates ? result.candidates.map((c: any, i: number) => ({
        index: i,
        keys: Object.keys(c || {}),
        hasContent: !!c?.content,
        contentKeys: c?.content ? Object.keys(c.content) : [],
        hasParts: !!c?.content?.parts,
        partsLength: Array.isArray(c?.content?.parts) ? c.content.parts.length : 'not array',
        partsContent: c?.content?.parts ? c.content.parts.map((p: any, pi: number) => ({
          partIndex: pi,
          partKeys: Object.keys(p || {}),
          hasText: !!p?.text,
          textLength: p?.text ? p.text.length : 0,
          textPreview: p?.text ? p.text.substring(0, 100) : 'no text'
        })) : 'no parts',
        finishReason: c?.finishReason
      })) : 'no candidates'
    });
    
    // Improved content extraction logic với nhiều fallback paths
    let text = '';
    let extractionMethod = '';
    
    // Method 1: Standard path
    if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = result.candidates[0].content.parts[0].text;
      extractionMethod = 'standard_path';
    }
    // Method 2: Direct content text
    else if (result?.candidates?.[0]?.content?.text) {
      text = result.candidates[0].content.text;
      extractionMethod = 'content_text';
    }
    // Method 3: Direct candidate text
    else if (result?.candidates?.[0]?.text) {
      text = result.candidates[0].text;
      extractionMethod = 'candidate_text';
    }
    // Method 4: Root text
    else if (result?.text) {
      text = result.text;
      extractionMethod = 'root_text';
    }
    // Method 5: Try to find text in nested structure
    else if (result?.candidates?.[0]) {
      const candidate = result.candidates[0];
      console.log('🔍 GEMINI DEBUG - Searching in candidate structure:', candidate);
      
      // Deep search in candidate object
      function findTextRecursively(obj: any, path: string = ''): string {
        if (typeof obj === 'string' && obj.length > 100) {
          console.log(`🔍 GEMINI DEBUG - Found text at path: ${path}`, obj.substring(0, 100));
          return obj;
        }
        if (typeof obj === 'object' && obj !== null) {
          for (const [key, value] of Object.entries(obj)) {
            const result = findTextRecursively(value, `${path}.${key}`);
            if (result) return result;
          }
        }
        return '';
      }
      
      text = findTextRecursively(candidate, 'candidate');
      if (text) extractionMethod = 'recursive_search';
    }
    
    console.log('🔍 GEMINI DEBUG - Text extraction result:', {
      extractionMethod,
      textFound: !!text,
      textLength: text.length,
      textPreview: text.substring(0, 200),
      isValidHTML: text.includes('<!DOCTYPE') || text.includes('<html'),
      hasGameContent: text.toLowerCase().includes('game') || text.toLowerCase().includes('canvas')
    });
    
    if (!text || text.length < 50) {
      // Final attempt: Log full response for manual inspection
      console.error('🔍 GEMINI DEBUG - NO CONTENT FOUND - Full response for manual inspection:', {
        fullResponseString: JSON.stringify(result, null, 2),
        allPossibleTextFields: {
          'result.text': result?.text,
          'result.content': result?.content,
          'result.message': result?.message,
          'result.data': result?.data,
          'result.response': result?.response
        }
      });
      
      logError(SOURCE, "No valid content in response after all extraction attempts", {
        fullResponse: result,
        extractedText: text,
        textLength: text.length,
        extractionMethod: extractionMethod || 'none'
      });
      throw new Error(`No content returned from API. Extraction method: ${extractionMethod}. Response keys: ${Object.keys(result || {}).join(', ')}`);
    }
    
    const duration = measureExecutionTime(startTime);
    logSuccess(SOURCE, `Response received in ${duration.seconds}s using method: ${extractionMethod}`);
    
    // Log generated code preview
    console.log('🔍 GEMINI DEBUG - Generated code analysis:', {
      codeLength: text.length,
      hasDoctype: text.includes('<!DOCTYPE'),
      hasHTML: text.includes('<html'),
      hasHead: text.includes('<head'),
      hasBody: text.includes('<body'),
      hasScript: text.includes('<script'),
      hasStyle: text.includes('<style'),
      hasCanvas: text.includes('canvas'),
      codePreview: text.substring(0, 500)
    });
    
    // Xử lý code để extract thông tin và clean
    const { title, content } = processGameCode(text);
    
    console.log('🔍 GEMINI DEBUG - Processed game result:', {
      originalLength: text.length,
      processedLength: content.length,
      title,
      hasValidStructure: content.includes('<!DOCTYPE') && content.includes('</html>')
    });
    
    // Tạo đối tượng game
    const game: MiniGame = {
      title: title || topic,
      content: content,
      useCanvas: useCanvas
    };
    
    logSuccess(SOURCE, "Game generated successfully", {
      title: game.title,
      contentLength: game.content.length,
      hasDocType: game.content.includes('<!DOCTYPE')
    });
    
    return game;
  } catch (error) {
    console.error('🔍 GEMINI DEBUG - Full error details:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : 'No stack',
      errorType: typeof error
    });
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

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
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanedContent.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1] || 'Game Xếp Hình'}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f0f2f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="container">
    <h1>Game Xếp Hình</h1>
    <p>Game đang được tạo...</p>
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
    title: title || 'Game Xếp Hình',
    content: sanitized
  };
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 3;
  
  console.log(`🔍 GEMINI DEBUG - Retry attempt ${retryCount + 1}/${maxRetries}`, {
    topic,
    settings,
    retryCount
  });
  
  if (retryCount >= maxRetries) {
    logWarning(SOURCE, `Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    return await generateWithGemini(topic, settings);
  } catch (error) {
    console.error(`🔍 GEMINI DEBUG - Retry ${retryCount + 1} failed:`, {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      willRetry: retryCount < maxRetries - 1
    });
    
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    const waitTime = (retryCount + 1) * 2000; // Tăng thời gian chờ
    console.log(`🔍 GEMINI DEBUG - Waiting ${waitTime}ms before retry...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};
